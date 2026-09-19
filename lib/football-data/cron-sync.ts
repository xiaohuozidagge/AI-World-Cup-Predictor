/**
 * Cron entry point for the football-data.org sync (Phase 5).
 *
 * Cloudflare Cron Triggers invoke the Worker's `scheduled` handler once per
 * hour. Cloudflare does not populate `process.env` for scheduled events, so this
 * module reads the Supabase and football-data.org credentials explicitly from
 * the Worker's env bindings and injects them into the Phase 3 sync code — which
 * is reused unchanged; there is no second copy of the API client, converters,
 * upsert or logging logic.
 *
 * Behaviour:
 * - serial: Premier League first, then Champions League (never in parallel),
 * - guarded against overlap via `data_sync_logs` (a RUNNING
 *   `competition_full_sync` started within the last 20 minutes),
 * - safe logs only: status + counts. Never keys, headers, URLs, full API
 *   responses, full env or connection strings,
 * - never calls the standings endpoint, never generates predictions,
 * - never touches World Cup data.
 *
 * `runCronSync` is dependency-injected so unit tests can supply a fake env, a
 * fake `sync` function and a fake overlap check without touching the network.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

import { setFootballDataApiKey, type CompetitionCode } from "./client"
import { syncCompetition, type SyncOutcome } from "./sync"
import { PROVIDER } from "./transform"

export const CRON_CODES: readonly CompetitionCode[] = ["PL", "CL"]
export const OVERLAP_WINDOW_MINUTES = 20

// --- types -------------------------------------------------------------------

export interface CronEnv {
  NEXT_PUBLIC_SUPABASE_URL?: string
  SUPABASE_SECRET_KEY?: string
  FOOTBALL_DATA_API_KEY?: string
}

export type CronSyncFn = (code: CompetitionCode, admin: SupabaseClient) => Promise<SyncOutcome>

export interface CronSyncDeps {
  /** Override the competition sync (injected in tests). */
  sync?: CronSyncFn
  /** Override the overlap check (injected in tests). */
  hasActiveSync?: (db: SupabaseClient, now: Date) => Promise<boolean>
  /** Override admin client construction (injected in tests). */
  buildAdmin?: (env: CronEnv) => SupabaseClient
  /** Clock, for deterministic tests. */
  now?: () => Date
}

export interface CompetitionCronResult {
  code: CompetitionCode
  status: SyncOutcome["status"]
  errorMessage: string | null
  competitionName: string
  season: number | null
  received: number
  created: number
  updated: number
  skipped: number
}

export interface CronRunResult {
  startedAt: string
  completedAt: string
  skipped: boolean
  skipReason: string | null
  missingKeys: string[]
  outcomes: CompetitionCronResult[]
}

// --- helpers -----------------------------------------------------------------

function missingKeys(env: CronEnv): string[] {
  const missing: string[] = []
  if (!env.NEXT_PUBLIC_SUPABASE_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL")
  if (!env.SUPABASE_SECRET_KEY) missing.push("SUPABASE_SECRET_KEY")
  if (!env.FOOTBALL_DATA_API_KEY) missing.push("FOOTBALL_DATA_API_KEY")
  return missing
}

function toCompetitionResult(o: SyncOutcome): CompetitionCronResult {
  return {
    code: o.code,
    status: o.status,
    errorMessage: o.errorMessage,
    competitionName: o.competitionName,
    season: o.season,
    received: o.stats.fixtures.received,
    created: o.stats.fixtures.created,
    updated: o.stats.fixtures.updated,
    skipped: o.stats.fixtures.skipped,
  }
}

function failedOutcome(code: CompetitionCode, message: string): CompetitionCronResult {
  return {
    code,
    status: "FAILED",
    errorMessage: message,
    competitionName: "",
    season: null,
    received: 0,
    created: 0,
    updated: 0,
    skipped: 0,
  }
}

// --- overlap check -----------------------------------------------------------

/**
 * True when a `competition_full_sync` for football-data.org is RUNNING and was
 * started within the overlap window. Query failures are treated as "not active"
 * (a transient DB error must not block a scheduled run) and logged safely.
 */
export async function hasActiveSync(db: SupabaseClient, now: Date): Promise<boolean> {
  const cutoff = new Date(now.getTime() - OVERLAP_WINDOW_MINUTES * 60_000).toISOString()
  try {
    const { data, error } = await db
      .from("data_sync_logs")
      .select("id")
      .eq("provider", PROVIDER)
      .eq("sync_type", "competition_full_sync")
      .eq("status", "RUNNING")
      .gte("started_at", cutoff)
      .limit(1)
    if (error) {
      console.error(`[cron sync] overlap check failed (${error.code ?? "unknown"}) — proceeding`)
      return false
    }
    return (data?.length ?? 0) > 0
  } catch (err) {
    const code = (err as { code?: string } | null)?.code
    console.error(`[cron sync] overlap check failed${code ? ` (${code})` : ""} — proceeding`)
    return false
  }
}

// --- run ---------------------------------------------------------------------

export async function runCronSync(env: CronEnv, deps: CronSyncDeps = {}): Promise<CronRunResult> {
  const now = deps.now ?? (() => new Date())
  const startedAt = now().toISOString()

  const missing = missingKeys(env)
  if (missing.length > 0) {
    console.error(`[cron sync] skipped — missing bindings: ${missing.join(", ")}`)
    return {
      startedAt,
      completedAt: now().toISOString(),
      skipped: true,
      skipReason: `missing bindings: ${missing.join(", ")}`,
      missingKeys: missing,
      outcomes: [],
    }
  }

  let db: SupabaseClient
  try {
    db = deps.buildAdmin
      ? deps.buildAdmin(env)
      : createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SECRET_KEY!, {
          auth: { persistSession: false, autoRefreshToken: false },
        })
  } catch {
    console.error("[cron sync] skipped — could not initialize the Supabase client")
    return {
      startedAt,
      completedAt: now().toISOString(),
      skipped: true,
      skipReason: "could not initialize the Supabase client",
      missingKeys: [],
      outcomes: [],
    }
  }

  if (await (deps.hasActiveSync ?? hasActiveSync)(db, now())) {
    console.log("[cron sync] sync already running — skipping this run")
    return {
      startedAt,
      completedAt: now().toISOString(),
      skipped: true,
      skipReason: "sync already running",
      missingKeys: [],
      outcomes: [],
    }
  }

  setFootballDataApiKey(env.FOOTBALL_DATA_API_KEY!)
  const syncFn = deps.sync ?? ((code, admin) => syncCompetition(code, { dryRun: false, admin }))

  const outcomes: CompetitionCronResult[] = []
  for (const code of CRON_CODES) {
    try {
      outcomes.push(toCompetitionResult(await syncFn(code, db)))
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown error"
      outcomes.push(failedOutcome(code, message))
    }
  }

  const completedAt = now().toISOString()
  for (const o of outcomes) {
    console.log(
      `[cron sync] ${o.code}: ${o.status} received=${o.received} created=${o.created} updated=${o.updated} skipped=${o.skipped}`,
    )
  }

  return { startedAt, completedAt, skipped: false, skipReason: null, missingKeys: [], outcomes }
}
