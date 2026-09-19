/**
 * Hand-written database types that mirror `supabase/migrations/*.sql`.
 *
 * Once Supabase CLI is available, replace this file with generated types:
 *
 *   supabase gen types typescript --project-id <ref> > lib/supabase/database.types.ts
 *
 * Keep these in sync with any migration changes until then. Never use `any` to
 * paper over a missing field — extend the interface instead.
 */

export type FixtureStatus =
  | "SCHEDULED"
  | "TIMED"
  | "LIVE"
  | "HALFTIME"
  | "FINISHED"
  | "POSTPONED"
  | "CANCELLED"
  | "SUSPENDED"

export type SyncStatus = "RUNNING" | "SUCCESS" | "FAILED" | "PARTIAL"

export interface Competition {
  id: string
  provider: string
  provider_competition_id: number
  slug: string
  name: string
  short_name: string | null
  country: string | null
  competition_type: string | null
  current_season: number | null
  logo_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Team {
  id: string
  provider: string
  provider_team_id: number
  name: string
  short_name: string | null
  slug: string
  country: string | null
  logo_url: string | null
  created_at: string
  updated_at: string
}

export interface Fixture {
  id: string
  provider: string
  provider_fixture_id: number
  competition_id: string
  season: number
  round: string | null
  matchweek: number | null
  stage: string | null
  home_team_id: string
  away_team_id: string
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
  created_at: string
  updated_at: string
}

export interface DataSyncLog {
  id: string
  provider: string
  sync_type: string
  competition_id: string | null
  started_at: string
  completed_at: string | null
  status: SyncStatus
  records_received: number
  records_created: number
  records_updated: number
  error_message: string | null
  created_at: string
}
