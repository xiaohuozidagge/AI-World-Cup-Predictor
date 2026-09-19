import { test } from "node:test"
import assert from "node:assert/strict"

import type { SupabaseClient } from "@supabase/supabase-js"

import { hasActiveSync, runCronSync, type CronEnv, type CronSyncFn } from "./cron-sync"
import type { CompetitionCode } from "./client"
import type { SyncOutcome } from "./sync"

const FIXED_NOW = new Date("2026-09-19T12:00:00.000Z")
const CUTOFF = new Date(FIXED_NOW.getTime() - 20 * 60_000).toISOString()

function fullEnv(): CronEnv {
  return {
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_SECRET_KEY: "secret-key",
    FOOTBALL_DATA_API_KEY: "api-key",
  }
}

function makeOutcome(code: CompetitionCode, overrides: Partial<SyncOutcome> = {}): SyncOutcome {
  return {
    code,
    dryRun: false,
    season: 2025,
    competitionName: code === "PL" ? "Premier League" : "UEFA Champions League",
    competitionId: "comp-id",
    unknownStatuses: [],
    stats: {
      competitions: { created: 0, updated: 1 },
      teams: { received: 20, created: 0, updated: 20 },
      fixtures: { received: 380, created: 10, updated: 370, skipped: 0 },
    },
    warnings: [],
    status: "SUCCESS",
    errorMessage: null,
    syncLogId: "log-id",
    ...overrides,
  }
}

// --- fake database -----------------------------------------------------------

interface FakeDb {
  from: () => QueryChain
  calls: { select: string[]; eq: Array<[string, unknown]>; gte: Array<[string, string]> }
}

interface QueryChain {
  select: (col: string) => QueryChain
  eq: (col: string, val: unknown) => QueryChain
  gte: (col: string, val: string) => QueryChain
  limit: (n: number) => Promise<{ data: unknown[] | null; error: { code?: string } | null }>
}

function capturingDb(
  result: { data: unknown[] | null; error: { code?: string } | null } | Error,
): FakeDb & { db: SupabaseClient } {
  const calls: FakeDb["calls"] = { select: [], eq: [], gte: [] }
  const chain: QueryChain = {
    select: (col) => {
      calls.select.push(col)
      return chain
    },
    eq: (col, val) => {
      calls.eq.push([col, val])
      return chain
    },
    gte: (col, val) => {
      calls.gte.push([col, val])
      return chain
    },
    limit: () =>
      result instanceof Error ? Promise.reject(result) : Promise.resolve(result),
  }
  const from = () => chain
  return { from, calls, db: { from } as unknown as SupabaseClient }
}

// --- runCronSync --------------------------------------------------------------

test("runCronSync skips and lists every missing binding when env is empty", async () => {
  const result = await runCronSync({}, {})
  assert.equal(result.skipped, true)
  assert.deepEqual(result.missingKeys, [
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SECRET_KEY",
    "FOOTBALL_DATA_API_KEY",
  ])
  assert.equal(result.outcomes.length, 0)
})

test("runCronSync skips with 'sync already running' when the overlap check finds an active sync", async () => {
  let built = false
  let ran = false
  const result = await runCronSync(fullEnv(), {
    buildAdmin: () => {
      built = true
      return {} as SupabaseClient
    },
    hasActiveSync: async () => true,
    sync: async () => {
      ran = true
      return makeOutcome("PL")
    },
    now: () => FIXED_NOW,
  })
  assert.equal(built, true)
  assert.equal(ran, false)
  assert.equal(result.skipped, true)
  assert.equal(result.skipReason, "sync already running")
  assert.equal(result.outcomes.length, 0)
})

test("runCronSync runs PL then CL serially and returns one outcome per competition", async () => {
  const order: CompetitionCode[] = []
  const sync: CronSyncFn = async (code) => {
    order.push(code)
    return makeOutcome(code)
  }
  const result = await runCronSync(fullEnv(), {
    buildAdmin: () => ({} as SupabaseClient),
    hasActiveSync: async () => false,
    sync,
    now: () => FIXED_NOW,
  })
  assert.deepEqual(order, ["PL", "CL"])
  assert.equal(result.skipped, false)
  assert.equal(result.outcomes.length, 2)
  assert.equal(result.outcomes[0].code, "PL")
  assert.equal(result.outcomes[0].status, "SUCCESS")
  assert.equal(result.outcomes[0].received, 380)
  assert.equal(result.outcomes[0].created, 10)
  assert.equal(result.outcomes[0].updated, 370)
  assert.equal(result.outcomes[1].code, "CL")
})

test("runCronSync records a FAILED outcome for a throwing sync and continues to the next competition", async () => {
  const sync: CronSyncFn = async (code) => {
    if (code === "PL") throw new Error("boom")
    return makeOutcome(code)
  }
  const result = await runCronSync(fullEnv(), {
    buildAdmin: () => ({} as SupabaseClient),
    hasActiveSync: async () => false,
    sync,
    now: () => FIXED_NOW,
  })
  assert.equal(result.skipped, false)
  assert.equal(result.outcomes[0].code, "PL")
  assert.equal(result.outcomes[0].status, "FAILED")
  assert.equal(result.outcomes[0].errorMessage, "boom")
  assert.equal(result.outcomes[1].code, "CL")
  assert.equal(result.outcomes[1].status, "SUCCESS")
})

// --- hasActiveSync ------------------------------------------------------------

test("hasActiveSync filters data_sync_logs by provider, sync_type and status within the window", async () => {
  const fake = capturingDb({ data: [{ id: "running-log" }], error: null })
  const active = await hasActiveSync(fake.db, FIXED_NOW)
  assert.equal(active, true)
  assert.deepEqual(fake.calls.select, ["id"])
  assert.deepEqual(fake.calls.eq, [
    ["provider", "football-data.org"],
    ["sync_type", "competition_full_sync"],
    ["status", "RUNNING"],
  ])
  assert.deepEqual(fake.calls.gte, [["started_at", CUTOFF]])
})

test("hasActiveSync is false when no RUNNING log is in the window or the query fails", async () => {
  assert.equal(await hasActiveSync(capturingDb({ data: [], error: null }).db, FIXED_NOW), false)
  assert.equal(
    await hasActiveSync(capturingDb({ data: null, error: { code: "42P01" } }).db, FIXED_NOW),
    false,
  )
  // A thrown query error must not block the run.
  assert.equal(await hasActiveSync(capturingDb(new Error("connection lost")).db, FIXED_NOW), false)
})
