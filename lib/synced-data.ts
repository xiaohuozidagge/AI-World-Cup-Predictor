import { readFileSync, existsSync } from "fs"
import { join } from "path"
import type { SyncedMatch } from "@/lib/football-data/normalize"
import { teams } from "@/data/teams"

let _syncedMatches: SyncedMatch[] | null = null

export function loadSyncedMatches(): SyncedMatch[] {
  if (_syncedMatches !== null) return _syncedMatches
  try {
    const path = join(process.cwd(), "data", "synced", "matches.json")
    if (!existsSync(path)) return []
    _syncedMatches = JSON.parse(readFileSync(path, "utf-8")) as SyncedMatch[]
    return _syncedMatches
  } catch {
    return []
  }
}

function teamMatch(syncedTeam: string, syncedSlug: string | undefined, localTeam: string): boolean {
  if (syncedTeam === localTeam) return true
  if (syncedSlug === localTeam) return true
  const localSlug = teams.find(t => t.name === localTeam)?.slug
  if (localSlug && syncedSlug === localSlug) return true
  return false
}

export function findSyncedMatch(teamA: string, teamB: string): SyncedMatch | undefined {
  const synced = loadSyncedMatches()
  return synced.find(m => teamMatch(m.teamA, m.teamASlug, teamA) && teamMatch(m.teamB, m.teamBSlug, teamB))
}

export function findSyncedMatchBySlug(slug: string): SyncedMatch | undefined {
  const synced = loadSyncedMatches()
  return synced.find(m => m.slug === slug)
}

export function isMatchFinished(synced?: SyncedMatch): boolean {
  return synced?.status === "finished" && !!synced.actualScore
}

export function lookupUtcDate(teamA: string, teamB: string): string | undefined {
  const m = findSyncedMatch(teamA, teamB)
  return m?.utcDate
}
