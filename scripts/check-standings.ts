/**
 * Read-only accessibility check for the football-data.org standings endpoints.
 *
 * It never writes standings (there is no standings table). For each of PL and
 * CL it records: HTTP status (200 implied by success, otherwise the error's
 * status), whether a standings array is present, the standings type, and — for
 * CL — whether league-phase data is returned.
 *
 *   npm run check:standings
 */
import { loadSyncEnv } from "./load-sync-env"

import {
  getCompetition,
  getCompetitionStandings,
  type CompetitionCode,
} from "../lib/football-data/client"
import { seasonStartYear } from "../lib/football-data/transform"

loadSyncEnv()

const CODES: CompetitionCode[] = ["PL", "CL"]

async function main(): Promise<void> {
  if (!process.env.FOOTBALL_DATA_API_KEY) {
    console.error("FOOTBALL_DATA_API_KEY is not set in .env.sync.")
    process.exitCode = 1
    return
  }

  let ok = true
  for (const code of CODES) {
    console.log(`\n=== ${code} standings ===`)
    try {
      const competition = await getCompetition(code)
      const season = seasonStartYear(competition.currentSeason)
      if (season == null) {
        console.log("  ✗ could not determine the current season")
        ok = false
        continue
      }

      const res = await getCompetitionStandings(code, season)
      const standings = res.standings ?? []
      console.log(`  HTTP 200 OK (season ${season})`)
      console.log(`  standings groups: ${standings.length}`)
      for (const s of standings) {
        console.log(
          `  - type=${s.type ?? "?"} stage=${s.stage ?? "?"} group=${s.group ?? "?"} rows=${s.table?.length ?? 0}`,
        )
      }
      if (standings.length === 0) {
        console.log("  ✗ no standings array returned")
        ok = false
      }
    } catch (err) {
      const status = (err as { status?: number | null }).status
      console.log(`  ✗ failed${status != null ? ` (HTTP ${status})` : ""}: ${(err as Error).message}`)
      ok = false
    }
  }

  if (!ok) {
    console.log("\nStandings check failed.")
    process.exitCode = 1
    return
  }
  console.log("\nStandings endpoints accessible.")
}

void main()
