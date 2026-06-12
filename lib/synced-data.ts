import { readFileSync, existsSync } from "fs"
import { join } from "path"
import type { SyncedMatch } from "@/lib/football-data/normalize"

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

export function findSyncedMatch(teamA: string, teamB: string): SyncedMatch | undefined {
  const synced = loadSyncedMatches()
  return synced.find(m => {
    const aMatch = m.teamA === teamA || m.teamASlug === teamA
    const bMatch = m.teamB === teamB || m.teamBSlug === teamB
    return aMatch && bMatch
  })
}

export function findSyncedMatchBySlug(slug: string): SyncedMatch | undefined {
  const synced = loadSyncedMatches()
  return synced.find(m => m.slug === slug)
}

export function isMatchFinished(synced?: SyncedMatch): boolean {
  return synced?.status === "finished" && !!synced.actualScore
}
