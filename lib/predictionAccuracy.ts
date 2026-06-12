export type AccuracyResult =
  | "Exact score correct"
  | "Correct winner"
  | "Correct draw"
  | "Incorrect prediction"

export function getPredictionAccuracy(
  predictedScore: string,
  actualScore: { teamA: number; teamB: number }
): AccuracyResult {
  const [predA, predB] = predictedScore.split("-").map(Number)
  const actualA = actualScore.teamA
  const actualB = actualScore.teamB

  if (isNaN(predA) || isNaN(predB)) return "Incorrect prediction"

  // Exact score
  if (predA === actualA && predB === actualB) return "Exact score correct"

  // Correct draw
  if (predA === predB && actualA === actualB) return "Correct draw"

  // Correct winner
  const predWinner = predA > predB ? "A" : predB > predA ? "B" : "draw"
  const actualWinner = actualA > actualB ? "A" : actualB > actualA ? "B" : "draw"
  if (predWinner === actualWinner && predWinner !== "draw") return "Correct winner"

  return "Incorrect prediction"
}

export function accuracyEmoji(accuracy: AccuracyResult): string {
  switch (accuracy) {
    case "Exact score correct": return "🎯"
    case "Correct winner": return "✅"
    case "Correct draw": return "🤝"
    case "Incorrect prediction": return "❌"
  }
}

export function accuracyColor(accuracy: AccuracyResult): string {
  switch (accuracy) {
    case "Exact score correct": return "text-sports-green"
    case "Correct winner": return "text-sports-blue"
    case "Correct draw": return "text-sports-gold"
    case "Incorrect prediction": return "text-red-500"
  }
}
