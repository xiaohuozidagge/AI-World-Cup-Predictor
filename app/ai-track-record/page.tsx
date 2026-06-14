import type { Metadata } from "next"
import Link from "next/link"
import { Trophy, Target, TrendingUp, Percent, Calendar, ChevronRight, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPredictionStats } from "@/lib/predictionStats"
import { accuracyEmoji } from "@/lib/predictionAccuracy"

export const metadata: Metadata = {
  title: "AI Prediction Track Record — World Cup 2026 Prediction Accuracy",
  description: "Track the historical accuracy of AI World Cup predictions, including correct winners, exact score predictions, and overall performance throughout the tournament.",
  openGraph: {
    title: "AI Prediction Track Record — World Cup 2026",
    description: "See how our AI predictions have performed: correct winners, exact scores, and overall accuracy.",
  },
  alternates: { canonical: "/ai-track-record" },
}

export default function TrackRecordPage() {
  const stats = getPredictionStats()
  const recent = stats.results.slice(-20).reverse()

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">AI Prediction Track Record</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          See how our World Cup AI predictions have performed throughout the tournament. Every finished match is tracked transparently — wins, exact scores, and misses.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Card>
          <CardContent className="p-5 text-center">
            <Target className="h-6 w-6 text-sports-green mx-auto mb-2" />
            <div className="text-3xl font-extrabold">{stats.totalPredictions}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Predictions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <Trophy className="h-6 w-6 text-sports-gold mx-auto mb-2" />
            <div className="text-3xl font-extrabold">{stats.correctWinners}</div>
            <div className="text-xs text-muted-foreground mt-1">Correct Winners</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <Target className="h-6 w-6 text-sports-blue mx-auto mb-2" />
            <div className="text-3xl font-extrabold">{stats.exactScores}</div>
            <div className="text-xs text-muted-foreground mt-1">Exact Scores</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <Percent className="h-6 w-6 text-sports-green mx-auto mb-2" />
            <div className="text-3xl font-extrabold">{stats.accuracy}%</div>
            <div className="text-xs text-muted-foreground mt-1">Accuracy</div>
          </CardContent>
        </Card>
      </div>

      {/* Accuracy formula */}
      {stats.totalPredictions > 0 && (
        <div className="text-center text-sm text-muted-foreground mb-10">
          {stats.correctWinners} correct winners / {stats.totalPredictions} predictions = {stats.accuracy}% accuracy
        </div>
      )}

      {/* No data state */}
      {stats.totalPredictions === 0 && (
        <Card className="mb-10">
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No finished matches yet.</p>
            <p className="text-sm text-muted-foreground mt-2">Predictions are tracked once matches are completed. Check back after June 11, 2026!</p>
          </CardContent>
        </Card>
      )}

      {/* Recent Results Table */}
      {recent.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4">Recent Prediction Results</h2>
          <div className="space-y-2 mb-10">
            {recent.map((r, i) => (
              <Link key={i} href={`/match/${r.matchSlug}`}>
                <Card className="group hover:shadow-md hover:border-sports-green/50 transition-all cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="sm:w-28 flex-shrink-0 text-xs text-muted-foreground">
                        {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-sm font-medium">{r.teamA}</span>
                        <span className="text-xs text-muted-foreground">vs</span>
                        <span className="text-sm font-medium">{r.teamB}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">Predicted</div>
                          <div className="font-mono font-bold">{r.predictedScore}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">Actual</div>
                          <div className="font-mono font-bold">{r.actualScore.teamA}-{r.actualScore.teamB}</div>
                        </div>
                        <Badge className={
                          r.accuracy === "Exact score correct" ? "bg-sports-green text-white" :
                          r.accuracy === "Correct winner" || r.accuracy === "Correct draw" ? "bg-sports-blue text-white" :
                          "bg-red-500 text-white"
                        }>
                          {accuracyEmoji(r.accuracy)} {r.accuracy}
                        </Badge>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-sports-green transition-colors hidden sm:block flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/predictions" className="text-sports-green hover:underline">Match Predictions →</Link>
        <Link href="/how-we-predict" className="text-sports-green hover:underline">How We Predict →</Link>
      </div>
    </div>
  )
}
