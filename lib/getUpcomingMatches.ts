import { loadSyncedMatches } from "@/lib/synced-data"
import { matches } from "@/data/matches"
import { sortMatchesByKickoff } from "@/lib/sortMatches"

export interface UpcomingMatch {
  matchSlug: string
  predictionSlug: string
  teamA: string
  teamB: string
  date: string
  utcDate?: string
  group?: string
  stage: string
  stadium: string
  city: string
  syncedStatus?: string
}

export function getUpcomingMatches(): UpcomingMatch[] {
  const synced = loadSyncedMatches()
  const now = Date.now()

  const groupStage = matches.filter(m => m.stage === "Group Stage" && m.predictionSlug)

  const enriched = groupStage.map(m => {
    const sm = synced.find(s =>
      (s.teamA === m.teamA || s.teamASlug === m.teamA) &&
      (s.teamB === m.teamB || s.teamBSlug === m.teamB)
    )
    const kickoff = sm?.utcDate ? new Date(sm.utcDate).getTime() : new Date(m.date + "T23:59:59Z").getTime()
    return {
      matchSlug: m.slug,
      predictionSlug: m.predictionSlug!,
      teamA: m.teamA,
      teamB: m.teamB,
      date: m.date,
      utcDate: sm?.utcDate,
      group: m.group,
      stage: m.stage,
      stadium: m.stadium,
      city: m.city,
      syncedStatus: sm?.status,
      kickoff,
    }
  })

  const upcoming = enriched.filter(m =>
    (!m.syncedStatus || m.syncedStatus === "scheduled") && m.kickoff > now
  )

  return sortMatchesByKickoff(upcoming).map(({ kickoff, ...rest }) => rest)
}

export function getRecentFinishedMatches(limit = 10): UpcomingMatch[] {
  const synced = loadSyncedMatches()
  const groupStage = matches.filter(m => m.stage === "Group Stage" && m.predictionSlug)

  const finished = groupStage
    .map(m => {
      const sm = synced.find(s =>
        (s.teamA === m.teamA || s.teamASlug === m.teamA) &&
        (s.teamB === m.teamB || s.teamBSlug === m.teamB)
      )
      return {
        matchSlug: m.slug,
        predictionSlug: m.predictionSlug!,
        teamA: m.teamA,
        teamB: m.teamB,
        date: m.date,
        utcDate: sm?.utcDate,
        group: m.group,
        stage: m.stage,
        stadium: m.stadium,
        city: m.city,
        syncedStatus: sm?.status,
      }
    })
    .filter(m => m.syncedStatus === "finished")

  return sortMatchesByKickoff(finished).reverse().slice(0, limit)
}
