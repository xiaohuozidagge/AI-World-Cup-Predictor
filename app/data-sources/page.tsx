import type { Metadata } from "next"
import Link from "next/link"
import { Database, Globe, RefreshCw, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Data Sources — AI World Cup Predictions 2026",
  description: "Data sources used by AI World Cup Predictions: FIFA rankings, match results, squad data, and tournament history for World Cup 2026 analysis.",
  openGraph: {
    title: "Data Sources — AI World Cup Predictions 2026",
    description: "The data powering our World Cup 2026 predictions.",
  },
}

export default function DataSourcesPage() {
  const sources = [
    { icon: Globe, title: "FIFA Official Rankings & Tournament Data", desc: "Team rankings, historical World Cup results, and official tournament statistics from FIFA's public database. Updated monthly during the competitive season." },
    { icon: Database, title: "Match Result Databases", desc: "Recent international fixture results (last 20 matches per team) sourced from publicly available football data aggregators. Covers all FIFA-recognized international matches." },
    { icon: RefreshCw, title: "Squad & Player Data", desc: "Player availability, club performance levels, and injury reports aggregated from publicly available football databases, official federation announcements, and major sports news outlets." },
    { icon: Shield, title: "Model Calibration Data", desc: "Back-testing uses results from 2018 and 2022 FIFA World Cups, UEFA Euro 2020 and 2024, and 2024 Copa America. All match results are publicly available historical data." },
  ]

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">Data Sources</h1>
      <p className="text-lg text-muted-foreground mb-10">
        Transparency is a core principle. Every prediction on this site draws from publicly available football data. Here is exactly where our data comes from.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {sources.map((s) => (
          <Card key={s.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <s.icon className="h-5 w-5 text-sports-green flex-shrink-0" />
                {s.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="border-t pt-8 space-y-4 text-sm text-muted-foreground">
        <h3 className="font-semibold text-foreground">Update Frequency</h3>
        <p>Team data, player availability, and FIFA rankings are reviewed and updated monthly during the international competitive season. During the World Cup tournament (June 11 – July 19, 2026), data is reviewed and updated daily to reflect match results, injuries, and squad changes.</p>

        <h3 className="font-semibold text-foreground mt-4">Data Limitations</h3>
        <p>All data is sourced from publicly available information. We do not have access to non-public scouting data, internal federation reports, or proprietary analytics. Our predictions should be understood as data-driven estimates based on publicly available information, not as insider knowledge.</p>

        <div className="mt-6 space-x-4">
          <Link href="/how-we-predict" className="text-sports-green hover:underline font-medium">How we predict →</Link>
          <Link href="/methodology" className="text-sports-green hover:underline font-medium">Full methodology →</Link>
        </div>
      </div>
    </div>
  )
}
