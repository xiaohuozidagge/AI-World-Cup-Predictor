import type { FixtureStatus } from "../supabase/types"

/**
 * Maps football-data.org v4 status codes to our `fixture_status` enum.
 *
 * Unknown statuses are reported as `recognized: false` with a null status — they
 * are NEVER silently coerced to SCHEDULED or FINISHED. The sync layer decides
 * how to handle them (skip new fixtures, preserve the DB status for existing
 * ones).
 */

const FOOTBALL_DATA_STATUS_MAP: Record<string, FixtureStatus> = {
  SCHEDULED: "SCHEDULED",
  TIMED: "TIMED",
  IN_PLAY: "LIVE",
  PAUSED: "HALFTIME",
  FINISHED: "FINISHED",
  SUSPENDED: "SUSPENDED",
  POSTPONED: "POSTPONED",
  CANCELLED: "CANCELLED",
  AWARDED: "FINISHED",
}

export interface StatusMappingResult {
  recognized: boolean
  status: FixtureStatus | null
  rawStatus: string
}

export function mapFixtureStatus(apiStatus: string | null | undefined): StatusMappingResult {
  const rawStatus = apiStatus == null ? "" : String(apiStatus).trim()
  const status = FOOTBALL_DATA_STATUS_MAP[rawStatus.toUpperCase()] ?? null
  return { recognized: status !== null, status, rawStatus }
}
