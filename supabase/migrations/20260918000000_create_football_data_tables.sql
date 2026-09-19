-- Phase 2: football data foundation.
--
-- Run this once, either via Supabase CLI (preferred) or the Dashboard SQL Editor:
--   supabase db push
-- or paste into Supabase Dashboard → SQL Editor.
--
-- It creates enums, tables, constraints, indexes, updated_at triggers, Row Level
-- Security policies, and table privileges (defense in depth — RLS alone is not
-- trusted). It intentionally contains no seed data, no fake teams, and no fake
-- fixtures.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

CREATE TYPE fixture_status AS ENUM (
  'SCHEDULED',
  'TIMED',
  'LIVE',
  'HALFTIME',
  'FINISHED',
  'POSTPONED',
  'CANCELLED',
  'SUSPENDED'
);

CREATE TYPE sync_status AS ENUM (
  'RUNNING',
  'SUCCESS',
  'FAILED',
  'PARTIAL'
);

-- ---------------------------------------------------------------------------
-- updated_at trigger function
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- competitions
-- ---------------------------------------------------------------------------

CREATE TABLE competitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  provider_competition_id bigint NOT NULL,
  slug text NOT NULL,
  name text NOT NULL,
  short_name text,
  country text,
  competition_type text,
  current_season integer,
  logo_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT competitions_provider_provider_competition_id_key
    UNIQUE (provider, provider_competition_id),
  CONSTRAINT competitions_slug_key UNIQUE (slug),
  CONSTRAINT competitions_provider_not_empty CHECK (provider <> ''),
  CONSTRAINT competitions_name_not_empty CHECK (name <> ''),
  CONSTRAINT competitions_slug_not_empty CHECK (slug <> '')
);

-- ---------------------------------------------------------------------------
-- teams
-- ---------------------------------------------------------------------------

CREATE TABLE teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  provider_team_id bigint NOT NULL,
  name text NOT NULL,
  short_name text,
  slug text NOT NULL,
  country text,
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT teams_provider_provider_team_id_key
    UNIQUE (provider, provider_team_id),
  CONSTRAINT teams_slug_key UNIQUE (slug),
  CONSTRAINT teams_provider_not_empty CHECK (provider <> ''),
  CONSTRAINT teams_name_not_empty CHECK (name <> ''),
  CONSTRAINT teams_slug_not_empty CHECK (slug <> '')
);

-- ---------------------------------------------------------------------------
-- fixtures
-- ---------------------------------------------------------------------------

CREATE TABLE fixtures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  provider_fixture_id bigint NOT NULL,
  competition_id uuid NOT NULL REFERENCES competitions(id),
  season integer NOT NULL,
  round text,
  matchweek integer,
  stage text,
  home_team_id uuid NOT NULL REFERENCES teams(id),
  away_team_id uuid NOT NULL REFERENCES teams(id),
  kickoff_at timestamptz NOT NULL,
  venue_name text,
  venue_city text,
  status fixture_status NOT NULL DEFAULT 'SCHEDULED',
  elapsed_minutes integer,
  home_score integer,
  away_score integer,
  halftime_home_score integer,
  halftime_away_score integer,
  fulltime_home_score integer,
  fulltime_away_score integer,
  winner_team_id uuid REFERENCES teams(id),
  source_updated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT fixtures_provider_provider_fixture_id_key
    UNIQUE (provider, provider_fixture_id),
  -- a team cannot play itself
  CONSTRAINT fixtures_home_ne_away CHECK (home_team_id <> away_team_id),
  -- elapsed minutes and scores are non-negative when present
  CONSTRAINT fixtures_elapsed_minutes_nonnegative
    CHECK (elapsed_minutes IS NULL OR elapsed_minutes >= 0),
  CONSTRAINT fixtures_home_score_nonnegative
    CHECK (home_score IS NULL OR home_score >= 0),
  CONSTRAINT fixtures_away_score_nonnegative
    CHECK (away_score IS NULL OR away_score >= 0),
  CONSTRAINT fixtures_halftime_home_score_nonnegative
    CHECK (halftime_home_score IS NULL OR halftime_home_score >= 0),
  CONSTRAINT fixtures_halftime_away_score_nonnegative
    CHECK (halftime_away_score IS NULL OR halftime_away_score >= 0),
  CONSTRAINT fixtures_fulltime_home_score_nonnegative
    CHECK (fulltime_home_score IS NULL OR fulltime_home_score >= 0),
  CONSTRAINT fixtures_fulltime_away_score_nonnegative
    CHECK (fulltime_away_score IS NULL OR fulltime_away_score >= 0),
  -- winner must be one of the two participants, when present
  CONSTRAINT fixtures_winner_valid
    CHECK (winner_team_id IS NULL OR winner_team_id = home_team_id OR winner_team_id = away_team_id)
);

-- ---------------------------------------------------------------------------
-- fixtures indexes
-- ---------------------------------------------------------------------------

CREATE INDEX fixtures_kickoff_at_idx ON fixtures (kickoff_at);
CREATE INDEX fixtures_competition_id_kickoff_at_idx ON fixtures (competition_id, kickoff_at);
CREATE INDEX fixtures_competition_id_status_idx ON fixtures (competition_id, status);
CREATE INDEX fixtures_home_team_id_kickoff_at_idx ON fixtures (home_team_id, kickoff_at);
CREATE INDEX fixtures_away_team_id_kickoff_at_idx ON fixtures (away_team_id, kickoff_at);

-- ---------------------------------------------------------------------------
-- data_sync_logs (admin-only)
-- ---------------------------------------------------------------------------

CREATE TABLE data_sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  sync_type text NOT NULL,
  competition_id uuid REFERENCES competitions(id),
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  status sync_status NOT NULL DEFAULT 'RUNNING',
  records_received integer NOT NULL DEFAULT 0,
  records_created integer NOT NULL DEFAULT 0,
  records_updated integer NOT NULL DEFAULT 0,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT data_sync_logs_records_received_nonnegative CHECK (records_received >= 0),
  CONSTRAINT data_sync_logs_records_created_nonnegative CHECK (records_created >= 0),
  CONSTRAINT data_sync_logs_records_updated_nonnegative CHECK (records_updated >= 0),
  CONSTRAINT data_sync_logs_completed_after_started
    CHECK (completed_at IS NULL OR completed_at >= started_at)
);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

CREATE TRIGGER competitions_set_updated_at
  BEFORE UPDATE ON competitions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER teams_set_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER fixtures_set_updated_at
  BEFORE UPDATE ON fixtures
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixtures ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sync_logs ENABLE ROW LEVEL SECURITY;

-- Public read policies (anon = publishable key, authenticated = signed-in users).
CREATE POLICY competitions_public_read
  ON competitions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY teams_public_read
  ON teams FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY fixtures_public_read
  ON fixtures FOR SELECT
  TO anon, authenticated
  USING (true);

-- data_sync_logs intentionally has NO policy for anon/authenticated:
-- only the server-side secret key (service_role, which bypasses RLS) can reach it.

-- ---------------------------------------------------------------------------
-- Table privileges (defense in depth — do not rely on RLS alone)
-- ---------------------------------------------------------------------------

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Public tables: anon/authenticated may only SELECT.
REVOKE ALL ON TABLE competitions, teams, fixtures, data_sync_logs FROM anon, authenticated;
GRANT SELECT ON TABLE competitions, teams, fixtures TO anon, authenticated;

-- Background sync uses the secret key (service_role), which needs write access.
GRANT SELECT, INSERT, UPDATE ON TABLE competitions, teams, fixtures, data_sync_logs TO service_role;
