import { loadEnvConfig } from "@next/env"
import { getPublicSupabase } from "../lib/supabase/public"

loadEnvConfig(process.cwd())

async function main() {
  const db = getPublicSupabase()
  const { data, error } = await db
    .from("fixtures")
    .select("competition_id, round, matchweek, stage, status, provider_fixture_id")
    .eq("provider", "football-data.org")
  if (error) throw error
  const rows = data ?? []

  const comps = await db.from("competitions").select("id, slug, name").eq("provider", "football-data.org")
  const slugById = new Map((comps.data ?? []).map((c: any) => [c.id, c.slug]))

  const byComp = new Map<string, any[]>()
  for (const r of rows) {
    const arr = byComp.get(r.competition_id) ?? []
    arr.push(r)
    byComp.set(r.competition_id, arr)
  }
  for (const [cid, arr] of byComp) {
    const stages = new Map<string, number>()
    const rounds = new Map<string, number>()
    const mws = new Map<number, number>()
    const statuses = new Map<string, number>()
    for (const r of arr) {
      stages.set(String(r.stage), (stages.get(String(r.stage)) ?? 0) + 1)
      rounds.set(String(r.round), (rounds.get(String(r.round)) ?? 0) + 1)
      mws.set(r.matchweek, (mws.get(r.matchweek) ?? 0) + 1)
      statuses.set(r.status, (statuses.get(r.status) ?? 0) + 1)
    }
    console.log(`\n=== ${slugById.get(cid)} (${arr.length} fixtures) ===`)
    console.log("stages:", [...stages.entries()].sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}=${v}`).join(", "))
    console.log("rounds:", [...rounds.entries()].sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}=${v}`).join(", "))
    console.log("matchweeks:", [...mws.entries()].sort((a,b)=>(a[0]??0)-(b[0]??0)).map(([k,v])=>`${k}=${v}`).join(", "))
    console.log("statuses:", [...statuses.entries()].map(([k,v])=>`${k}=${v}`).join(", "))
    console.log("sample provider_fixture_id:", arr[0].provider_fixture_id, typeof arr[0].provider_fixture_id)
  }
  const fin = rows.find((r) => r.status === "FINISHED")
  console.log("\nsample FINISHED row:", JSON.stringify(fin))
}

void main()
