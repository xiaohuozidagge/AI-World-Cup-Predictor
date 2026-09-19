/**
 * Read-only sanity check of the synced league data (competitions / teams /
 * fixtures / sync logs). Uses the admin client but performs no writes.
 *
 *   npm run verify:league
 */
import { loadSyncEnv } from "./load-sync-env"

import { getAdminSupabase } from "../lib/supabase/admin"

loadSyncEnv()

async function main(): Promise<void> {
  const db = getAdminSupabase()
  const provider = "football-data.org"

  console.log("=== competitions ===")
  const comps = await db
    .from("competitions")
    .select("slug, name, country, current_season, provider_competition_id")
    .eq("provider", provider)
    .order("slug")
  if (comps.error) throw comps.error
  for (const c of comps.data ?? []) {
    console.log(`${c.slug} | ${c.name} | ${c.country} | season ${c.current_season} | api id ${c.provider_competition_id}`)
  }

  console.log("\n=== teams ===")
  const teams = await db
    .from("teams")
    .select("id, name, slug, country")
    .eq("provider", provider)
    .order("slug")
  if (teams.error) throw teams.error
  const teamRows = teams.data ?? []
  console.log(`total teams: ${teamRows.length}`)
  for (const t of teamRows.slice(0, 8)) {
    console.log(`  ${t.slug} | ${t.name} | ${t.country ?? "-"}`)
  }

  console.log("\n=== fixtures ===")
  const fixtures = await db
    .from("fixtures")
    .select("id, home_team_id, away_team_id, status, home_score, away_score, winner_team_id")
    .eq("provider", provider)
  if (fixtures.error) throw fixtures.error
  const fixtureRows = fixtures.data ?? []
  const byStatus = new Map<string, number>()
  for (const f of fixtureRows) byStatus.set(f.status, (byStatus.get(f.status) ?? 0) + 1)
  console.log(`total fixtures: ${fixtureRows.length}`)
  console.log(`by status: ${[...byStatus.entries()].map(([k, v]) => `${k}=${v}`).join(", ")}`)
  console.log(`fixtures with a score: ${fixtureRows.filter((f) => f.home_score != null || f.away_score != null).length}`)
  console.log(`fixtures with a winner: ${fixtureRows.filter((f) => f.winner_team_id != null).length}`)

  const nameById = new Map(teamRows.map((t) => [t.id, t.name]))
  const finished = fixtureRows.find((f) => f.status === "FINISHED" && f.home_score != null)
  if (finished) {
    console.log(
      `sample FINISHED: ${nameById.get(finished.home_team_id) ?? "?"} ${finished.home_score} - ${finished.away_score} ${nameById.get(finished.away_team_id) ?? "?"}`,
    )
  }
  const scheduled = fixtureRows.find((f) => f.status === "SCHEDULED")
  if (scheduled) {
    console.log(
      `sample SCHEDULED (null score): ${nameById.get(scheduled.home_team_id) ?? "?"} vs ${nameById.get(scheduled.away_team_id) ?? "?"} (score ${scheduled.home_score ?? "null"}-${scheduled.away_score ?? "null"})`,
    )
  }

  console.log("\n=== data_sync_logs ===")
  const logs = await db
    .from("data_sync_logs")
    .select("status, sync_type, records_received, records_created, records_updated")
    .eq("provider", provider)
    .order("started_at")
  if (logs.error) throw logs.error
  for (const l of logs.data ?? []) {
    console.log(
      `${l.sync_type} | ${l.status} | received=${l.records_received} created=${l.records_created} updated=${l.records_updated}`,
    )
  }
}

void main()
