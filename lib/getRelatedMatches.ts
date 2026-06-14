import { matches } from "@/data/matches"
import { loadSyncedMatches } from "@/lib/synced-data"

interface RelatedCandidate {
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
}

export function getRelatedMatches(currentSlug: string, count = 4): RelatedCandidate[] {
  const current = matches.find(m => m.predictionSlug === currentSlug)
  if (!current) return []

  const synced = loadSyncedMatches()
  const candidates = matches
    .filter(m => m.predictionSlug && m.predictionSlug !== currentSlug && m.stage === "Group Stage")
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
      }
    })

  // Score: same group = +100, upcoming = +50, finished = -50
  const scored = candidates.map(c => {
    let score = 0
    if (c.group === current.group) score += 100
    const isFinished = synced.find(s =>
      (s.teamA === c.teamA || s.teamASlug === c.teamA) &&
      (s.teamB === c.teamB || s.teamBSlug === c.teamB)
    )?.status === "finished"
    if (!isFinished) score += 50
    else score -= 50
    return { ...c, score }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, count)
}
