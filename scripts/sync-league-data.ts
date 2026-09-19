/**
 * Syncs Premier League (PL) and Champions League (CL) real data from
 * football-data.org v4 into Supabase.
 *
 *   npm run sync:football -- --competition PL --dry-run
 *   npm run sync:football -- --competition PL,CL
 *   npm run sync:football -- --competition CL
 *
 * Only PL and CL are accepted. The API key is read server-side only and never
 * printed. Use --dry-run to inspect what WOULD be written before writing — the
 * dry-run makes no database calls.
 */
import { loadSyncEnv } from "./load-sync-env"

import type { CompetitionCode } from "../lib/football-data/client"
import { syncCompetition, type SyncOutcome } from "../lib/football-data/sync"

loadSyncEnv()

function parseCompetitions(value: string): CompetitionCode[] {
  const codes = value
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter((s) => s.length > 0)

  for (const code of codes) {
    if (code !== "PL" && code !== "CL") {
      throw new Error(`unsupported competition code "${code}" — only PL and CL are allowed`)
    }
  }
  if (codes.length === 0) {
    throw new Error("no competition codes provided")
  }
  return codes as CompetitionCode[]
}

function parseArgs(argv: string[]): { competitions: CompetitionCode[]; dryRun: boolean } {
  let competitions: CompetitionCode[] = ["PL", "CL"]
  let dryRun = false

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === "--dry-run") {
      dryRun = true
    } else if (arg === "--competition") {
      const value = argv[i + 1]
      if (!value) throw new Error("--competition requires a value (PL, CL, or PL,CL)")
      competitions = parseCompetitions(value)
      i++
    } else if (arg.startsWith("--competition=")) {
      competitions = parseCompetitions(arg.slice("--competition=".length))
    } else if (arg === "--help" || arg === "-h") {
      throw new Error("__help__")
    }
  }

  return { competitions, dryRun }
}

function printOutcome(o: SyncOutcome): void {
  console.log(`  competition: ${o.competitionName}`)
  console.log(`  season:      ${o.season ?? "?"}`)
  console.log(`  status:      ${o.status}${o.dryRun ? " (dry-run)" : ""}`)
  if (o.syncLogId) console.log(`  sync log:    ${o.syncLogId}`)
  console.log(
    `  competitions: created=${o.stats.competitions.created} updated=${o.stats.competitions.updated}`,
  )
  console.log(
    `  teams:       received=${o.stats.teams.received} created=${o.stats.teams.created} updated=${o.stats.teams.updated}`,
  )
  console.log(
    `  fixtures:    received=${o.stats.fixtures.received} created=${o.stats.fixtures.created} updated=${o.stats.fixtures.updated} skipped=${o.stats.fixtures.skipped}`,
  )
  if (o.unknownStatuses.length > 0) {
    console.log(`  unknown statuses: ${o.unknownStatuses.join(", ")}`)
  }
  for (const warning of o.warnings) {
    console.log(`  warning: ${warning}`)
  }
  if (o.errorMessage) {
    console.log(`  error: ${o.errorMessage}`)
  }
}

async function main(): Promise<void> {
  let args: { competitions: CompetitionCode[]; dryRun: boolean }
  try {
    args = parseArgs(process.argv.slice(2))
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg === "__help__" || process.argv.includes("--help") || process.argv.includes("-h")) {
      console.log("Usage: npm run sync:football -- [--competition PL|CL|PL,CL] [--dry-run]")
      console.log("  --competition PL|CL|PL,CL   which competition(s) to sync (default PL,CL)")
      console.log("  --dry-run                   fetch and transform only, write nothing")
      return
    }
    console.error(`Error: ${msg}`)
    console.error("Usage: npm run sync:football -- [--competition PL|CL|PL,CL] [--dry-run]")
    process.exitCode = 1
    return
  }

  if (!process.env.FOOTBALL_DATA_API_KEY) {
    console.error("FOOTBALL_DATA_API_KEY is not set in .env.sync.")
    process.exitCode = 1
    return
  }

  console.log(
    `Syncing competition(s): ${args.competitions.join(", ")}${args.dryRun ? " (DRY RUN)" : ""}`,
  )

  const outcomes: SyncOutcome[] = []
  for (const code of args.competitions) {
    console.log(`\n=== ${code} ===`)
    const outcome = await syncCompetition(code, { dryRun: args.dryRun })
    outcomes.push(outcome)
    printOutcome(outcome)
  }

  console.log("\n--- summary ---")
  for (const o of outcomes) {
    console.log(`${o.code}: ${o.status}`)
  }

  if (outcomes.some((o) => o.status === "FAILED")) {
    console.error("\nOne or more competitions failed.")
    process.exitCode = 1
  }
}

void main()
