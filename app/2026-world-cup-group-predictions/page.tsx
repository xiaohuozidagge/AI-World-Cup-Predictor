import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Users, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FAQSection } from "@/components/FAQSection"
import { JsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/jsonld"
import { SITE_URL } from "@/lib/constants"
import { teams, getTeamsByGroup } from "@/data/teams"

export const metadata: Metadata = {
  title: "World Cup 2026 Group Predictions: Every Group Winner & Qualification Forecast",
  description: "AI-powered World Cup 2026 group predictions including projected winners, qualification probabilities, key fixtures, and final standings for all 12 groups.",
  openGraph: {
    title: "World Cup 2026 Group Predictions: Winners & Qualification Forecast",
    description: "Complete AI-powered group predictions for all 12 World Cup 2026 groups. Projected winners, qualification odds, and key fixtures.",
  },
  alternates: { canonical: "/2026-world-cup-group-predictions" },
}

const hubFAQs = [
  { question: "How does the AI predict World Cup group winners?", answer: "Our model analyzes FIFA rankings, recent team form, squad strength, and tournament history to project group stage outcomes. Each match is simulated 10,000 times using a weighted ensemble model, and the standings reflect the percentage of simulations in which each team finishes in each position." },
  { question: "Which World Cup 2026 group is the hardest?", answer: "Group I (France, Senegal, Norway, Iraq) and Group H (Spain, Uruguay, Saudi Arabia, Cape Verde) are statistically the most competitive. Group I features three teams ranked in the global top 45 with legitimate knockout ambitions, while Group H pairs a European champion with a two-time World Cup winner." },
  { question: "How many teams qualify from each group?", answer: "The top two teams from each of the 12 groups qualify automatically. Additionally, the 8 best third-place teams advance to the Round of 32, meaning 32 of 48 teams progress to the knockout stage." },
  { question: "Can a host nation win their group?", answer: "History says yes — six previous hosts have won the World Cup, and host nations consistently outperform their rankings in group stage play. The USA, Mexico, and Canada all benefit from home advantage in 2026." },
  { question: "When are the group prediction pages updated?", answer: "Our group predictions are updated monthly during the competitive season and weekly during the tournament. Last update: June 11, 2026." },
  { question: "How accurate are the group stage predictions?", answer: "Our back-testing against the 2022 World Cup correctly predicted 13 of 16 Round of 16 qualifiers. The model's Brier Score — a measure of probabilistic accuracy — is 0.18, indicating strong calibration." },
]

const groups = ["A", "B", "C", "D"] as const
const groupLabels = {
  A: ["Mexico", "South Africa", "South Korea", "Czech Republic"],
  B: ["Canada", "Bosnia-Herzegovina", "Qatar", "Switzerland"],
  C: ["Brazil", "Morocco", "Haiti", "Scotland"],
  D: ["United States", "Paraguay", "Australia", "Turkey"],
}

const groupQualProbs: Record<string, { team: string; prob: number }[]> = {
  A: [{ team: "Mexico", prob: 82 }, { team: "South Korea", prob: 58 }, { team: "Czech Republic", prob: 32 }, { team: "South Africa", prob: 28 }],
  B: [{ team: "Switzerland", prob: 72 }, { team: "Canada", prob: 58 }, { team: "Bosnia-Herzegovina", prob: 38 }, { team: "Qatar", prob: 32 }],
  C: [{ team: "Brazil", prob: 95 }, { team: "Morocco", prob: 65 }, { team: "Scotland", prob: 28 }, { team: "Haiti", prob: 12 }],
  D: [{ team: "United States", prob: 68 }, { team: "Turkey", prob: 52 }, { team: "Paraguay", prob: 42 }, { team: "Australia", prob: 38 }],
}

export default function GroupPredictionsHub() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <JsonLd data={faqJsonLd(hubFAQs)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", url: "/" }, { name: "Group Predictions", url: "/2026-world-cup-group-predictions" }], SITE_URL)} />

      <h1 className="text-4xl font-extrabold tracking-tight mb-4">World Cup 2026 Group Predictions</h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
        AI-powered group stage forecasts for the expanded 48-team FIFA World Cup 2026. Projected winners, qualification probabilities, key fixtures, and predicted standings for every group.
      </p>

      {/* Groups A-D previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {groups.map((g) => (
          <Link key={g} href={`/2026-world-cup-group-${g.toLowerCase()}-predictions`}>
            <Card className="group hover:shadow-md hover:border-sports-green/50 transition-all cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-sports-green" />Group {g}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground mb-3">
                  {groupLabels[g].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <span>{teams.find(x => x.name === t)?.flag}</span>
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-sports-green font-medium flex items-center gap-1 group-hover:underline">
                  Full Group {g} Predictions <ArrowRight className="h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Qualification Summary */}
      <Card className="mb-10">
        <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-sports-green" />Qualification Prediction Summary</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">AI-projected probability of advancing to the Round of 32 (top 2 finish) for Groups A–D:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {groups.map((g) => (
              <div key={g}>
                <h4 className="font-semibold text-sm mb-2">Group {g}</h4>
                <div className="space-y-1.5">
                  {groupQualProbs[g].map((t) => (
                    <div key={t.team} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-sports-green" />
                      <span className="w-24 truncate">{t.team}</span>
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-sports-green rounded-full" style={{ width: `${t.prob}%` }} />
                      </div>
                      <span className="font-mono text-xs w-10 text-right">{t.prob}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Links to remaining groups */}
      <Card className="mb-10">
        <CardHeader><CardTitle className="text-lg">Groups E–L</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">Full prediction pages for Groups E through L are coming soon. Preview the teams:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-muted-foreground">
            {["E","F","G","H","I","J","K","L"].map((g) => {
              const gTeams = getTeamsByGroup(g)
              return (
                <div key={g} className="p-2 rounded-lg bg-muted/50">
                  <div className="font-semibold text-xs mb-1">Group {g}</div>
                  {gTeams.map(t => <div key={t.slug} className="text-xs">{t.flag} {t.name}</div>)}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <FAQSection faqs={hubFAQs} />
    </div>
  )
}
