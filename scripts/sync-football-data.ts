#!/usr/bin/env tsx
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs"
import { join } from "path"

// Load .env.local (tsx doesn't auto-load dotenv)
const ROOT = process.cwd()
for (const envFile of [".env.local", ".env"]) {
  const envPath = join(ROOT, envFile)
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf-8").split("\n")) {
      const eq = line.indexOf("=")
      if (eq > 0 && !line.trimStart().startsWith("#")) {
        const key = line.slice(0, eq).trim()
        if (!process.env[key]) process.env[key] = line.slice(eq + 1).trim()
      }
    }
  }
}

import { normalizeMatch, normalizeStandings, normalizeTeam } from "../lib/football-data/normalize"
import type { SyncedMatch, SyncedStanding, SyncedTeam } from "../lib/football-data/normalize"

const API_BASE = "https://api.football-data.org/v4"
const COMPETITION_ID = "2000"
const SEASON = "2026"
const DATA_DIR = join(import.meta.dirname || __dirname, "..", "data", "synced")

interface SyncSummary {
  matchesFetched: number
  standingsRowsFetched: number
  teamsFetched: number
  finishedMatches: number
  scheduledMatches: number
  liveMatches: number
  unmatchedMatches: number
  errors: string[]
}

async function main() {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY
  if (!apiKey) {
    console.error("ERROR: FOOTBALL_DATA_API_KEY is not set. Create a .env.local file with your API key.")
    process.exit(existsSync(join(DATA_DIR, "matches.json")) ? 0 : 1)
  }

  const headers = { "X-Auth-Token": apiKey }
  const summary: SyncSummary = {
    matchesFetched: 0, standingsRowsFetched: 0, teamsFetched: 0,
    finishedMatches: 0, scheduledMatches: 0, liveMatches: 0,
    unmatchedMatches: 0, errors: [],
  }

  mkdirSync(DATA_DIR, { recursive: true })

  // 1. Fetch matches
  console.log("Fetching matches from football-data.org...")
  let normalizedMatches: SyncedMatch[] = []
  try {
    const res = await fetch(`${API_BASE}/competitions/${COMPETITION_ID}/matches?season=${SEASON}`, { headers })
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    const data = await res.json() as { matches: Record<string, unknown>[] }
    normalizedMatches = (data.matches || []).map(normalizeMatch).filter(Boolean) as SyncedMatch[]
    summary.matchesFetched = normalizedMatches.length
    summary.finishedMatches = normalizedMatches.filter(m => m.status === "finished").length
    summary.scheduledMatches = normalizedMatches.filter(m => m.status === "scheduled").length
    summary.liveMatches = normalizedMatches.filter(m => m.status === "live").length

    // Count unmatched
    summary.unmatchedMatches = normalizedMatches.filter(m => !m.teamASlug || !m.teamBSlug).length
    const unmatched = normalizedMatches.filter(m => !m.teamASlug || !m.teamBSlug)
    if (unmatched.length > 0) {
      writeFileSync(join(DATA_DIR, "unmatched.json"), JSON.stringify(unmatched, null, 2))
      console.log(`  ${unmatched.length} unmatched matches saved to unmatched.json`)
    }
  } catch (err) {
    summary.errors.push(`Matches fetch failed: ${err}`)
    console.error("  Matches fetch failed:", err)
  }

  // 2. Fetch standings
  console.log("Fetching standings from football-data.org...")
  let normalizedStandings: SyncedStanding[] = []
  try {
    const res = await fetch(`${API_BASE}/competitions/${COMPETITION_ID}/standings?season=${SEASON}`, { headers })
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    const data = await res.json() as { standings: Record<string, unknown>[] }
    normalizedStandings = normalizeStandings(data.standings || [])
    summary.standingsRowsFetched = normalizedStandings.length
  } catch (err) {
    summary.errors.push(`Standings fetch failed: ${err}`)
    console.error("  Standings fetch failed:", err)
  }

  // 3. Fetch teams
  console.log("Fetching teams from football-data.org...")
  let normalizedTeams: SyncedTeam[] = []
  try {
    const res = await fetch(`${API_BASE}/competitions/${COMPETITION_ID}/teams?season=${SEASON}`, { headers })
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    const data = await res.json() as { teams: Record<string, unknown>[] }
    normalizedTeams = (data.teams || []).map(normalizeTeam)
    summary.teamsFetched = normalizedTeams.length
  } catch (err) {
    summary.errors.push(`Teams fetch failed: ${err}`)
    console.error("  Teams fetch failed:", err)
  }

  // If we have previous data and all fetches failed, keep old data
  if (summary.matchesFetched === 0 && summary.standingsRowsFetched === 0 && existsSync(join(DATA_DIR, "matches.json"))) {
    console.log("All fetches failed but previous synced data exists — keeping old data.")
    process.exit(0)
  }

  // 4. Merge with local prediction data
  if (normalizedMatches.length > 0) {
    const localPreds: Record<string, unknown>[] = []
    try {
      const predsRaw = readFileSync(join(import.meta.dirname || __dirname, "..", "data", "predictions.ts"), "utf-8")
      const slugMatches = predsRaw.matchAll(/matchSlug:\s*"([^"]+)"/g)
      for (const m of slugMatches) localPreds.push({ matchSlug: m[1] })
    } catch { /* predictions file may not exist in CI */ }

    // Attach predictionSlug to synced matches where possible
    for (const match of normalizedMatches) {
      if (match.teamASlug && match.teamBSlug) {
        const predSlug = `${match.teamASlug}-vs-${match.teamBSlug}-prediction`
        ;(match as unknown as Record<string, unknown>).predictionSlug = predSlug
      }
    }
  }

  // 5. Write JSON files
  if (normalizedMatches.length > 0) {
    writeFileSync(join(DATA_DIR, "matches.json"), JSON.stringify(normalizedMatches, null, 2))
  }
  if (normalizedStandings.length > 0) {
    writeFileSync(join(DATA_DIR, "standings.json"), JSON.stringify(normalizedStandings, null, 2))
  }
  if (normalizedTeams.length > 0) {
    writeFileSync(join(DATA_DIR, "teams.json"), JSON.stringify(normalizedTeams, null, 2))
  }

  // 6. Write last-updated
  writeFileSync(join(DATA_DIR, "last-updated.json"), JSON.stringify({
    lastSync: new Date().toISOString(),
    summary,
  }, null, 2))

  // 7. Log summary
  console.log(`\n=== SYNC SUMMARY ===`)
  console.log(`Matches:     ${summary.matchesFetched} (${summary.finishedMatches} finished, ${summary.scheduledMatches} scheduled, ${summary.liveMatches} live)`)
  console.log(`Standings:   ${summary.standingsRowsFetched} rows`)
  console.log(`Teams:       ${summary.teamsFetched}`)
  console.log(`Unmatched:   ${summary.unmatchedMatches}`)
  if (summary.errors.length) {
    console.log(`Errors:      ${summary.errors.length}`)
    summary.errors.forEach(e => console.log(`  - ${e}`))
  }
  console.log(`Written to:  ${DATA_DIR}/`)
}

main()
