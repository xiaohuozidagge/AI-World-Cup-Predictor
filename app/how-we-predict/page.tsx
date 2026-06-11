import type { Metadata } from "next"
import Link from "next/link"
import { BarChart3, Brain, Database, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "How We Predict — AI World Cup 2026 Methodology",
  description: "How our AI prediction model works: data sources, ensemble algorithm, probability calculation, and accuracy tracking for World Cup 2026 match predictions.",
  openGraph: {
    title: "How We Predict — AI World Cup 2026 Methodology",
    description: "Transparent methodology behind our World Cup 2026 AI predictions.",
  },
}

export default function HowWePredictPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">How We Predict</h1>
      <p className="text-lg text-muted-foreground mb-10">
        Every prediction on this site is grounded in data, not guesswork. We built our prediction engine to be transparent — here is exactly how it works.
      </p>

      <div className="space-y-8">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Database className="h-5 w-5 text-sports-green" />What Data We Use</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>FIFA Official Rankings</strong> — the baseline for team strength comparison, updated monthly.</li>
              <li><strong>Recent Match Results</strong> — last 20 international fixtures per team, weighted by recency.</li>
              <li><strong>Tournament History</strong> — World Cup data from 1930 to 2022, including knockout progression patterns.</li>
              <li><strong>Squad Composition</strong> — player club performance levels, injury reports, and availability.</li>
              <li><strong>Head-to-Head Records</strong> — historical match results weighted by competitive importance.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-sports-blue" />The Model</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Our ensemble model combines five weighted factors:</p>
            <div className="space-y-1.5">
              {[{label:"Squad Strength & Player Availability", pct:30, color:"bg-sports-green"},{label:"Recent Team Form (last 10 matches)", pct:25, color:"bg-sports-blue"},{label:"FIFA Ranking Differential", pct:20, color:"bg-sports-green"},{label:"Head-to-Head History", pct:15, color:"bg-sports-gold"},{label:"Tournament Context (stage, venue)", pct:10, color:"bg-muted-foreground"}].map(f => (
                <div key={f.label}>
                  <div className="flex justify-between text-xs mb-0.5"><span>{f.label}</span><span>{f.pct}%</span></div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className={`h-full ${f.color} rounded-full`} style={{width:`${f.pct}%`}}/></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-sports-green" />How Probabilities Work</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>For each match, we run <strong>10,000 simulated outcomes</strong> using a Monte Carlo approach. The win/draw/loss percentages you see are the proportion of those simulations in which each result occurred.</p>
            <p>Our accuracy is tracked using the <strong>Brier Score</strong> (a proper scoring rule for probabilistic predictions) and back-tested against 2018, 2022 World Cup and Euro 2020, 2024 results.</p>
            <p className="text-xs">Last model calibration: June 9, 2026.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-sports-gold" />Important Disclaimer</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>All predictions on this website are for <strong>informational and entertainment purposes only</strong>. Football is inherently unpredictable — that is what makes it the most popular sport in the world.</p>
            <p>We are not a betting service. We do not accept wagers. Our predictions are data-driven estimates, not guarantees. Past performance does not predict future results.</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-sm text-muted-foreground">
        <Link href="/methodology" className="text-sports-green hover:underline font-medium">Detailed technical methodology →</Link>
      </div>
    </div>
  )
}
