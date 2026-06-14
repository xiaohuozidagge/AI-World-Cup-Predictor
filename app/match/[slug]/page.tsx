import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, Clock, MapPin, Star, TrendingUp, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProbabilityBar } from "@/components/ProbabilityBar"
import { FAQSection } from "@/components/FAQSection"
import { MatchCard } from "@/components/MatchCard"
import { JsonLd, faqJsonLd, breadcrumbJsonLd, sportsEventJsonLd } from "@/lib/jsonld"
import { matches, getMatchesByTeam } from "@/data/matches"
import { predictions, getPredictionBySlug } from "@/data/predictions"
import { teams, getTeamBySlug } from "@/data/teams"
import { generatePrediction } from "@/lib/prediction-engine"
import { SITE_URL } from "@/lib/constants"
import { findSyncedMatchBySlug, isMatchFinished, loadSyncedMatches } from "@/lib/synced-data"
import { getPredictionAccuracy, accuracyEmoji, accuracyColor } from "@/lib/predictionAccuracy"
import { PredictionShareModule } from "@/components/PredictionShareModule"
import { getRelatedMatches } from "@/lib/getRelatedMatches"

export async function generateStaticParams() {
  return matches
    .filter((m) => m.predictionSlug !== undefined)
    .map((m) => ({ slug: m.predictionSlug! }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const prediction = getPredictionBySlug(slug)
  if (!prediction) return { title: "Prediction Not Found" }

  const match = matches.find(m => m.predictionSlug === slug)
  if (!match) return { title: "Prediction Not Found" }

  const title = `${match.teamA} vs ${match.teamB} Prediction — World Cup 2026`
  const description = `AI prediction for ${match.teamA} vs ${match.teamB}. Win probability: ${match.teamA} ${prediction.teamAWinProbability}%, predicted score ${prediction.predictedScore}. Analysis, form, and H2H.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: "2026-06-09T00:00:00Z",
      modifiedTime: new Date().toISOString(),
    },
    alternates: { canonical: `/match/${slug}` },
  }
}

export default async function MatchPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const prediction = getPredictionBySlug(slug)
  const match = matches.find(m => m.predictionSlug === slug)
  if (!match) notFound()

  const teamAData = getTeamBySlug(match.teamA.toLowerCase().replace(/\s+/g, "-")) || teams.find(t => t.name === match.teamA)
  const teamBData = getTeamBySlug(match.teamB.toLowerCase().replace(/\s+/g, "-")) || teams.find(t => t.name === match.teamB)

  const resolvedPrediction = prediction || (teamAData && teamBData
    ? generatePrediction(match.teamA, match.teamB, teamAData.fifaRanking, teamBData.fifaRanking, match.stage, match.group, match.date, match.stadium, match.city, teamAData.keyPlayers, teamBData.keyPlayers)
    : null)
  if (!resolvedPrediction) notFound()

  // Check for synced actual result
  const synced = findSyncedMatchBySlug(match.slug)
  const isFinished = isMatchFinished(synced)
  const actualScore = synced?.actualScore
  const accuracy = isFinished && actualScore
    ? getPredictionAccuracy(resolvedPrediction.predictedScore, actualScore)
    : null

  // Related predictions
  const relatedMatches = getRelatedMatches(slug, 4)

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* JSON-LD */}
      <JsonLd data={faqJsonLd(resolvedPrediction.faq)} />
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "Predictions", url: "/predictions" },
        { name: `${match.teamA} vs ${match.teamB}`, url: `/match/${slug}` },
      ], SITE_URL)} />
      <JsonLd data={sportsEventJsonLd({
        name: `${match.teamA} vs ${match.teamB} — FIFA World Cup 2026`,
        teamA: match.teamA,
        teamB: match.teamB,
        date: match.date,
        stadium: match.stadium,
        city: match.city,
      })} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-sports-green">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/predictions" className="hover:text-sports-green">Predictions</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">{match.teamA} vs {match.teamB}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">{match.stage} · Group {match.group !== "KO" && match.group !== "QF" && match.group !== "SF" && match.group !== "F" ? match.group : ""} {match.group === "KO" ? "Knockout" : match.group === "QF" ? "Quarterfinal" : match.group === "SF" ? "Semifinal" : match.group === "F" ? "Final" : ""}</Badge>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
          {match.teamA} vs {match.teamB} {isFinished ? "Result" : "Prediction"}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(match.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}</span>
          {synced?.utcDate && (
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {new Date(synced.utcDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC", hour12: true })} UTC</span>
          )}
          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {match.stadium}, {match.city}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Score Prediction Card */}
          <Card>
            <CardHeader>
              <CardTitle>AI Prediction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Team matchup */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 text-center">
                  <div className="text-4xl mb-2">{teamAData?.flag || "⚽"}</div>
                  <div className="font-bold text-lg">{match.teamA}</div>
                  <div className="text-xs text-muted-foreground">#{teamAData?.fifaRanking || "?"} FIFA</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-sports-green mb-1">{resolvedPrediction.predictedScore}</div>
                  <div className="text-xs text-muted-foreground">Predicted Score</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-4xl mb-2">{teamBData?.flag || "⚽"}</div>
                  <div className="font-bold text-lg">{match.teamB}</div>
                  <div className="text-xs text-muted-foreground">#{teamBData?.fifaRanking || "?"} FIFA</div>
                </div>
              </div>

              {/* Actual score (finished matches) */}
              {isFinished && actualScore && (
                <div className="border-t pt-4 mt-4">
                  <div className="text-center mb-3">
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Final Result</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 text-center">
                      <span className="text-2xl font-extrabold">{actualScore.teamA}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-lg font-bold text-muted-foreground">-</span>
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-2xl font-extrabold">{actualScore.teamB}</span>
                    </div>
                  </div>
                  {accuracy && (
                    <div className="text-center mt-3">
                      <span className={`text-sm font-semibold ${accuracyColor(accuracy)}`}>
                        {accuracyEmoji(accuracy)} {accuracy}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">Predicted: {resolvedPrediction.predictedScore}</span>
                      <div className="mt-2">
                        <Link href="/ai-track-record" className="text-xs text-sports-green hover:underline">
                          View Full AI Record →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Probability bar */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Win Probability</h4>
                <ProbabilityBar a={resolvedPrediction.teamAWinProbability} draw={resolvedPrediction.drawProbability} b={resolvedPrediction.teamBWinProbability} size="lg" />
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-sports-green" />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{resolvedPrediction.analysis}</p>
            </CardContent>
          </Card>

          {/* Team Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{match.teamA} Form</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{resolvedPrediction.teamForm.teamA}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{match.teamB} Form</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{resolvedPrediction.teamForm.teamB}</p>
              </CardContent>
            </Card>
          </div>

          {/* Key Players */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="h-4 w-4 text-sports-gold" />
                  {match.teamA} Key Players
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {resolvedPrediction.keyPlayers.teamA.map((p, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-sports-green" />
                      {p}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="h-4 w-4 text-sports-gold" />
                  {match.teamB} Key Players
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {resolvedPrediction.keyPlayers.teamB.map((p, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-sports-blue" />
                      {p}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* FAQ */}
          <FAQSection faqs={resolvedPrediction.faq} />

          {/* Share module — only for scheduled matches with known teams */}
          {!isFinished && teamAData && teamBData && (
            <PredictionShareModule
              teamA={match.teamA}
              teamB={match.teamB}
              predictedScore={{
                teamA: parseInt(resolvedPrediction.predictedScore.split("-")[0]) || 0,
                teamB: parseInt(resolvedPrediction.predictedScore.split("-")[1]) || 0,
              }}
              probabilities={{
                teamA: resolvedPrediction.teamAWinProbability,
                draw: resolvedPrediction.drawProbability,
                teamB: resolvedPrediction.teamBWinProbability,
              }}
              confidence={Math.abs(resolvedPrediction.teamAWinProbability - resolvedPrediction.teamBWinProbability) > 25 ? "High" : Math.abs(resolvedPrediction.teamAWinProbability - resolvedPrediction.teamBWinProbability) > 12 ? "Medium" : "Low"}
              matchDate={match.date}
              utcDate={synced?.utcDate}
              stadium={match.stadium}
              url={`${SITE_URL}/match/${slug}`}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Team Profiles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {teamAData && (
                <Link href={`/team/${teamAData.slug}`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                  <span className="text-xl">{teamAData.flag}</span>
                  <span className="text-sm font-medium">{teamAData.name}</span>
                  <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </Link>
              )}
              {teamBData && (
                <Link href={`/team/${teamBData.slug}`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                  <span className="text-xl">{teamBData.flag}</span>
                  <span className="text-sm font-medium">{teamBData.name}</span>
                  <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Quick links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/winner-predictions" className="block text-sm text-muted-foreground hover:text-sports-green transition-colors">Winner Predictions</Link>
              <Link href="/schedule" className="block text-sm text-muted-foreground hover:text-sports-green transition-colors">Full Schedule</Link>
              <Link href="/simulator" className="block text-sm text-muted-foreground hover:text-sports-green transition-colors">Match Simulator</Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-muted/30 rounded-lg text-xs text-muted-foreground text-center">
        <p><strong>Disclaimer:</strong> This prediction is for informational and entertainment purposes only. Football outcomes are inherently unpredictable. Our AI model provides data-driven estimates based on publicly available information — not guarantees. We do not offer betting advice or accept wagers. <a href="/how-we-predict" className="text-sports-green hover:underline">Learn how we predict</a>.</p>
      </div>

      {/* Related Predictions */}
      {relatedMatches.length > 0 && (
        <section className="mt-12 pt-8 border-t">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Related Predictions</h2>
            <p className="text-muted-foreground text-sm mt-1">You may also like these upcoming World Cup matches</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedMatches.map((rm) => {
              const pred = predictions.find(p => p.matchSlug === rm.predictionSlug)
              const ta = teams.find(t => t.name === rm.teamA)
              const tb = teams.find(t => t.name === rm.teamB)
              const fallback = (!pred && ta && tb)
                ? generatePrediction(rm.teamA, rm.teamB, ta.fifaRanking, tb.fifaRanking, rm.stage, rm.group || "", rm.date, rm.stadium, rm.city, ta.keyPlayers, tb.keyPlayers)
                : null
              const resolvedPred = pred || fallback
              const isFinished = loadSyncedMatches().find(s => s.teamASlug === ta?.slug && s.teamBSlug === tb?.slug)?.status === "finished"
              const timeDisplay = rm.utcDate
                ? new Date(rm.utcDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC", hour12: true }) + " UTC"
                : null
              const confidence = resolvedPred
                ? Math.abs(resolvedPred.teamAWinProbability - resolvedPred.teamBWinProbability) > 25 ? "High" : Math.abs(resolvedPred.teamAWinProbability - resolvedPred.teamBWinProbability) > 12 ? "Medium" : "Low"
                : "Medium"

              return (
                <Link key={rm.predictionSlug} href={`/match/${rm.predictionSlug}`}>
                  <Card className="group hover:shadow-md hover:border-sports-green/50 transition-all cursor-pointer h-full">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{ta?.flag}</span>
                          <span className="font-medium text-sm">{rm.teamA}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">vs</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{rm.teamB}</span>
                          <span className="text-lg">{tb?.flag}</span>
                        </div>
                      </div>

                      {resolvedPred && (
                        <div className="text-center mb-2">
                          <span className="text-lg font-bold text-sports-green">{resolvedPred.predictedScore}</span>
                          <span className="text-xs text-muted-foreground ml-2">Predicted</span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground mb-2">
                        {timeDisplay && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{timeDisplay}</span>}
                        <Badge className={`text-[10px] px-1.5 py-0 ${confidence === "High" ? "bg-sports-green text-white" : confidence === "Medium" ? "bg-sports-blue text-white" : "bg-sports-gold text-white"}`}>
                          {confidence} Confidence
                        </Badge>
                        {isFinished && <Badge variant="secondary" className="text-[10px]">Finished</Badge>}
                      </div>

                      <div className="text-xs text-sports-green font-medium group-hover:underline text-right">
                        View Prediction →
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
