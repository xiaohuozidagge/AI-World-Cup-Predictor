import type { Metadata } from "next"
import { BarChart3, Brain, Database, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Prediction Methodology — How Our AI Model Works",
  description: "Learn how AI World Cup Predictions generates match forecasts. Our methodology covers data sources, model architecture, probability calculation, and accuracy tracking.",
  openGraph: {
    title: "Prediction Methodology — AI World Cup Predictions 2026",
    description: "Transparent explanation of our AI prediction methodology: data sources, model factors, probability calculation, and accuracy measurement.",
  },
}

export default function MethodologyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">Prediction Methodology</h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
        A transparent explanation of how our AI model generates match predictions, calculates win probabilities, and continuously improves its accuracy.
      </p>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-sports-green" />
              Data Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>Our prediction model draws from multiple authoritative data sources:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>FIFA Official Rankings</strong> — Updated monthly, used as the baseline for team strength comparison.</li>
              <li><strong>Recent Match Results</strong> — Last 20 international fixtures per team, weighted by recency (more recent matches carry higher weight).</li>
              <li><strong>Tournament History</strong> — Historical World Cup performance data from 1930 to 2022, including knockout round progression patterns.</li>
              <li><strong>Squad Composition</strong> — Player availability, club performance levels (Champions League, top-5 European leagues), and injury reports.</li>
              <li><strong>Head-to-Head Records</strong> — Historical results between specific matchups, weighted by relevance (competitive matches valued higher than friendlies).</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-sports-blue" />
              Model Factors & Weighting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>Our ensemble model combines five weighted factors to produce a composite prediction:</p>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Squad Strength & Player Availability</span>
                  <span>30%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-sports-green rounded-full" style={{ width: "30%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Recent Team Form (last 10 matches)</span>
                  <span>25%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-sports-blue rounded-full" style={{ width: "25%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>FIFA Ranking Differential</span>
                  <span>20%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-sports-green rounded-full" style={{ width: "20%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Head-to-Head History</span>
                  <span>15%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-sports-gold rounded-full" style={{ width: "15%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Tournament Context (stage, venue, rest days)</span>
                  <span>10%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-muted-foreground rounded-full" style={{ width: "10%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-sports-green" />
              How Win Probabilities Are Calculated
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>For each match, our ensemble model runs 10,000 simulated outcomes using a Monte Carlo approach. Each simulation accounts for:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Scoring rate estimation</strong> — Based on each team&apos;s expected goals (xG) for and against in recent matches against opposition of similar quality.</li>
              <li><strong>Match state dynamics</strong> — How each team performs when leading, trailing, or level, based on historical data.</li>
              <li><strong>Knockout adjustments</strong> — Extra time and penalty shootout probabilities for elimination matches beyond the group stage.</li>
              <li><strong>Home advantage</strong> — Adjusted for host nations USA, Mexico, and Canada, plus proximity-based crowd support for other CONCACAF nations.</li>
            </ul>
            <p>The win probability you see on each match page is the percentage of those 10,000 simulations in which the named team advanced (or won, for group stage matches).</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-sports-blue" />
              Accuracy & Continuous Improvement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>We track prediction accuracy against actual match results. Our model is calibrated using:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Back-testing</strong> — Retrospective predictions against known tournament results (2018 and 2022 World Cups, 2021 and 2024 Euros, 2024 Copa America).</li>
              <li><strong>Brier Score</strong> — A proper scoring rule that measures the accuracy of probabilistic predictions. Lower scores indicate better calibration.</li>
              <li><strong>Ranked Probability Score (RPS)</strong> — Evaluates how well our win/draw/loss probability distributions matched actual outcomes.</li>
            </ul>
            <p className="mt-3"><strong>Last model update:</strong> June 9, 2026. We review and recalibrate model weights monthly during the competitive season and weekly during the tournament.</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 p-6 bg-muted/50 rounded-xl text-sm text-muted-foreground">
        <p className="font-semibold mb-2">Important Disclaimer</p>
        <p>All predictions are generated for informational and entertainment purposes only. Football is inherently unpredictable — that&apos;s what makes it the world&apos;s most popular sport. Our model provides data-driven estimates, not guarantees. Past performance does not predict future results. Please enjoy responsibly.</p>
      </div>
    </div>
  )
}
