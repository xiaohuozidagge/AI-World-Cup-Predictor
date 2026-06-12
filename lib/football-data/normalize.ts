import { mapApiTeamToSlug } from "@/data/team-name-map"

export interface SyncedMatch {
  id: string
  sourceId: number
  source: "football-data.org"
  sourceUpdatedAt: string
  slug: string
  matchNumber?: number
  stage: string
  group?: string
  date: string
  utcDate: string
  status: "scheduled" | "live" | "finished" | "postponed"
  teamA: string
  teamB: string
  teamASlug?: string
  teamBSlug?: string
  actualScore?: { teamA: number; teamB: number }
  winner?: string | "draw"
  rawStatus: string
  rawStage: string
  stadium?: string
}

export interface SyncedStanding {
  group: string
  position: number
  team: string
  teamSlug?: string
  played: number
  won: number
  draw: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export interface SyncedTeam {
  id: number
  name: string
  shortName: string
  tla: string
  crest: string
  slug?: string
}

const STATUS_MAP: Record<string, SyncedMatch["status"]> = {
  SCHEDULED: "scheduled",
  TIMED: "scheduled",
  IN_PLAY: "live",
  PAUSED: "live",
  FINISHED: "finished",
  POSTPONED: "postponed",
  SUSPENDED: "postponed",
  CANCELLED: "postponed",
}

const STAGE_MAP: Record<string, string> = {
  GROUP_STAGE: "Group Stage",
  LAST_32: "Round of 32",
  LAST_16: "Round of 16",
  QUARTER_FINALS: "Quarter-finals",
  SEMI_FINALS: "Semi-finals",
  THIRD_PLACE: "Third-place Play-off",
  FINAL: "Final",
}

export function normalizeMatch(raw: Record<string, unknown>): SyncedMatch | null {
  if (!raw.id || !raw.utcDate) return null

  const homeTeam = (raw.homeTeam as Record<string, unknown>)?.name as string || ""
  const awayTeam = (raw.awayTeam as Record<string, unknown>)?.name as string || ""
  const rawStage = (raw.stage as string) || "GROUP_STAGE"
  const rawStatus = (raw.status as string) || "SCHEDULED"
  const group = (raw.group as string)?.replace("GROUP_", "") || undefined

  const teamASlug = mapApiTeamToSlug(homeTeam)
  const teamBSlug = mapApiTeamToSlug(awayTeam)
  const slug = teamASlug && teamBSlug
    ? `${teamASlug}-vs-${teamBSlug}`
    : `${homeTeam.toLowerCase().replace(/\s+/g, "-")}-vs-${awayTeam.toLowerCase().replace(/\s+/g, "-")}`

  const status = STATUS_MAP[rawStatus] || "scheduled"
  const score = raw.score as Record<string, unknown> | undefined
  const fullTime = score?.fullTime as Record<string, number> | undefined

  const match: SyncedMatch = {
    id: `fdo-${raw.id}`,
    sourceId: raw.id as number,
    source: "football-data.org",
    sourceUpdatedAt: (raw.lastUpdated as string) || new Date().toISOString(),
    slug,
    matchNumber: raw.matchday as number | undefined,
    stage: STAGE_MAP[rawStage] || rawStage,
    group,
    date: (raw.utcDate as string).split("T")[0],
    utcDate: raw.utcDate as string,
    status,
    teamA: homeTeam,
    teamB: awayTeam,
    teamASlug,
    teamBSlug,
    actualScore: fullTime && fullTime.home !== null && fullTime.away !== null
      ? { teamA: fullTime.home, teamB: fullTime.away }
      : undefined,
    winner: raw.winner ? undefined : rawStatus === "FINISHED" ? (() => {
      if (!fullTime) return "draw"
      if (fullTime.home > fullTime.away) return "HOME_TEAM"
      if (fullTime.away > fullTime.home) return "AWAY_TEAM"
      return "draw"
    })() : undefined,
    rawStatus,
    rawStage,
    stadium: (raw.venue as string) || undefined,
  }

  return match
}

export function normalizeStandings(raw: Record<string, unknown>[]): SyncedStanding[] {
  return raw
    .filter((r) => r.type === "TOTAL" || r.type === undefined)
    .map((r) => {
      const table = (r.table || []) as Record<string, unknown>[]
      return table.map((entry, idx) => {
        const team = (entry.team as Record<string, unknown>)?.name as string || ""
        return {
          group: (r.group as string)?.replace("GROUP_", "") || "",
          position: entry.position as number || idx + 1,
          team,
          teamSlug: mapApiTeamToSlug(team),
          played: (entry.playedGames as number) || 0,
          won: (entry.won as number) || 0,
          draw: (entry.draw as number) || 0,
          lost: (entry.lost as number) || 0,
          goalsFor: (entry.goalsFor as number) || 0,
          goalsAgainst: (entry.goalsAgainst as number) || 0,
          goalDifference: (entry.goalDifference as number) || 0,
          points: (entry.points as number) || 0,
        }
      })
    })
    .flat()
}

export function normalizeTeam(raw: Record<string, unknown>): SyncedTeam {
  return {
    id: raw.id as number,
    name: (raw.name as string) || "",
    shortName: (raw.shortName as string) || "",
    tla: (raw.tla as string) || "",
    crest: (raw.crest as string) || "",
    slug: mapApiTeamToSlug((raw.name as string) || ""),
  }
}
