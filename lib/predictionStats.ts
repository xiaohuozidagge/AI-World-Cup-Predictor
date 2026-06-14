import { loadSyncedMatches } from "@/lib/synced-data"
import { predictions } from "@/data/predictions"
import { generatePrediction } from "@/lib/prediction-engine"
import { teams } from "@/data/teams"
import { getPredictionAccuracy, type AccuracyResult } from "@/lib/predictionAccuracy"

export interface PredictionResult {
  date: string
  matchSlug: string
  teamA: string
  teamB: string
  predictedScore: string
  actualScore: { teamA: number; teamB: number }
  accuracy: AccuracyResult
  utcDate?: string
}

export interface PredictionStats {
  totalPredictions: number
  correctWinners: number
  exactScores: number
  accuracy: number
  results: PredictionResult[]
}

export function getPredictionStats(): PredictionStats {
  const synced = loadSyncedMatches()
  const finished = synced.filter(m => m.status === "finished" && m.actualScore && m.teamASlug && m.teamBSlug)

  const results: PredictionResult[] = []

  for (const m of finished) {
    // Find or generate the predicted score
    const predSlug = `${m.teamASlug}-vs-${m.teamBSlug}-prediction`
    const pred = predictions.find(p => p.matchSlug === predSlug)
    let predictedScore: string | undefined

    if (pred) {
      predictedScore = pred.predictedScore
    } else {
      const teamAData = teams.find(t => t.slug === m.teamASlug)
      const teamBData = teams.find(t => t.slug === m.teamBSlug)
      if (teamAData && teamBData) {
        const gen = generatePrediction(
          m.teamA, m.teamB,
          teamAData.fifaRanking, teamBData.fifaRanking,
          m.stage, m.group || "", m.date, m.stadium || "", "",
          teamAData.keyPlayers, teamBData.keyPlayers
        )
        predictedScore = gen.predictedScore
      }
    }

    if (predictedScore && m.actualScore) {
      const [pa, pb] = predictedScore.split("-").map(Number)
      if (!isNaN(pa) && !isNaN(pb)) {
        const accuracy = getPredictionAccuracy(predictedScore, m.actualScore)
        results.push({
          date: m.date,
          matchSlug: predSlug,
          teamA: m.teamA,
          teamB: m.teamB,
          predictedScore,
          actualScore: m.actualScore,
          accuracy,
          utcDate: m.utcDate,
        })
      }
    }
  }

  const total = results.length
  const exactScores = results.filter(r => r.accuracy === "Exact score correct").length
  const correctWinners = results.filter(r =>
    r.accuracy === "Exact score correct" || r.accuracy === "Correct winner"
  ).length
  const accuracy = total > 0 ? Math.round((correctWinners / total) * 1000) / 10 : 0

  return { totalPredictions: total, correctWinners, exactScores, accuracy, results }
}
