/**
 * Minimal types for the football-data.org v4 API.
 *
 * Only fields actually consumed by the sync are modelled — do not add unused
 * fields just because the API returns them. Never use `any`.
 */

export interface Area {
  id: number
  name: string
  code: string | null
}

export interface Season {
  id: number
  startDate: string
  endDate: string
  currentMatchday: number | null
  winner: unknown
}

export interface Competition {
  id: number
  name: string
  code: string
  type: string
  emblem: string | null
  area: Area
  currentSeason: Season | null
  lastUpdated: string | null
}

/** The reduced team shape embedded in match homeTeam/awayTeam. */
export interface TeamRef {
  id: number
  name: string
  shortName: string | null
  tla: string | null
  crest: string | null
}

/** Full team shape returned by /competitions/{code}/teams. */
export interface Team extends TeamRef {
  area: Area
  venue: string | null
  lastUpdated: string | null
}

export interface ScoreSide {
  home: number | null
  away: number | null
}

export interface Score {
  winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null
  duration: string | null
  fullTime: ScoreSide
  halfTime: ScoreSide
}

export interface Match {
  id: number
  utcDate: string
  status: string
  matchday: number | null
  stage: string | null
  group: string | null
  lastUpdated: string | null
  homeTeam: TeamRef
  awayTeam: TeamRef
  score: Score
}

export interface CompetitionTeamsResponse {
  teams: Team[]
}

export interface CompetitionMatchesResponse {
  matches: Match[]
}

/** Minimal standings shape — only used for the accessibility check, never persisted. */
export interface Standing {
  stage: string | null
  type: string | null
  group: string | null
  table: unknown[]
}

export interface StandingsResponse {
  standings: Standing[]
}
