import "server-only"

import { cache } from "react"
import { unstable_cache } from "next/cache"

import { getPublicSupabase } from "@/lib/supabase/public"
import type { FixtureStatus } from "@/lib/supabase/types"
import { formatUtcDate, formatUtcTime } from "@/lib/format-utc"
import { REVALIDATE_SECONDS } from "./queries"
import {
  buildMatchSlug,
  parseFixtureIdFromSlug,
  validateCanonicalMatchSlug,
  matchContextLabel,
  type MatchCardFixture,
} from "./match-url"

/**
 * Public, read-only query layer for match pages (Phase 7).
 *
 * Mirrors `lib/football/club-queries.ts`: every query talks only to the public
 * client (anon role), never the secret key, and never calls football-data.org
 * from the request path. Strict separation between the two competitions is
 * enforced in `getFixtureByProviderId` (a fixture that belongs to the other
 * competition is a 404, not a wrong match).
 *
 * - No N+1: team/competition data is embedded in a single fixtures query, and a
 *   detail page derives its Recent Form / Season Stats / Head-to-Head /
 *   Related Fixtures from a handful of cached, id-keyed queries.
 * - Safe errors: a failed query returns a safe sentinel ([]/null/zeroed stats),
 *   and lookups use a three-way result so the page can tell "unknown id" (→ 404)
 *   from "database down" (→ degrade, never 404 a real match).
 * - The stats math and directory grouping are pure functions, exported for
 *   unit-testing independently of the database.
 */

const PROVIDER = "football-data.org"
const UPCOMING_STATUSES: FixtureStatus[] = ["SCHEDULED", "TIMED"]
const IN_PROGRESS_STATUSES: FixtureStatus[] = ["LIVE", "HALFTIME"]

// --- raw row shapes (supabase returns plain JSON) ----------------------------

interface MatchTeamRaw {
  id: string
  name: string
  short_name: string | null
  slug: string
}

interface MatchCompetitionRaw {
  id: string
  slug: string
  name: string
  short_name: string | null
  current_season: number | null
}

interface MatchFixtureRaw {
  id: string
  provider_fixture_id: number
  season: number
  round: string | null
  matchweek: number | null
  stage: string | null
  kickoff_at: string
  venue_name: string | null
  venue_city: string | null
  status: FixtureStatus
  elapsed_minutes: number | null
  home_score: number | null
  away_score: number | null
  halftime_home_score: number | null
  halftime_away_score: number | null
  fulltime_home_score: number | null
  fulltime_away_score: number | null
  winner_team_id: string | null
  source_updated_at: string | null
  updated_at: string | null
  competition: MatchCompetitionRaw | null
  home_team: MatchTeamRaw | null
  away_team: MatchTeamRaw | null
}

// --- public shapes -----------------------------------------------------------

export interface MatchTeam {
  id: string
  name: string
  shortName: string | null
  slug: string
}

export interface MatchCompetition {
  id: string
  slug: string
  name: string
  shortName: string | null
  currentSeason: number | null
}

/** The full fixture shape used by the match detail page. */
export interface MatchDetailFixture {
  id: string
  providerFixtureId: number
  competitionSlug: string
  season: number
  round: string | null
  matchweek: number | null
  stage: string | null
  kickoffAt: string
  venueName: string | null
  venueCity: string | null
  status: FixtureStatus
  elapsedMinutes: number | null
  homeScore: number | null
  awayScore: number | null
  halftimeHomeScore: number | null
  halftimeAwayScore: number | null
  fulltimeHomeScore: number | null
  fulltimeAwayScore: number | null
  winnerTeamId: string | null
  sourceUpdatedAt: string | null
  updatedAt: string | null
  competition: MatchCompetition
  homeTeam: MatchTeam
  awayTeam: MatchTeam
}

export interface SeasonStats {
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
}

export type MatchOutcome = "W" | "D" | "L"

export interface FormEntry {
  fixtureId: string
  kickoffAt: string
  competitionName: string
  opponent: MatchTeam
  teamScore: number
  opponentScore: number
  outcome: MatchOutcome
  isHome: boolean
}

export interface HeadToHeadEntry {
  fixtureId: string
  kickoffAt: string
  competitionName: string
  homeTeam: MatchTeam
  awayTeam: MatchTeam
  homeScore: number
  awayScore: number
}

export interface MatchDirectoryFilter {
  matchweek: number | null
  stage: string | null
}

export interface FilterOptions {
  matchweeks: number[]
  stages: string[]
  matchdays: number[]
}

export interface MatchDirectoryData {
  competition: MatchCompetition
  fixtures: MatchCardFixture[]
  filterOptions: FilterOptions
  lastUpdatedAt: string | null
}

export interface MatchPageData {
  fixture: MatchDetailFixture
  homeStats: SeasonStats
  awayStats: SeasonStats
  homeForm: FormEntry[]
  awayForm: FormEntry[]
  headToHead: HeadToHeadEntry[]
  related: MatchDetailFixture[]
}

export type MatchLookup =
  | { status: "found"; fixture: MatchDetailFixture }
  | { status: "not_found" }
  | { status: "error" }

export type MatchRouteResolution =
  | { kind: "ok"; data: MatchPageData }
  | { kind: "redirect"; canonicalSlug: string }
  | { kind: "not_found" }
  | { kind: "error" }

export interface MatchSitemapEntry {
  competitionSlug: string
  providerFixtureId: number
  homeTeamSlug: string
  awayTeamSlug: string
  status: FixtureStatus
  lastModified: string | null
}

// --- helpers -----------------------------------------------------------------

function logQueryError(scope: string, error: unknown): void {
  const code = (error as { code?: string } | null)?.code
  console.error(`[match queries] ${scope} failed${code ? ` (${code})` : ""}`)
}

function mapTeam(raw: MatchTeamRaw): MatchTeam {
  return { id: raw.id, name: raw.name, shortName: raw.short_name, slug: raw.slug }
}

function mapCompetition(raw: MatchCompetitionRaw): MatchCompetition {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    shortName: raw.short_name,
    currentSeason: raw.current_season,
  }
}

function mapMatchDetail(raw: MatchFixtureRaw): MatchDetailFixture | null {
  if (!raw.home_team || !raw.away_team || !raw.competition) return null
  return {
    id: raw.id,
    providerFixtureId: raw.provider_fixture_id,
    competitionSlug: raw.competition.slug,
    season: raw.season,
    round: raw.round,
    matchweek: raw.matchweek,
    stage: raw.stage,
    kickoffAt: raw.kickoff_at,
    venueName: raw.venue_name,
    venueCity: raw.venue_city,
    status: raw.status,
    elapsedMinutes: raw.elapsed_minutes,
    homeScore: raw.home_score,
    awayScore: raw.away_score,
    halftimeHomeScore: raw.halftime_home_score,
    halftimeAwayScore: raw.halftime_away_score,
    fulltimeHomeScore: raw.fulltime_home_score,
    fulltimeAwayScore: raw.fulltime_away_score,
    winnerTeamId: raw.winner_team_id,
    sourceUpdatedAt: raw.source_updated_at,
    updatedAt: raw.updated_at,
    competition: mapCompetition(raw.competition),
    homeTeam: mapTeam(raw.home_team),
    awayTeam: mapTeam(raw.away_team),
  }
}

function toCardFixture(f: MatchDetailFixture): MatchCardFixture {
  return {
    id: f.id,
    providerFixtureId: f.providerFixtureId,
    competitionSlug: f.competitionSlug,
    kickoffAt: f.kickoffAt,
    status: f.status,
    stage: f.stage,
    matchweek: f.matchweek,
    homeTeam: f.homeTeam,
    awayTeam: f.awayTeam,
    homeScore: f.homeScore,
    awayScore: f.awayScore,
  }
}

function maxFixtureTimestamp(fixtures: MatchDetailFixture[]): string | null {
  let best: string | null = null
  for (const f of fixtures) {
    for (const ts of [f.sourceUpdatedAt, f.updatedAt]) {
      if (ts && (best == null || ts > best)) best = ts
    }
  }
  return best
}

const MATCH_FIXTURE_SELECT = `
  id,
  provider_fixture_id,
  season,
  round,
  matchweek,
  stage,
  kickoff_at,
  venue_name,
  venue_city,
  status,
  elapsed_minutes,
  home_score,
  away_score,
  halftime_home_score,
  halftime_away_score,
  fulltime_home_score,
  fulltime_away_score,
  winner_team_id,
  source_updated_at,
  updated_at,
  competition:competitions!fixtures_competition_id_fkey(id, slug, name, short_name, current_season),
  home_team:teams!fixtures_home_team_id_fkey(id, name, short_name, slug),
  away_team:teams!fixtures_away_team_id_fkey(id, name, short_name, slug)
`

// --- pure directory helpers (exported for tests) -----------------------------

/** A minimal shape every directory grouping helper needs. */
export interface DirectoryFixtureLike {
  status: FixtureStatus
  kickoffAt: string
  matchweek: number | null
  stage: string | null
}

export interface MatchPartition<T> {
  inProgress: T[]
  upcoming: T[]
  results: T[]
  other: T[]
}

export function distinctMatchweeks(fixtures: { matchweek: number | null }[]): number[] {
  const set = new Set<number>()
  for (const f of fixtures) if (f.matchweek != null) set.add(f.matchweek)
  return [...set].sort((a, b) => a - b)
}

export function distinctStages(fixtures: { stage: string | null }[]): string[] {
  const set = new Set<string>()
  for (const f of fixtures) if (f.stage) set.add(f.stage)
  return [...set].sort()
}

export function filterFixtures<T extends DirectoryFixtureLike>(
  fixtures: T[],
  filter: MatchDirectoryFilter,
): T[] {
  return fixtures.filter((f) => {
    if (filter.matchweek != null && f.matchweek !== filter.matchweek) return false
    if (filter.stage != null && f.stage !== filter.stage) return false
    return true
  })
}

/**
 * Group fixtures into In Progress / Upcoming / Results (plus a fallback bucket
 * for postponed/cancelled/suspended so every fixture stays reachable).
 * `nowIso` is the cutoff: "upcoming" means a scheduled/timed fixture whose
 * kickoff is not yet in the past.
 */
export function partitionFixtures<T extends DirectoryFixtureLike>(
  fixtures: T[],
  nowIso: string,
): MatchPartition<T> {
  const inProgress: T[] = []
  const upcoming: T[] = []
  const results: T[] = []
  const other: T[] = []
  const now = new Date(nowIso).getTime()

  for (const f of fixtures) {
    if (IN_PROGRESS_STATUSES.includes(f.status)) inProgress.push(f)
    else if (f.status === "FINISHED") results.push(f)
    else if (UPCOMING_STATUSES.includes(f.status) && new Date(f.kickoffAt).getTime() >= now) upcoming.push(f)
    else other.push(f)
  }

  inProgress.sort((a, b) => a.kickoffAt.localeCompare(b.kickoffAt))
  upcoming.sort((a, b) => a.kickoffAt.localeCompare(b.kickoffAt))
  results.sort((a, b) => b.kickoffAt.localeCompare(a.kickoffAt))
  other.sort((a, b) => b.kickoffAt.localeCompare(a.kickoffAt))
  return { inProgress, upcoming, results, other }
}

export interface PageSlice<T> {
  items: T[]
  total: number
  page: number
  totalPages: number
}

export function paginate<T>(items: T[], page: number, pageSize: number): PageSlice<T> {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize
  return { items: items.slice(start, start + pageSize), total, page: safePage, totalPages }
}

/** Whitelist-validated query-string parsers — never pass raw strings to the DB. */
export function parsePositiveInt(raw: unknown): number | null {
  const s = Array.isArray(raw) ? raw[0] : raw
  if (typeof s !== "string" || !/^\d+$/.test(s)) return null
  const n = Number(s)
  return Number.isSafeInteger(n) && n > 0 ? n : null
}

export function parseWhitelistedInt(raw: unknown, allowed: number[]): number | null {
  const n = parsePositiveInt(raw)
  return n != null && allowed.includes(n) ? n : null
}

export function parseWhitelistedString(raw: unknown, allowed: string[]): string | null {
  const s = Array.isArray(raw) ? raw[0] : raw
  return typeof s === "string" && allowed.includes(s) ? s : null
}

// --- pure stats / metadata helpers ------------------------------------------

/** P/W/D/L/GF/GA/GD from the team's own perspective over FINISHED, scored matches. */
export function computeSeasonStats(teamId: string, fixtures: MatchDetailFixture[]): SeasonStats {
  const stats: SeasonStats = {
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
  }
  for (const f of fixtures) {
    if (f.status !== "FINISHED" || f.homeScore == null || f.awayScore == null) continue
    const isHome = f.homeTeam.id === teamId
    const gf = isHome ? f.homeScore : f.awayScore
    const ga = isHome ? f.awayScore : f.homeScore
    stats.played += 1
    stats.goalsFor += gf
    stats.goalsAgainst += ga
    if (gf > ga) stats.won += 1
    else if (gf < ga) stats.lost += 1
    else stats.drawn += 1
  }
  stats.goalDifference = stats.goalsFor - stats.goalsAgainst
  return stats
}

function toFormEntry(f: MatchDetailFixture, teamId: string): FormEntry {
  const isHome = f.homeTeam.id === teamId
  const teamScore = isHome ? (f.homeScore as number) : (f.awayScore as number)
  const opponentScore = isHome ? (f.awayScore as number) : (f.homeScore as number)
  return {
    fixtureId: f.id,
    kickoffAt: f.kickoffAt,
    competitionName: f.competition.name,
    opponent: isHome ? f.awayTeam : f.homeTeam,
    teamScore,
    opponentScore,
    outcome: teamScore > opponentScore ? "W" : teamScore < opponentScore ? "L" : "D",
    isHome,
  }
}

/** `{Home} vs {Away} Result & Score` when finished, else `{Home} vs {Away}: {date} & {time}`. */
export function buildMatchTitle(fixture: MatchDetailFixture): string {
  const matchup = `${fixture.homeTeam.name} vs ${fixture.awayTeam.name}`
  if (fixture.status === "FINISHED") return `${matchup} Result & Score`
  return `${matchup}: ${formatUtcDate(fixture.kickoffAt)} & ${formatUtcTime(fixture.kickoffAt)}`
}

/** Dynamic description: names, competition, date, UTC time, and the real score when finished. */
export function buildMatchDescription(fixture: MatchDetailFixture): string {
  const matchup = `${fixture.homeTeam.name} vs ${fixture.awayTeam.name}`
  const when = `${formatUtcDate(fixture.kickoffAt)} at ${formatUtcTime(fixture.kickoffAt)}`
  const round = matchContextLabel(fixture.stage, fixture.matchweek, fixture.competition.slug)
  const score =
    fixture.status === "FINISHED" && fixture.homeScore != null && fixture.awayScore != null
      ? `, final score ${fixture.homeScore}-${fixture.awayScore}`
      : ""
  return `View the ${matchup} ${round} fixture in the ${fixture.competition.name} on ${when}${score}. Match data includes team season statistics, recent form and head-to-head results.`
}

/** Sitemap priority: future/in-progress 0.7, finished 0.6, cancelled/postponed 0.3. */
export function matchSitemapPriority(status: FixtureStatus): number {
  if (status === "FINISHED") return 0.6
  if (status === "POSTPONED" || status === "CANCELLED" || status === "SUSPENDED") return 0.3
  return 0.7
}

// --- queries -----------------------------------------------------------------

export const getMatchCompetition = cache(
  unstable_cache(
    async (slug: string): Promise<MatchCompetition | null> => {
      try {
        const db = getPublicSupabase()
        const { data, error } = await db
          .from("competitions")
          .select<string, MatchCompetitionRaw>("id, slug, name, short_name, current_season")
          .eq("slug", slug)
          .eq("provider", PROVIDER)
          .maybeSingle()
        if (error) {
          logQueryError("getMatchCompetition", error)
          return null
        }
        return data ? mapCompetition(data) : null
      } catch (err) {
        logQueryError("getMatchCompetition", err)
        return null
      }
    },
    ["match-competition"],
    { revalidate: REVALIDATE_SECONDS },
  ),
)

const getCompetitionFixturesDetail = cache(
  unstable_cache(
    async (competitionId: string): Promise<MatchDetailFixture[]> => {
      try {
        const db = getPublicSupabase()
        const { data, error } = await db
          .from("fixtures")
          .select<string, MatchFixtureRaw>(MATCH_FIXTURE_SELECT)
          .eq("competition_id", competitionId)
          .eq("provider", PROVIDER)
          .order("kickoff_at", { ascending: true })
        if (error) {
          logQueryError("getCompetitionFixturesDetail", error)
          return []
        }
        return (data ?? []).map(mapMatchDetail).filter((f): f is MatchDetailFixture => f !== null)
      } catch (err) {
        logQueryError("getCompetitionFixturesDetail", err)
        return []
      }
    },
    ["match-competition-fixtures"],
    { revalidate: REVALIDATE_SECONDS },
  ),
)

/** All fixtures for a competition as card-shaped rows, ordered by kickoff. */
export async function getCompetitionFixtures(slug: string): Promise<MatchCardFixture[]> {
  const competition = await getMatchCompetition(slug)
  if (!competition) return []
  const detail = await getCompetitionFixturesDetail(competition.id)
  return detail.map(toCardFixture)
}

/** Fixture by its unique provider id, scoped to the requested competition (else 404). */
export const getFixtureByProviderId = cache(
  unstable_cache(
    async (providerFixtureId: number, competitionSlug: string): Promise<MatchLookup> => {
      try {
        const db = getPublicSupabase()
        const { data, error } = await db
          .from("fixtures")
          .select<string, MatchFixtureRaw>(MATCH_FIXTURE_SELECT)
          .eq("provider", PROVIDER)
          .eq("provider_fixture_id", providerFixtureId)
          .maybeSingle()
        if (error) {
          logQueryError("getFixtureByProviderId", error)
          return { status: "error" }
        }
        if (!data) return { status: "not_found" }
        const fixture = mapMatchDetail(data)
        if (!fixture) return { status: "not_found" }
        if (fixture.competition.slug !== competitionSlug) return { status: "not_found" }
        return { status: "found", fixture }
      } catch (err) {
        logQueryError("getFixtureByProviderId", err)
        return { status: "error" }
      }
    },
    ["match-by-provider-id"],
    { revalidate: REVALIDATE_SECONDS },
  ),
)

const getTeamFixturesAll = cache(
  unstable_cache(
    async (teamId: string): Promise<MatchDetailFixture[]> => {
      try {
        const db = getPublicSupabase()
        const { data, error } = await db
          .from("fixtures")
          .select<string, MatchFixtureRaw>(MATCH_FIXTURE_SELECT)
          .eq("provider", PROVIDER)
          .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
          .order("kickoff_at", { ascending: false })
        if (error) {
          logQueryError("getTeamFixturesAll", error)
          return []
        }
        return (data ?? []).map(mapMatchDetail).filter((f): f is MatchDetailFixture => f !== null)
      } catch (err) {
        logQueryError("getTeamFixturesAll", err)
        return []
      }
    },
    ["match-team-fixtures"],
    { revalidate: REVALIDATE_SECONDS },
  ),
)

/** The team's last `limit` finished matches strictly before `beforeDate`. */
export async function getTeamRecentForm(
  teamId: string,
  beforeDate: string,
  limit = 5,
): Promise<FormEntry[]> {
  const fixtures = await getTeamFixturesAll(teamId)
  const cutoff = new Date(beforeDate).getTime()
  return fixtures
    .filter(
      (f) =>
        f.status === "FINISHED" &&
        f.homeScore != null &&
        f.awayScore != null &&
        new Date(f.kickoffAt).getTime() < cutoff,
    )
    .slice(0, limit)
    .map((f) => toFormEntry(f, teamId))
}

/** The team's season record, optionally scoped to one competition. */
export async function getTeamSeasonStats(teamId: string, competitionId?: string): Promise<SeasonStats> {
  const fixtures = await getTeamFixturesAll(teamId)
  const scoped = competitionId ? fixtures.filter((f) => f.competition.id === competitionId) : fixtures
  return computeSeasonStats(teamId, scoped)
}

/** Prior meetings between two teams, strictly before `beforeDate` (real DB history only). */
export async function getHeadToHead(
  homeTeamId: string,
  awayTeamId: string,
  beforeDate: string,
  limit = 5,
): Promise<HeadToHeadEntry[]> {
  const fixtures = await getTeamFixturesAll(homeTeamId)
  const cutoff = new Date(beforeDate).getTime()
  return fixtures
    .filter((f) => f.homeTeam.id === awayTeamId || f.awayTeam.id === awayTeamId)
    .filter((f) => f.status === "FINISHED" && f.homeScore != null && f.awayScore != null)
    .filter((f) => new Date(f.kickoffAt).getTime() < cutoff)
    .slice(0, limit)
    .map((f) => ({
      fixtureId: f.id,
      kickoffAt: f.kickoffAt,
      competitionName: f.competition.name,
      homeTeam: f.homeTeam,
      awayTeam: f.awayTeam,
      homeScore: f.homeScore as number,
      awayScore: f.awayScore as number,
    }))
}

/** Other fixtures in the same competition and round/stage, closest in time first. */
export async function getRelatedFixtures(fixture: MatchDetailFixture, limit = 6): Promise<MatchDetailFixture[]> {
  const all = await getCompetitionFixturesDetail(fixture.competition.id)
  const others = all.filter((f) => f.id !== fixture.id)
  let pool = fixture.matchweek != null ? others.filter((f) => f.matchweek === fixture.matchweek) : []
  if (pool.length === 0) pool = others.filter((f) => f.stage === fixture.stage)
  if (pool.length === 0) pool = others

  const target = new Date(fixture.kickoffAt).getTime()
  return pool
    .sort(
      (a, b) =>
        Math.abs(new Date(a.kickoffAt).getTime() - target) -
        Math.abs(new Date(b.kickoffAt).getTime() - target),
    )
    .slice(0, limit)
}

/** Directory data: competition + all card fixtures + filter options + freshness. */
export async function getMatchDirectoryData(slug: string): Promise<MatchDirectoryData | null> {
  const competition = await getMatchCompetition(slug)
  if (!competition) return null
  const detail = await getCompetitionFixturesDetail(competition.id)
  const fixtures = detail.map(toCardFixture)
  return {
    competition,
    fixtures,
    filterOptions: {
      matchweeks: distinctMatchweeks(fixtures),
      stages: distinctStages(fixtures),
      matchdays: distinctMatchweeks(fixtures),
    },
    lastUpdatedAt: maxFixtureTimestamp(detail),
  }
}

/**
 * Resolve a requested match slug into the full detail data, or an instruction
 * for the page (permanent redirect to the canonical slug / 404 / error).
 */
export async function resolveMatch(slug: string, competitionSlug: string): Promise<MatchRouteResolution> {
  const id = parseFixtureIdFromSlug(slug)
  if (id == null) return { kind: "not_found" }

  const lookup = await getFixtureByProviderId(id, competitionSlug)
  if (lookup.status === "error") return { kind: "error" }
  if (lookup.status === "not_found") return { kind: "not_found" }

  const fixture = lookup.fixture
  if (!validateCanonicalMatchSlug(fixture, slug)) {
    return { kind: "redirect", canonicalSlug: buildMatchSlug(fixture) }
  }

  const [homeStats, awayStats, homeForm, awayForm, headToHead, related] = await Promise.all([
    getTeamSeasonStats(fixture.homeTeam.id, fixture.competition.id),
    getTeamSeasonStats(fixture.awayTeam.id, fixture.competition.id),
    getTeamRecentForm(fixture.homeTeam.id, fixture.kickoffAt, 5),
    getTeamRecentForm(fixture.awayTeam.id, fixture.kickoffAt, 5),
    getHeadToHead(fixture.homeTeam.id, fixture.awayTeam.id, fixture.kickoffAt, 5),
    getRelatedFixtures(fixture, 6),
  ])

  return {
    kind: "ok",
    data: { fixture, homeStats, awayStats, homeForm, awayForm, headToHead, related },
  }
}

// --- sitemap ----------------------------------------------------------------

/**
 * Every fixture for the sitemap, with the pieces needed to build its canonical
 * URL and priority. One fixtures query (no per-match N+1). Returns [] on
 * failure so the sitemap still renders its static routes.
 */
export const getMatchesForSitemap = cache(
  unstable_cache(
    async (): Promise<MatchSitemapEntry[]> => {
      try {
        const db = getPublicSupabase()
        const { data, error } = await db
          .from("fixtures")
          .select<
            string,
            {
              provider_fixture_id: number
              status: FixtureStatus
              source_updated_at: string | null
              updated_at: string | null
              competition: { slug: string } | null
              home_team: { slug: string } | null
              away_team: { slug: string } | null
            }
          >(
            `
            provider_fixture_id,
            status,
            source_updated_at,
            updated_at,
            competition:competitions!fixtures_competition_id_fkey(slug),
            home_team:teams!fixtures_home_team_id_fkey(slug),
            away_team:teams!fixtures_away_team_id_fkey(slug)
          `,
          )
          .eq("provider", PROVIDER)
        if (error) {
          logQueryError("getMatchesForSitemap", error)
          return []
        }
        return (data ?? [])
          .filter((r) => r.competition?.slug && r.home_team?.slug && r.away_team?.slug)
          .map((r) => ({
            competitionSlug: r.competition!.slug,
            providerFixtureId: r.provider_fixture_id,
            homeTeamSlug: r.home_team!.slug,
            awayTeamSlug: r.away_team!.slug,
            status: r.status,
            lastModified:
              [r.source_updated_at, r.updated_at].filter((t): t is string => Boolean(t)).sort().pop() ?? null,
          }))
      } catch (err) {
        logQueryError("getMatchesForSitemap", err)
        return []
      }
    },
    ["matches-sitemap"],
    { revalidate: REVALIDATE_SECONDS },
  ),
)
