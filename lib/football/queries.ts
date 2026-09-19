import "server-only"

import { cache } from "react"
import { unstable_cache } from "next/cache"

import { getPublicSupabase } from "@/lib/supabase/public"
import type { FixtureStatus } from "@/lib/supabase/types"

/**
 * Public, read-only query layer for football data (Phase 4).
 *
 * Every function here talks only to Supabase through the *public* client
 * (NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY → `anon`
 * role). RLS restricts that role to SELECT on competitions / teams / fixtures,
 * so this module cannot insert, update, delete or upsert, and it never holds
 * the secret key or calls football-data.org directly.
 *
 * - No N+1: team names are embedded through the home_team/away_team
 *   relationship aliases in a single fixtures query.
 * - Safe errors: a failing query returns a safe sentinel (null / empty array /
 *   zeroed stats) instead of throwing raw database errors at the page, and
 *   nothing sensitive (URLs, keys, headers) is ever logged.
 * - Caching: each result is wrapped in `unstable_cache` with a 30-minute
 *   revalidate, and React `cache()` dedupes calls within a single request so a
 *   page shares one query result.
 */

export const REVALIDATE_SECONDS = 1800

const UPCOMING_STATUSES: FixtureStatus[] = ["SCHEDULED", "TIMED"]

const FIXTURE_TEAM_SELECT = `
  id,
  kickoff_at,
  status,
  stage,
  matchweek,
  home_score,
  away_score,
  home_team:teams!fixtures_home_team_id_fkey(id, name, short_name, slug),
  away_team:teams!fixtures_away_team_id_fkey(id, name, short_name, slug)
`

// --- typed raw rows (supabase returns plain JSON) ----------------------------

interface CompetitionRaw {
  id: string
  slug: string
  name: string
  short_name: string | null
  country: string | null
  current_season: number | null
  updated_at: string | null
}

interface TeamRaw {
  id: string
  name: string
  short_name: string | null
  slug: string
}

interface FixtureRaw {
  id: string
  kickoff_at: string
  status: FixtureStatus
  stage: string | null
  matchweek: number | null
  home_score: number | null
  away_score: number | null
  home_team: TeamRaw | null
  away_team: TeamRaw | null
}

interface TeamRefRaw {
  home_team_id: string
  away_team_id: string
}

// --- public shapes -----------------------------------------------------------

export interface MatchTeam {
  id: string
  name: string
  shortName: string | null
  slug: string
}

export interface MatchFixture {
  id: string
  kickoffAt: string
  status: FixtureStatus
  stage: string | null
  matchweek: number | null
  homeTeam: MatchTeam
  awayTeam: MatchTeam
  homeScore: number | null
  awayScore: number | null
}

export interface CompetitionSummary {
  id: string
  slug: string
  name: string
  shortName: string | null
  country: string | null
  currentSeason: number | null
  updatedAt: string | null
}

export interface CompetitionStats {
  teamCount: number
  totalFixtures: number
  finishedFixtures: number
  upcomingFixtures: number
  nextMatchAt: string | null
}

export interface CompetitionPageData {
  competition: CompetitionSummary
  stats: CompetitionStats
  upcoming: MatchFixture[]
  recent: MatchFixture[]
  /**
   * The freshest fixture timestamp for this competition: the later of the max
   * `fixtures.source_updated_at` (football-data.org's `lastUpdated`) and the max
   * `fixtures.updated_at` (our own upsert timestamp). Deliberately NOT the page
   * render / server / build time.
   */
  lastUpdatedAt: string | null
}

export interface HomeUpcomingGroup {
  competition: CompetitionSummary
  fixtures: MatchFixture[]
}

// --- helpers -----------------------------------------------------------------

function logQueryError(scope: string, error: unknown): void {
  const code = (error as { code?: string } | null)?.code
  console.error(`[football queries] ${scope} failed${code ? ` (${code})` : ""}`)
}

function mapTeam(raw: TeamRaw): MatchTeam {
  return { id: raw.id, name: raw.name, shortName: raw.short_name, slug: raw.slug }
}

function mapFixture(raw: FixtureRaw): MatchFixture | null {
  if (!raw.home_team || !raw.away_team) return null
  return {
    id: raw.id,
    kickoffAt: raw.kickoff_at,
    status: raw.status,
    stage: raw.stage,
    matchweek: raw.matchweek,
    homeTeam: mapTeam(raw.home_team),
    awayTeam: mapTeam(raw.away_team),
    homeScore: raw.home_score,
    awayScore: raw.away_score,
  }
}

function mapCompetition(raw: CompetitionRaw): CompetitionSummary {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    shortName: raw.short_name,
    country: raw.country,
    currentSeason: raw.current_season,
    updatedAt: raw.updated_at,
  }
}

// --- queries -----------------------------------------------------------------

export const getCompetitionBySlug = cache(
  unstable_cache(
    async (slug: string): Promise<CompetitionSummary | null> => {
      try {
        const db = getPublicSupabase()
        const { data, error } = await db
          .from("competitions")
          .select<string, CompetitionRaw>(
            "id, slug, name, short_name, country, current_season, updated_at",
          )
          .eq("slug", slug)
          .eq("is_active", true)
          .maybeSingle()
        if (error) {
          logQueryError("getCompetitionBySlug", error)
          return null
        }
        return data ? mapCompetition(data) : null
      } catch (err) {
        logQueryError("getCompetitionBySlug", err)
        return null
      }
    },
    ["competition-by-slug"],
    { revalidate: REVALIDATE_SECONDS },
  ),
)

export const getUpcomingFixtures = cache(
  unstable_cache(
    async (competitionId: string, limit = 12): Promise<MatchFixture[]> => {
      try {
        const db = getPublicSupabase()
        const now = new Date().toISOString()
        const { data, error } = await db
          .from("fixtures")
          .select<string, FixtureRaw>(FIXTURE_TEAM_SELECT)
          .eq("competition_id", competitionId)
          .in("status", UPCOMING_STATUSES)
          .gte("kickoff_at", now)
          .order("kickoff_at", { ascending: true })
          .limit(limit)
        if (error) {
          logQueryError("getUpcomingFixtures", error)
          return []
        }
        return (data ?? []).map(mapFixture).filter((f): f is MatchFixture => f !== null)
      } catch (err) {
        logQueryError("getUpcomingFixtures", err)
        return []
      }
    },
    ["football-fixtures"],
    { revalidate: REVALIDATE_SECONDS },
  ),
)

export const getRecentResults = cache(
  unstable_cache(
    async (competitionId: string, limit = 10): Promise<MatchFixture[]> => {
      try {
        const db = getPublicSupabase()
        const now = new Date().toISOString()
        const { data, error } = await db
          .from("fixtures")
          .select<string, FixtureRaw>(FIXTURE_TEAM_SELECT)
          .eq("competition_id", competitionId)
          .eq("status", "FINISHED")
          .lt("kickoff_at", now)
          .order("kickoff_at", { ascending: false })
          .limit(limit)
        if (error) {
          logQueryError("getRecentResults", error)
          return []
        }
        return (data ?? []).map(mapFixture).filter((f): f is MatchFixture => f !== null)
      } catch (err) {
        logQueryError("getRecentResults", err)
        return []
      }
    },
    ["football-results"],
    { revalidate: REVALIDATE_SECONDS },
  ),
)

export const getCompetitionStats = cache(
  unstable_cache(
    async (competitionId: string): Promise<CompetitionStats> => {
      const empty: CompetitionStats = {
        teamCount: 0,
        totalFixtures: 0,
        finishedFixtures: 0,
        upcomingFixtures: 0,
        nextMatchAt: null,
      }
      try {
        const db = getPublicSupabase()
        const now = new Date().toISOString()
        const [total, finished, upcoming, next, refs] = await Promise.all([
          db.from("fixtures").select("id", { count: "exact", head: true }).eq("competition_id", competitionId),
          db
            .from("fixtures")
            .select("id", { count: "exact", head: true })
            .eq("competition_id", competitionId)
            .eq("status", "FINISHED"),
          db
            .from("fixtures")
            .select("id", { count: "exact", head: true })
            .eq("competition_id", competitionId)
            .in("status", UPCOMING_STATUSES)
            .gte("kickoff_at", now),
          db
            .from("fixtures")
            .select<string, { kickoff_at: string }>("kickoff_at")
            .eq("competition_id", competitionId)
            .in("status", UPCOMING_STATUSES)
            .gte("kickoff_at", now)
            .order("kickoff_at", { ascending: true })
            .limit(1)
            .maybeSingle(),
          db.from("fixtures").select<string, TeamRefRaw>("home_team_id, away_team_id").eq("competition_id", competitionId),
        ])

        const firstError = total.error ?? finished.error ?? upcoming.error ?? next.error ?? refs.error
        if (firstError) {
          logQueryError("getCompetitionStats", firstError)
          return empty
        }

        const teamIds = new Set<string>()
        for (const row of refs.data ?? []) {
          teamIds.add(row.home_team_id)
          teamIds.add(row.away_team_id)
        }

        return {
          teamCount: teamIds.size,
          totalFixtures: total.count ?? 0,
          finishedFixtures: finished.count ?? 0,
          upcomingFixtures: upcoming.count ?? 0,
          nextMatchAt: next.data?.kickoff_at ?? null,
        }
      } catch (err) {
        logQueryError("getCompetitionStats", err)
        return empty
      }
    },
    ["competition-stats"],
    { revalidate: REVALIDATE_SECONDS },
  ),
)

// --- page-level composites ---------------------------------------------------

/**
 * The freshest fixture timestamp for a competition. Uses the later of the max
 * `fixtures.source_updated_at` and the max `fixtures.updated_at` — never the
 * page/server/build time.
 */
export const getCompetitionLastUpdatedAt = cache(
  unstable_cache(
    async (competitionId: string): Promise<string | null> => {
      try {
        const db = getPublicSupabase()
        const [source, updated] = await Promise.all([
          db
            .from("fixtures")
            .select<string, { source_updated_at: string | null }>("source_updated_at")
            .eq("competition_id", competitionId)
            .not("source_updated_at", "is", null)
            .order("source_updated_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
          db
            .from("fixtures")
            .select<string, { updated_at: string | null }>("updated_at")
            .eq("competition_id", competitionId)
            .not("updated_at", "is", null)
            .order("updated_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
        ])
        if (source.error || updated.error) {
          logQueryError("getCompetitionLastUpdatedAt", source.error ?? updated.error)
          return null
        }
        const sourceAt = source.data?.source_updated_at ?? null
        const updatedAt = updated.data?.updated_at ?? null
        if (!sourceAt) return updatedAt
        if (!updatedAt) return sourceAt
        return sourceAt > updatedAt ? sourceAt : updatedAt
      } catch (err) {
        logQueryError("getCompetitionLastUpdatedAt", err)
        return null
      }
    },
    ["football-last-updated"],
    { revalidate: REVALIDATE_SECONDS },
  ),
)

/** Single entry point for a league page: competition + stats + upcoming + recent. */
export async function getCompetitionPageData(slug: string): Promise<CompetitionPageData | null> {
  const competition = await getCompetitionBySlug(slug)
  if (!competition) return null
  const [upcoming, recent, stats, lastUpdatedAt] = await Promise.all([
    getUpcomingFixtures(competition.id),
    getRecentResults(competition.id),
    getCompetitionStats(competition.id),
    getCompetitionLastUpdatedAt(competition.id),
  ])
  return { competition, stats, upcoming, recent, lastUpdatedAt }
}

/** Home page: the next N upcoming fixtures per league competition, in order. */
export async function getHomeUpcoming(limitPerCompetition = 3): Promise<HomeUpcomingGroup[]> {
  const groups: HomeUpcomingGroup[] = []
  for (const slug of ["champions-league", "premier-league"]) {
    const competition = await getCompetitionBySlug(slug)
    if (!competition) continue
    const fixtures = await getUpcomingFixtures(competition.id, limitPerCompetition)
    groups.push({ competition, fixtures })
  }
  return groups
}
