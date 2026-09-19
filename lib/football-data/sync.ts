import type { SupabaseClient } from "@supabase/supabase-js"

import { getAdminSupabase } from "../supabase/admin"
import type { FixtureStatus } from "../supabase/types"

import { getCompetition, getCompetitionMatches, getCompetitionTeams, type CompetitionCode } from "./client"
import {
  PROVIDER,
  buildTeamSlug,
  expectedCompetitionName,
  resolveTeamSlug,
  seasonStartYear,
  toCompetitionRow,
  toFixtureRow,
  toTeamRow,
  type FixtureRow,
  type TeamInput,
  type TeamRow,
} from "./transform"

/**
 * One-competition sync orchestration: competition → teams → fixtures, with a
 * per-competition `data_sync_logs` RUNNING → SUCCESS/PARTIAL/FAILED lifecycle.
 *
 * dry-run fetches and transforms everything but makes NO database calls (it
 * must work without SUPABASE_SECRET_KEY). The real path reads existing rows so
 * it can report accurate created/updated counts, preserve existing slugs and
 * fixture statuses, and never fabricate numbers.
 */

const UPSERT_CHUNK = 200

export interface SyncStats {
  competitions: { created: number; updated: number }
  teams: { received: number; created: number; updated: number }
  fixtures: { received: number; created: number; updated: number; skipped: number }
}

export type SyncStatus = "SUCCESS" | "PARTIAL" | "FAILED"

export interface SyncOutcome {
  code: CompetitionCode
  dryRun: boolean
  season: number | null
  competitionName: string
  competitionId: string | null
  unknownStatuses: string[]
  stats: SyncStats
  warnings: string[]
  status: SyncStatus
  errorMessage: string | null
  syncLogId: string | null
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size))
  }
  return out
}

function safeErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  return typeof err === "string" ? err : "unknown error"
}

export async function syncCompetition(
  code: CompetitionCode,
  opts: { dryRun: boolean; admin?: SupabaseClient },
): Promise<SyncOutcome> {
  const dryRun = opts.dryRun
  const db: SupabaseClient | null = dryRun ? null : (opts.admin ?? getAdminSupabase())

  const warnings: string[] = []
  const unknownStatuses = new Set<string>()
  const stats: SyncStats = {
    competitions: { created: 0, updated: 0 },
    teams: { received: 0, created: 0, updated: 0 },
    fixtures: { received: 0, created: 0, updated: 0, skipped: 0 },
  }

  let syncLogId: string | null = null
  let competitionId: string | null = null
  let season: number | null = null
  let competitionName = ""

  try {
    // --- 1. start the sync log (real mode) ------------------------------------
    if (db) {
      const { data, error } = await db
        .from("data_sync_logs")
        .insert({ provider: PROVIDER, sync_type: "competition_full_sync", status: "RUNNING" })
        .select("id")
        .single()
      if (error) throw error
      syncLogId = data.id
    }

    // --- 2. fetch & verify the competition ------------------------------------
    const competition = await getCompetition(code)
    if (competition.code !== code) {
      throw new Error(`football-data.org returned competition code "${competition.code}" for ${code}`)
    }
    competitionName = competition.name
    const expected = expectedCompetitionName(code)
    if (competition.name !== expected) {
      warnings.push(`competition name mismatch: got "${competition.name}", expected "${expected}"`)
    }

    season = seasonStartYear(competition.currentSeason)
    if (season == null) {
      throw new Error("could not determine the season year from currentSeason.startDate")
    }

    const competitionRow = toCompetitionRow(competition, code)

    const teams = await getCompetitionTeams(code, season)
    const matches = await getCompetitionMatches(code, season)
    stats.teams.received = teams.length
    stats.fixtures.received = matches.length

    // --- 3. upsert competition -------------------------------------------------
    if (db) {
      const { data: existing } = await db
        .from("competitions")
        .select("id")
        .eq("provider", PROVIDER)
        .eq("provider_competition_id", competition.id)
        .maybeSingle()
      if (existing) stats.competitions.updated = 1
      else stats.competitions.created = 1

      const { data, error } = await db
        .from("competitions")
        .upsert(competitionRow, { onConflict: "provider,provider_competition_id" })
        .select("id")
        .single()
      if (error) throw error
      competitionId = data.id
    }

    // --- 4. collect teams from /teams plus match home/away refs -----------------
    const teamInputs = new Map<number, TeamInput>()
    for (const team of teams) teamInputs.set(team.id, team)
    for (const match of matches) {
      if (!teamInputs.has(match.homeTeam.id)) teamInputs.set(match.homeTeam.id, match.homeTeam)
      if (!teamInputs.has(match.awayTeam.id)) teamInputs.set(match.awayTeam.id, match.awayTeam)
    }

    // --- 5. resolve slugs & upsert teams ---------------------------------------
    const existingTeamSlugs = new Map<number, string>()
    const usedSlugs = new Set<string>()
    if (db) {
      const { data, error } = await db
        .from("teams")
        .select("provider_team_id, slug")
        .eq("provider", PROVIDER)
      if (error) throw error
      for (const t of data ?? []) {
        existingTeamSlugs.set(t.provider_team_id, t.slug)
        usedSlugs.add(t.slug)
      }
    }

    const teamRows: TeamRow[] = []
    for (const [providerTeamId, team] of teamInputs) {
      const existingSlug = existingTeamSlugs.get(providerTeamId)
      const slug = existingSlug ?? resolveTeamSlug(buildTeamSlug(team.name, providerTeamId), providerTeamId, usedSlugs)
      teamRows.push(toTeamRow(team, slug))
    }

    const teamIdByProvider = new Map<number, string>()
    if (db) {
      for (const batch of chunk(teamRows, UPSERT_CHUNK)) {
        const { data, error } = await db
          .from("teams")
          .upsert(batch, { onConflict: "provider,provider_team_id" })
          .select("id, provider_team_id")
        if (error) throw error
        for (const t of data ?? []) teamIdByProvider.set(t.provider_team_id, t.id)
      }
      stats.teams.created = teamRows.filter((r) => !existingTeamSlugs.has(r.provider_team_id)).length
      stats.teams.updated = teamRows.length - stats.teams.created
    } else {
      for (const providerTeamId of teamInputs.keys()) {
        teamIdByProvider.set(providerTeamId, `team:${providerTeamId}`)
      }
    }

    // --- 6. transform & upsert fixtures ----------------------------------------
    const existingFixtureStatuses = new Map<number, string>()
    if (db) {
      const { data, error } = await db
        .from("fixtures")
        .select("provider_fixture_id, status")
        .eq("provider", PROVIDER)
      if (error) throw error
      for (const f of data ?? []) existingFixtureStatuses.set(f.provider_fixture_id, f.status)
    }

    const fixtureRows: FixtureRow[] = []
    for (const match of matches) {
      const homeTeamId = teamIdByProvider.get(match.homeTeam.id)
      const awayTeamId = teamIdByProvider.get(match.awayTeam.id)
      if (!homeTeamId || !awayTeamId) {
        stats.fixtures.skipped += 1
        warnings.push(
          `fixture ${match.id}: missing team ref (home=${match.homeTeam.id}, away=${match.awayTeam.id}) — skipped`,
        )
        continue
      }

      const result = toFixtureRow({
        match,
        season,
        competitionId: competitionId ?? "dry-run",
        homeTeamId,
        awayTeamId,
      })

      if (!result.statusRecognized) {
        unknownStatuses.add(match.status)
        const existingStatus = existingFixtureStatuses.get(match.id)
        if (existingStatus) {
          // Existing fixture: preserve the database status rather than writing null.
          result.row.status = existingStatus as FixtureStatus
        } else {
          stats.fixtures.skipped += 1
          warnings.push(`fixture ${match.id}: unknown status "${match.status}" — skipped`)
          continue
        }
      }

      fixtureRows.push(result.row)
    }

    if (db) {
      for (const batch of chunk(fixtureRows, UPSERT_CHUNK)) {
        const { error } = await db
          .from("fixtures")
          .upsert(batch, { onConflict: "provider,provider_fixture_id" })
        if (error) throw error
      }
      stats.fixtures.created = fixtureRows.filter(
        (r) => !existingFixtureStatuses.has(r.provider_fixture_id),
      ).length
      stats.fixtures.updated = fixtureRows.length - stats.fixtures.created
    }

    // --- 7. finalize the sync log ----------------------------------------------
    const finalStatus: SyncStatus = stats.fixtures.skipped > 0 || warnings.length > 0 ? "PARTIAL" : "SUCCESS"

    if (db) {
      const recordsReceived = 1 + stats.teams.received + stats.fixtures.received
      const recordsCreated = stats.competitions.created + stats.teams.created + stats.fixtures.created
      const recordsUpdated = stats.competitions.updated + stats.teams.updated + stats.fixtures.updated
      const { error } = await db
        .from("data_sync_logs")
        .update({
          competition_id: competitionId,
          status: finalStatus,
          completed_at: new Date().toISOString(),
          records_received: recordsReceived,
          records_created: recordsCreated,
          records_updated: recordsUpdated,
          error_message: null,
        })
        .eq("id", syncLogId)
      if (error) throw error
    }

    return {
      code,
      dryRun,
      season,
      competitionName,
      competitionId,
      unknownStatuses: [...unknownStatuses].sort(),
      stats,
      warnings,
      status: finalStatus,
      errorMessage: null,
      syncLogId,
    }
  } catch (err) {
    const message = safeErrorMessage(err)
    if (db && syncLogId) {
      try {
        await db
          .from("data_sync_logs")
          .update({ status: "FAILED", completed_at: new Date().toISOString(), error_message: message })
          .eq("id", syncLogId)
      } catch {
        // best-effort: a failure to record the failure must not mask the real error
      }
    }
    return {
      code,
      dryRun,
      season,
      competitionName,
      competitionId,
      unknownStatuses: [...unknownStatuses].sort(),
      stats,
      warnings,
      status: "FAILED",
      errorMessage: message,
      syncLogId,
    }
  }
}
