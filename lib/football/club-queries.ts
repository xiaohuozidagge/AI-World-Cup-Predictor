import "server-only"

import { cache } from "react"
import { unstable_cache } from "next/cache"

import { getPublicSupabase } from "@/lib/supabase/public"
import type { FixtureStatus } from "@/lib/supabase/types"
import { REVALIDATE_SECONDS } from "./queries"

/**
 * Public, read-only query layer for clubs (Phase 6).
 *
 * Mirrors `lib/football/queries.ts`: every query talks only to the *public*
 * client (anon role), never the secret key, and never calls football-data.org
 * from the request path. RLS restricts the anon role to SELECT on competitions
 * / teams / fixtures.
 *
 * No N+1: a club's fixtures, its competitions, its season stats, upcoming,
 * recent results and last-updated timestamp are all derived from ONE cached
 * query (`getClubFixturesAll`) that fetches every fixture where the club is
 * home or away — a club plays ~40–60 matches, so this is a handful of rows.
 * React `cache()` dedupes that query within a request, and `unstable_cache`
 * reuses it for 30 minutes.
 *
 * The stats math is a pure function (`computeClubSeasonStats`) so it can be
 * unit-tested independently of the database.
 */

const PROVIDER = "football-data.org"
const UPCOMING_STATUSES: FixtureStatus[] = ["SCHEDULED", "TIMED"]

// --- raw row shapes (supabase returns plain JSON) ----------------------------

interface ClubRaw {
  id: string
  name: string
  short_name: string | null
  slug: string
  country: string | null
}

interface ClubCompetitionRaw {
  id: string
  slug: string
  name: string
  short_name: string | null
  country: string | null
  current_season: number | null
}

interface ClubFixtureRaw {
  id: string
  provider_fixture_id: number
  kickoff_at: string
  status: FixtureStatus
  stage: string | null
  matchweek: number | null
  season: number
  home_score: number | null
  away_score: number | null
  source_updated_at: string | null
  updated_at: string | null
  competition: ClubCompetitionRaw | null
  home_team: ClubRaw | null
  away_team: ClubRaw | null
}

interface TeamCompRefRaw {
  home_team_id: string
  away_team_id: string
  competition_id: string
}

// --- public shapes -----------------------------------------------------------

export interface Club {
  id: string
  name: string
  shortName: string | null
  slug: string
  country: string | null
}

export interface ClubCompetition {
  id: string
  slug: string
  name: string
  shortName: string | null
  country: string | null
  currentSeason: number | null
}

export interface ClubWithCompetitions extends Club {
  competitions: ClubCompetition[]
}

export interface ClubFixture {
  id: string
  /** Present on real DB fixtures; optional so hand-built test fixtures stay valid. */
  providerFixtureId?: number
  kickoffAt: string
  status: FixtureStatus
  stage: string | null
  matchweek: number | null
  season: number
  homeTeam: Club
  awayTeam: Club
  homeScore: number | null
  awayScore: number | null
  competition: ClubCompetition
  sourceUpdatedAt: string | null
  updatedAt: string | null
}

export type MatchOutcome = "W" | "D" | "L"

export interface ClubSplitRecord {
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
}

export interface ClubRecord extends ClubSplitRecord {
  home: ClubSplitRecord
  away: ClubSplitRecord
  form: MatchOutcome[]
}

export interface ClubStatsResult {
  overall: ClubRecord
  byCompetition: { competition: ClubCompetition; stats: ClubSplitRecord }[]
}

export interface ClubPageData {
  club: Club
  competitions: ClubCompetition[]
  stats: ClubStatsResult
  upcoming: ClubFixture[]
  recent: ClubFixture[]
  lastUpdatedAt: string | null
  currentSeason: number | null
}

/**
 * Three-way lookup result so the page can tell an unknown slug (→ real 404)
 * from a temporary database failure (→ degrade gracefully, never 404 a club
 * that actually exists).
 */
export type ClubLookup = { status: "found"; club: Club } | { status: "not_found" } | { status: "error" }

export type ClubPageResult =
  | { status: "ok"; data: ClubPageData }
  | { status: "not_found" }
  | { status: "error" }

// --- helpers -----------------------------------------------------------------

function logQueryError(scope: string, error: unknown): void {
  const code = (error as { code?: string } | null)?.code
  console.error(`[club queries] ${scope} failed${code ? ` (${code})` : ""}`)
}

function mapClub(raw: ClubRaw): Club {
  return { id: raw.id, name: raw.name, shortName: raw.short_name, slug: raw.slug, country: raw.country }
}

function mapCompetition(raw: ClubCompetitionRaw): ClubCompetition {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    shortName: raw.short_name,
    country: raw.country,
    currentSeason: raw.current_season,
  }
}

function mapClubFixture(raw: ClubFixtureRaw): ClubFixture | null {
  if (!raw.home_team || !raw.away_team || !raw.competition) return null
  return {
    id: raw.id,
    providerFixtureId: raw.provider_fixture_id,
    kickoffAt: raw.kickoff_at,
    status: raw.status,
    stage: raw.stage,
    matchweek: raw.matchweek,
    season: raw.season,
    homeTeam: mapClub(raw.home_team),
    awayTeam: mapClub(raw.away_team),
    homeScore: raw.home_score,
    awayScore: raw.away_score,
    competition: mapCompetition(raw.competition),
    sourceUpdatedAt: raw.source_updated_at,
    updatedAt: raw.updated_at,
  }
}

const COMPETITION_SLUG_ORDER = ["premier-league", "champions-league"]

function compareCompetitions(a: ClubCompetition, b: ClubCompetition): number {
  const ia = COMPETITION_SLUG_ORDER.indexOf(a.slug)
  const ib = COMPETITION_SLUG_ORDER.indexOf(b.slug)
  const ra = ia === -1 ? Number.MAX_SAFE_INTEGER : ia
  const rb = ib === -1 ? Number.MAX_SAFE_INTEGER : ib
  return ra - rb || a.name.localeCompare(b.name)
}

function distinctCompetitions(fixtures: ClubFixture[]): ClubCompetition[] {
  const map = new Map<string, ClubCompetition>()
  for (const f of fixtures) {
    if (!map.has(f.competition.id)) map.set(f.competition.id, f.competition)
  }
  return [...map.values()].sort(compareCompetitions)
}

function maxCurrentSeason(comps: ClubCompetition[]): number | null {
  let max: number | null = null
  for (const c of comps) {
    if (c.currentSeason != null && (max == null || c.currentSeason > max)) max = c.currentSeason
  }
  return max
}

// --- pure stats math ---------------------------------------------------------

type FinishedClubFixture = ClubFixture & { homeScore: number; awayScore: number }

function isFinishedWithScore(f: ClubFixture): f is FinishedClubFixture {
  return f.status === "FINISHED" && f.homeScore != null && f.awayScore != null
}

function emptySplit(): ClubSplitRecord {
  return { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 }
}

function emptyRecord(): ClubRecord {
  return { ...emptySplit(), home: emptySplit(), away: emptySplit(), form: [] }
}

function outcomeFor(goalsFor: number, goalsAgainst: number): MatchOutcome {
  if (goalsFor > goalsAgainst) return "W"
  if (goalsFor < goalsAgainst) return "L"
  return "D"
}

function addSplit(rec: ClubSplitRecord, goalsFor: number, goalsAgainst: number, outcome: MatchOutcome): void {
  rec.played += 1
  rec.goalsFor += goalsFor
  rec.goalsAgainst += goalsAgainst
  if (outcome === "W") rec.won += 1
  else if (outcome === "D") rec.drawn += 1
  else rec.lost += 1
  rec.goalDifference = rec.goalsFor - rec.goalsAgainst
}

/**
 * Pure season-stats computation. Counts only FINISHED matches with a real
 * final score; scheduled/postponed/cancelled and null-score matches are
 * ignored. Goals are taken from the club's own perspective (home → home_score,
 * away → away_score). Each fixture is counted exactly once, so a club that
 * plays in both Premier League and Champions League is never double-counted —
 * its two competitions are simply summed into the overall record and split
 * apart in `byCompetition`.
 */
export function computeClubSeasonStats(teamId: string, fixtures: ClubFixture[]): ClubStatsResult {
  const finished = fixtures.filter(isFinishedWithScore)
  // Most recent first, for the last-5 form.
  const sorted = [...finished].sort((a, b) => b.kickoffAt.localeCompare(a.kickoffAt))

  const overall = emptyRecord()
  const byComp = new Map<string, { competition: ClubCompetition; stats: ClubSplitRecord }>()

  for (const f of sorted) {
    const isHome = f.homeTeam.id === teamId
    const goalsFor = isHome ? f.homeScore : f.awayScore
    const goalsAgainst = isHome ? f.awayScore : f.homeScore
    const outcome = outcomeFor(goalsFor, goalsAgainst)

    addSplit(overall, goalsFor, goalsAgainst, outcome)
    addSplit(isHome ? overall.home : overall.away, goalsFor, goalsAgainst, outcome)

    let entry = byComp.get(f.competition.id)
    if (!entry) {
      entry = { competition: f.competition, stats: emptySplit() }
      byComp.set(f.competition.id, entry)
    }
    addSplit(entry.stats, goalsFor, goalsAgainst, outcome)
  }

  overall.form = sorted.slice(0, 5).map((f) => {
    const isHome = f.homeTeam.id === teamId
    const goalsFor = isHome ? f.homeScore : f.awayScore
    const goalsAgainst = isHome ? f.awayScore : f.homeScore
    return outcomeFor(goalsFor, goalsAgainst)
  })

  return {
    overall,
    byCompetition: [...byComp.values()].sort((a, b) => compareCompetitions(a.competition, b.competition)),
  }
}

// --- queries -----------------------------------------------------------------

export const getAllClubs = cache(
  unstable_cache(
    async (): Promise<ClubWithCompetitions[]> => {
      try {
        const db = getPublicSupabase()
        const [teamsRes, compsRes, mappingRes] = await Promise.all([
          db
            .from("teams")
            .select<string, ClubRaw>("id, name, short_name, slug, country")
            .eq("provider", PROVIDER)
            .order("name", { ascending: true }),
          db
            .from("competitions")
            .select<string, ClubCompetitionRaw>("id, slug, name, short_name, country, current_season")
            .eq("provider", PROVIDER)
            .eq("is_active", true),
          db.from("fixtures").select<string, TeamCompRefRaw>("home_team_id, away_team_id, competition_id"),
        ])

        const firstError = teamsRes.error ?? compsRes.error ?? mappingRes.error
        if (firstError) {
          logQueryError("getAllClubs", firstError)
          return []
        }

        const competitions = (compsRes.data ?? []).map(mapCompetition)
        const compById = new Map(competitions.map((c) => [c.id, c]))

        const teamCompIds = new Map<string, Set<string>>()
        for (const row of mappingRes.data ?? []) {
          for (const teamId of [row.home_team_id, row.away_team_id]) {
            const set = teamCompIds.get(teamId) ?? new Set<string>()
            set.add(row.competition_id)
            teamCompIds.set(teamId, set)
          }
        }

        return (teamsRes.data ?? []).map(mapClub).map((club) => {
          const ids = teamCompIds.get(club.id)
          const competitions = ids
            ? [...ids]
                .map((id) => compById.get(id))
                .filter((c): c is ClubCompetition => c != null)
                .sort(compareCompetitions)
            : []
          return { ...club, competitions }
        })
      } catch (err) {
        logQueryError("getAllClubs", err)
        return []
      }
    },
    ["clubs-hub"],
    { revalidate: REVALIDATE_SECONDS },
  ),
)

export const getClubBySlug = cache(
  unstable_cache(
    async (slug: string): Promise<ClubLookup> => {
      try {
        const db = getPublicSupabase()
        const { data, error } = await db
          .from("teams")
          .select<string, ClubRaw>("id, name, short_name, slug, country")
          .eq("slug", slug)
          .eq("provider", PROVIDER)
          .maybeSingle()
        if (error) {
          logQueryError("getClubBySlug", error)
          return { status: "error" }
        }
        return data ? { status: "found", club: mapClub(data) } : { status: "not_found" }
      } catch (err) {
        logQueryError("getClubBySlug", err)
        return { status: "error" }
      }
    },
    ["club-by-slug"],
    { revalidate: REVALIDATE_SECONDS },
  ),
)

const CLUB_FIXTURE_SELECT = `
  id,
  provider_fixture_id,
  kickoff_at,
  status,
  stage,
  matchweek,
  season,
  home_score,
  away_score,
  source_updated_at,
  updated_at,
  competition:competitions!fixtures_competition_id_fkey(id, slug, name, short_name, country, current_season),
  home_team:teams!fixtures_home_team_id_fkey(id, name, short_name, slug, country),
  away_team:teams!fixtures_away_team_id_fkey(id, name, short_name, slug, country)
`

/** One cached query for every fixture a club plays (home or away). */
const getClubFixturesAll = cache(
  unstable_cache(
    async (teamId: string): Promise<ClubFixture[]> => {
      try {
        const db = getPublicSupabase()
        const { data, error } = await db
          .from("fixtures")
          .select<string, ClubFixtureRaw>(CLUB_FIXTURE_SELECT)
          .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
          .order("kickoff_at", { ascending: false })
        if (error) {
          logQueryError("getClubFixturesAll", error)
          return []
        }
        return (data ?? []).map(mapClubFixture).filter((f): f is ClubFixture => f !== null)
      } catch (err) {
        logQueryError("getClubFixturesAll", err)
        return []
      }
    },
    ["club-fixtures"],
    { revalidate: REVALIDATE_SECONDS },
  ),
)

export async function getClubCompetitions(teamId: string): Promise<ClubCompetition[]> {
  return distinctCompetitions(await getClubFixturesAll(teamId))
}

export async function getClubUpcomingFixtures(teamId: string, limit = 5): Promise<ClubFixture[]> {
  const fixtures = await getClubFixturesAll(teamId)
  const now = Date.now()
  return fixtures
    .filter((f) => UPCOMING_STATUSES.includes(f.status) && new Date(f.kickoffAt).getTime() >= now)
    .sort((a, b) => a.kickoffAt.localeCompare(b.kickoffAt))
    .slice(0, limit)
}

export async function getClubRecentResults(teamId: string, limit = 10): Promise<ClubFixture[]> {
  const fixtures = await getClubFixturesAll(teamId)
  return fixtures.filter((f) => f.status === "FINISHED").slice(0, limit)
}

export async function getClubSeasonStats(teamId: string): Promise<ClubStatsResult> {
  const fixtures = await getClubFixturesAll(teamId)
  const season = maxCurrentSeason(distinctCompetitions(fixtures))
  const inSeason = season == null ? fixtures : fixtures.filter((f) => f.season === season)
  return computeClubSeasonStats(teamId, inSeason)
}

export async function getClubLastUpdatedAt(teamId: string): Promise<string | null> {
  const fixtures = await getClubFixturesAll(teamId)
  let best: string | null = null
  for (const f of fixtures) {
    for (const ts of [f.sourceUpdatedAt, f.updatedAt]) {
      if (ts && (best == null || ts > best)) best = ts
    }
  }
  return best
}

/** Single entry point for a club detail page, distinguishing not-found from DB error. */
export async function getClubPageData(slug: string): Promise<ClubPageResult> {
  const lookup = await getClubBySlug(slug)
  if (lookup.status === "not_found") return { status: "not_found" }
  if (lookup.status === "error") return { status: "error" }
  const club = lookup.club

  const [competitions, stats, upcoming, recent, lastUpdatedAt] = await Promise.all([
    getClubCompetitions(club.id),
    getClubSeasonStats(club.id),
    getClubUpcomingFixtures(club.id, 5),
    getClubRecentResults(club.id, 10),
    getClubLastUpdatedAt(club.id),
  ])

  return {
    status: "ok",
    data: {
      club,
      competitions,
      stats,
      upcoming,
      recent,
      lastUpdatedAt,
      currentSeason: maxCurrentSeason(competitions),
    },
  }
}

// --- sitemap ----------------------------------------------------------------

/**
 * Club slugs plus their freshest fixture timestamp, for the sitemap. One
 * teams query + one fixtures query (no per-club N+1). Returns [] on failure so
 * the sitemap still renders its static routes.
 */
export const getClubsForSitemap = cache(
  unstable_cache(
    async (): Promise<{ slug: string; lastModified: string | null }[]> => {
      try {
        const db = getPublicSupabase()
        const [teamsRes, fixturesRes] = await Promise.all([
          db.from("teams").select<string, ClubRaw>("id, slug").eq("provider", PROVIDER),
          db
            .from("fixtures")
            .select<string, { home_team_id: string; away_team_id: string; source_updated_at: string | null; updated_at: string | null }>(
              "home_team_id, away_team_id, source_updated_at, updated_at",
            ),
        ])
        if (teamsRes.error || fixturesRes.error) {
          logQueryError("getClubsForSitemap", teamsRes.error ?? fixturesRes.error)
          return []
        }

        const lastByTeam = new Map<string, string>()
        for (const row of fixturesRes.data ?? []) {
          for (const teamId of [row.home_team_id, row.away_team_id]) {
            for (const ts of [row.source_updated_at, row.updated_at]) {
              if (!ts) continue
              const current = lastByTeam.get(teamId)
              if (!current || ts > current) lastByTeam.set(teamId, ts)
            }
          }
        }

        return (teamsRes.data ?? []).map((t) => ({ slug: t.slug, lastModified: lastByTeam.get(t.id) ?? null }))
      } catch (err) {
        logQueryError("getClubsForSitemap", err)
        return []
      }
    },
    ["clubs-sitemap"],
    { revalidate: REVALIDATE_SECONDS },
  ),
)
