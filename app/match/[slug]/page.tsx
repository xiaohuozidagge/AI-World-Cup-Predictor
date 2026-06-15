import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, Clock, MapPin, Star, TrendingUp, ChevronRight, BarChart3, Shield, Zap, Trophy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProbabilityBar } from "@/components/ProbabilityBar"
import { FAQSection } from "@/components/FAQSection"
import { MatchCard } from "@/components/MatchCard"
import { JsonLd, faqJsonLd, breadcrumbJsonLd, sportsEventJsonLd } from "@/lib/jsonld"
import { matches, getMatchesByTeam } from "@/data/matches"
import { predictions, getPredictionBySlug } from "@/data/predictions"
import { teams, getTeamBySlug, getTeamsByGroup } from "@/data/teams"
import { generatePrediction } from "@/lib/prediction-engine"
import { SITE_URL } from "@/lib/constants"
import { findSyncedMatchBySlug, isMatchFinished, loadSyncedMatches } from "@/lib/synced-data"
import { getPredictionAccuracy, accuracyEmoji, accuracyColor } from "@/lib/predictionAccuracy"
import { PredictionShareModule } from "@/components/PredictionShareModule"
import { getRelatedMatches } from "@/lib/getRelatedMatches"

export async function generateStaticParams() {
  return matches.filter((m) => m.predictionSlug !== undefined).map((m) => ({ slug: m.predictionSlug! }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const prediction = getPredictionBySlug(slug)
  if (!prediction) return { title: "Prediction Not Found" }
  const match = matches.find(m => m.predictionSlug === slug)
  if (!match) return { title: "Prediction Not Found" }
  const title = `${match.teamA} vs ${match.teamB} Prediction — World Cup 2026`
  const description = `AI prediction for ${match.teamA} vs ${match.teamB}. Win probability: ${match.teamA} ${prediction.teamAWinProbability}%, predicted score ${prediction.predictedScore}. Analysis, form, and H2H.`
  return { title, description, openGraph: { title, description, type: "article", publishedTime: "2026-06-09T00:00:00Z", modifiedTime: new Date().toISOString() }, alternates: { canonical: `/match/${slug}` } }
}

export default async function MatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const prediction = getPredictionBySlug(slug)
  const match = matches.find(m => m.predictionSlug === slug)
  if (!match) notFound()
  const teamAData = getTeamBySlug(match.teamA.toLowerCase().replace(/\s+/g, "-")) || teams.find(t => t.name === match.teamA)
  const teamBData = getTeamBySlug(match.teamB.toLowerCase().replace(/\s+/g, "-")) || teams.find(t => t.name === match.teamB)
  const resolvedPrediction = prediction || (teamAData && teamBData
    ? generatePrediction(match.teamA, match.teamB, teamAData.fifaRanking, teamBData.fifaRanking, match.stage, match.group || "", match.date, match.stadium, match.city, teamAData.keyPlayers, teamBData.keyPlayers) : null)
  if (!resolvedPrediction) notFound()

  const synced = findSyncedMatchBySlug(match.slug)
  const isFinished = isMatchFinished(synced)
  const actualScore = synced?.actualScore
  const accuracy = isFinished && actualScore ? getPredictionAccuracy(resolvedPrediction.predictedScore, actualScore) : null
  const relatedMatches = getRelatedMatches(slug, 4)
  const groupTeams = (match.group && match.group.length === 1) ? getTeamsByGroup(match.group) : []
  const groupStandings = loadSyncedMatches().filter(s => s.group === match.group && s.stage === "Group Stage" && s.actualScore)
  const aProb = resolvedPrediction.teamAWinProbability
  const bProb = resolvedPrediction.teamBWinProbability

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* JSON-LD */}
      <JsonLd data={faqJsonLd(resolvedPrediction.faq)} />
      <JsonLd data={breadcrumbJsonLd([{name:"Home",url:"/"},{name:"Predictions",url:"/predictions"},{name:`${match.teamA} vs ${match.teamB}`,url:`/match/${slug}`}], SITE_URL)} />
      <JsonLd data={sportsEventJsonLd({name:`${match.teamA} vs ${match.teamB} — FIFA World Cup 2026`,teamA:match.teamA,teamB:match.teamB,date:match.date,stadium:match.stadium,city:match.city})} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6"><Link href="/" className="hover:text-sports-green">Home</Link><ChevronRight className="h-3 w-3"/><Link href="/predictions" className="hover:text-sports-green">Predictions</Link><ChevronRight className="h-3 w-3"/><span className="text-foreground font-medium">{match.teamA} vs {match.teamB}</span></nav>

      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">{match.stage}{match.group && match.group.length === 1 ? ` · Group ${match.group}` : ""}</Badge>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">{match.teamA} vs {match.teamB} {isFinished ? "Result" : "Prediction"}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4"/> {new Date(match.date).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric",timeZone:"UTC"})}</span>
          {synced?.utcDate && <span className="flex items-center gap-1"><Clock className="h-4 w-4"/> {new Date(synced.utcDate).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:"UTC",hour12:true})} UTC</span>}
          <span className="flex items-center gap-1"><MapPin className="h-4 w-4"/> {match.stadium}, {match.city}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* 1. Match Overview */}
          <Card><CardHeader><CardTitle>Match Overview</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <p>{match.stage === "Group Stage" ? `This Group ${match.group} fixture pairs ${match.teamA} (#${teamAData?.fifaRanking || "?"} FIFA) against ${match.teamB} (#${teamBData?.fifaRanking || "?"} FIFA) at ${match.stadium}. ` : ""}{match.stage === "Group Stage" ? "Both teams are competing for a top-two finish to secure automatic qualification to the Round of 32, with the third-place team potentially advancing as one of the eight best third-place finishers." : match.stage === "Final" ? "The World Cup final — the culmination of a 104-match, 39-day tournament across three host nations. One of these teams will lift the trophy at MetLife Stadium." : `A ${match.stage.toLowerCase()} clash where the stakes couldn't be higher — the loser goes home.`}</p>
            {teamAData && teamBData && <p>{teamAData.name} ({teamAData.fifaRanking <= 20 ? "a top-20 side" : teamAData.fifaRanking <= 40 ? "ranked in the world's top 40" : "an emerging football nation"}) enters with {teamAData.worldCupTitles > 0 ? `${teamAData.worldCupTitles} World Cup title${teamAData.worldCupTitles>1?"s":""} to their name` : "everything to prove on the biggest stage"}. {teamBData.name} ({teamBData.fifaRanking <= 20 ? "a top-20 side" : teamBData.fifaRanking <= 40 ? "ranked in the world's top 40" : "an emerging football nation"}) counters with {teamBData.worldCupTitles > 0 ? `${teamBData.worldCupTitles} World Cup title${teamBData.worldCupTitles>1?"s":""} and a squad built around ` : "a squad built around "}{teamBData.keyPlayers[0]}.</p>}
          </CardContent></Card>

          {/* 2. Prediction Summary */}
          <Card className={isFinished ? "opacity-75" : "border-sports-green/30"}>
            <CardHeader><CardTitle>{isFinished ? "Result & Prediction Review" : "AI Prediction"}</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 text-center"><div className="text-4xl mb-2">{teamAData?.flag || "⚽"}</div><div className="font-bold text-lg">{match.teamA}</div><div className="text-xs text-muted-foreground">#{teamAData?.fifaRanking || "?"} FIFA</div></div>
                <div className="text-center"><div className="text-3xl font-extrabold text-sports-green mb-1">{resolvedPrediction.predictedScore}</div><div className="text-xs text-muted-foreground">Predicted Score</div></div>
                <div className="flex-1 text-center"><div className="text-4xl mb-2">{teamBData?.flag || "⚽"}</div><div className="font-bold text-lg">{match.teamB}</div><div className="text-xs text-muted-foreground">#{teamBData?.fifaRanking || "?"} FIFA</div></div>
              </div>
              {isFinished && actualScore && (<div className="border-t pt-4 mt-4"><div className="text-center mb-3"><span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Final Result</span></div><div className="flex items-center justify-between gap-4"><div className="flex-1 text-center"><span className="text-2xl font-extrabold">{actualScore.teamA}</span></div><div className="text-center"><span className="text-lg font-bold text-muted-foreground">-</span></div><div className="flex-1 text-center"><span className="text-2xl font-extrabold">{actualScore.teamB}</span></div></div>{accuracy && <div className="text-center mt-3"><span className={`text-sm font-semibold ${accuracyColor(accuracy)}`}>{accuracyEmoji(accuracy)} {accuracy}</span><span className="text-xs text-muted-foreground ml-2">Predicted: {resolvedPrediction.predictedScore}</span><div className="mt-2"><Link href="/ai-track-record" className="text-xs text-sports-green hover:underline">View Full AI Record →</Link></div></div>}</div>)}
              <div><h4 className="text-sm font-semibold mb-3">Win Probability</h4><ProbabilityBar a={aProb} draw={resolvedPrediction.drawProbability} b={bProb} size="lg"/></div>
            </CardContent>
          </Card>

          {/* 3. Why AI Predicts This Match */}
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-sports-green"/>Why AI Predicts This Match</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <p>Our ensemble model weighted five factors to generate this prediction:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Squad Strength (30%):</strong> {aProb > bProb ? `${match.teamA} fields a stronger starting XI on paper, with more players at Champions League-level clubs.` : `${match.teamB} brings a deeper, more experienced squad into this fixture.`}</li>
              <li><strong>Recent Form (25%):</strong> {aProb > 55 ? `${match.teamA} has been in excellent form, dominating possession and creating high-quality chances.` : bProb > 55 ? `${match.teamB} enters this match in superior form, with consistent performances in recent fixtures.` : "Both teams' recent form profiles are closely matched, making this a genuinely balanced contest."}</li>
              <li><strong>FIFA Ranking (20%):</strong> The {Math.abs((teamAData?.fifaRanking||50) - (teamBData?.fifaRanking||50))}-place ranking gap {Math.abs((teamAData?.fifaRanking||50) - (teamBData?.fifaRanking||50)) > 20 ? "is significant and historically predictive of outcomes in World Cup matches" : "is narrow enough that ranking alone cannot separate these sides"}.</li>
              <li><strong>Head-to-Head (15%):</strong> Historical results weighted toward competitive matches favor {aProb > bProb ? match.teamA : bProb > aProb ? match.teamB : "neither side decisively"}.</li>
              <li><strong>Tournament Context (10%):</strong> {match.stage === "Group Stage" ? "Group stage positioning and rest-day advantage between fixtures are factored into the model's output." : "Knockout football introduces extra time and penalty considerations that shift the probability distribution."}</li>
            </ul>
          </CardContent></Card>

          {/* 4. Team Analysis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4 text-sports-green"/>{match.teamA} Analysis</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
              {teamAData && <><p><strong>Style:</strong> {teamAData.fifaRanking <= 15 ? "A possession-dominant side that builds patiently through midfield and presses high to win the ball back quickly." : teamAData.fifaRanking <= 30 ? "A tactically balanced team comfortable in both possession and transition, with a well-organized defensive structure." : "A compact, counter-attacking side that defends deep and looks to exploit space behind opposition fullbacks."}</p>
              <p><strong>Form:</strong> {resolvedPrediction.teamForm.teamA}</p>
              <p><strong>Key to victory:</strong> {aProb > 50 ? `Control the tempo through midfield and prevent ${match.teamB}'s counter-attacking opportunities. The first goal will force ${match.teamB} to open up.` : `Disciplined defending and clinical finishing on limited chances. ${match.teamA} must make their set pieces count.`}</p></>}
            </CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4 text-sports-blue"/>{match.teamB} Analysis</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
              {teamBData && <><p><strong>Style:</strong> {teamBData.fifaRanking <= 15 ? "A possession-dominant side that builds patiently through midfield and presses high to win the ball back quickly." : teamBData.fifaRanking <= 30 ? "A tactically balanced team comfortable in both possession and transition, with a well-organized defensive structure." : "A compact, counter-attacking side that defends deep and looks to exploit space behind opposition fullbacks."}</p>
              <p><strong>Form:</strong> {resolvedPrediction.teamForm.teamB}</p>
              <p><strong>Key to victory:</strong> {bProb > 50 ? `Control the tempo through midfield and prevent ${match.teamA}'s counter-attacking opportunities. The first goal will force ${match.teamA} to open up.` : `Disciplined defending and clinical finishing on limited chances. ${match.teamB} must make their set pieces count.`}</p></>}
            </CardContent></Card>
          </div>

          {/* 5. Key Factors */}
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-sports-gold"/>Key Factors</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <div className="space-y-3">
              <div><strong className="text-foreground">1. Midfield Battle</strong><p>Whichever team controls the center of the pitch will dictate the tempo. {aProb > 55 ? `${match.teamA} is expected to dominate possession — ${match.teamB} must disrupt their rhythm through coordinated pressing.` : bProb > 55 ? `${match.teamB} is expected to dominate possession — ${match.teamA} must disrupt their rhythm through coordinated pressing.` : "Both midfields are evenly matched, making this the decisive area of the pitch."}</p></div>
              <div><strong className="text-foreground">2. Set Pieces</strong><p>In tight World Cup matches, set-piece efficiency often proves decisive. {teamAData && teamBData && (teamAData.fifaRanking - teamBData.fifaRanking) > 15 ? `${match.teamB} may look to set pieces as their most reliable route to goal against a superior opponent.` : "Both teams carry aerial threats that could swing the match from a single dead-ball situation."}</p></div>
              <div><strong className="text-foreground">3. First Goal</strong><p>{match.stage !== "Group Stage" ? "In knockout football, the team that scores first wins approximately 70% of the time. An early goal would fundamentally reshape the tactical dynamics of this match." : "The first goal in group-stage matches statistically leads to a win or draw in over 80% of cases. The opening 20 minutes will be critical."}</p></div>
              <div><strong className="text-foreground">4. {match.stage === "Group Stage" ? "Squad Rotation" : "Penalty Shootout Preparation"}</strong><p>{match.stage === "Group Stage" ? "With three group matches in 10-13 days, squad rotation and injury management play a hidden but significant role. Fresh legs in the second half could be decisive." : "At this stage of the tournament, teams have been practicing penalties for weeks. Goalkeeper psychology and takers' composure under pressure become defining variables."}</p></div>
            </div>
          </CardContent></Card>

          {/* 6. Group Situation */}
          {match.group && match.group.length === 1 && groupTeams.length > 0 && (
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-sports-blue"/>Group {match.group} Situation</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
              <p>This match involves two of the four teams in Group {match.group}:</p>
              <div className="flex flex-wrap gap-2 mb-2">{groupTeams.map(t => (<Link key={t.slug} href={`/team/${t.slug}`}><Badge variant="outline" className="cursor-pointer hover:bg-muted">{t.flag} {t.name}</Badge></Link>))}</div>
              <p>The group winner and runner-up advance directly to the Round of 32. The third-place team may qualify as one of the eight best third-place finishers across all 12 groups. With {match.teamA} projected at {aProb}% win probability and {match.teamB} at {bProb}%, {aProb > bProb ? `${match.teamA}'s path to the knockout stage is clearer — but a ${match.teamB} result would blow the group wide open.` : `${match.teamB} enters as favorite, but ${match.teamA} has every incentive to fight for at least a draw to keep their knockout hopes alive.`}</p>
            </CardContent></Card>
          )}

          {/* 7. AI Match Insight */}
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-sports-green"/>AI Match Insight</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <p>{resolvedPrediction.analysis}</p>
            <p className="pt-2 border-t">Across 10,000 match simulations, {aProb > bProb ? `${match.teamA} won ${aProb}% of scenarios` : `${match.teamB} won ${bProb}% of scenarios`}, with a draw occurring in {resolvedPrediction.drawProbability}% of simulations. {resolvedPrediction.drawProbability > 25 ? "The model sees a draw as a very real possibility — this is the most likely alternative outcome." : "The model is relatively confident in a decisive result."}</p>
            {aProb > 60 && <p className="font-medium text-foreground">The model's confidence is driven primarily by the ranking gap and recent form — but the most likely upset scenario involves an early goal for {match.teamB}.</p>}
            {bProb > 60 && <p className="font-medium text-foreground">The model's confidence is driven primarily by the ranking gap and recent form — but the most likely upset scenario involves an early goal for {match.teamA}.</p>}
            {aProb <= 60 && bProb <= 60 && <p className="font-medium text-foreground">This is one of the closer matches in our model's projections — small margins like a set-piece goal or a defensive error are more likely to decide the outcome than systemic quality differences.</p>}
          </CardContent></Card>

          {/* 8. Key Players */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Star className="h-4 w-4 text-sports-gold"/>{match.teamA} Key Players</CardTitle></CardHeader><CardContent><ul className="space-y-1.5">{resolvedPrediction.keyPlayers.teamA.map((p,i)=>(<li key={i} className="text-sm text-muted-foreground flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sports-green"/>{p}</li>))}</ul></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Star className="h-4 w-4 text-sports-gold"/>{match.teamB} Key Players</CardTitle></CardHeader><CardContent><ul className="space-y-1.5">{resolvedPrediction.keyPlayers.teamB.map((p,i)=>(<li key={i} className="text-sm text-muted-foreground flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sports-blue"/>{p}</li>))}</ul></CardContent></Card>
          </div>

          {/* 9. FAQ */}
          <FAQSection faqs={resolvedPrediction.faq} />

          {/* 10. Share */}
          {!isFinished && teamAData && teamBData && (
            <PredictionShareModule teamA={match.teamA} teamB={match.teamB} predictedScore={{teamA:parseInt(resolvedPrediction.predictedScore.split("-")[0])||0,teamB:parseInt(resolvedPrediction.predictedScore.split("-")[1])||0}} probabilities={{teamA:aProb,draw:resolvedPrediction.drawProbability,teamB:bProb}} confidence={Math.abs(aProb-bProb)>25?"High":Math.abs(aProb-bProb)>12?"Medium":"Low"} matchDate={match.date} utcDate={synced?.utcDate} stadium={match.stadium} url={`${SITE_URL}/match/${slug}`}/>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {teamAData && (<Card><CardHeader><CardTitle className="text-base">Team Profiles</CardTitle></CardHeader><CardContent className="space-y-2">
            <Link href={`/team/${teamAData.slug}`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"><span className="text-xl">{teamAData.flag}</span><span className="text-sm font-medium">{teamAData.name}</span><ChevronRight className="h-4 w-4 ml-auto text-muted-foreground"/></Link>
            {teamBData && <Link href={`/team/${teamBData.slug}`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"><span className="text-xl">{teamBData.flag}</span><span className="text-sm font-medium">{teamBData.name}</span><ChevronRight className="h-4 w-4 ml-auto text-muted-foreground"/></Link>}
          </CardContent></Card>)}
          <Card><CardHeader><CardTitle className="text-base">Quick Links</CardTitle></CardHeader><CardContent className="space-y-2">
            <Link href="/winner-predictions" className="block text-sm text-muted-foreground hover:text-sports-green">Winner Predictions</Link>
            <Link href="/schedule" className="block text-sm text-muted-foreground hover:text-sports-green">Full Schedule</Link>
            <Link href="/simulator" className="block text-sm text-muted-foreground hover:text-sports-green">Match Simulator</Link>
            <Link href="/ai-track-record" className="block text-sm text-muted-foreground hover:text-sports-green">AI Track Record</Link>
          </CardContent></Card>
        </div>
      </div>

      {/* Related Predictions */}
      {relatedMatches.length > 0 && (<section className="mt-12 pt-8 border-t"><div className="mb-4"><h2 className="text-2xl font-bold">Related Predictions</h2><p className="text-muted-foreground text-sm mt-1">You may also like these upcoming World Cup matches</p></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{relatedMatches.map(rm=>{const pred=prediction && predictions.find(p=>p.matchSlug===rm.predictionSlug);const ta=teams.find(t=>t.name===rm.teamA);const tb=teams.find(t=>t.name===rm.teamB);const fb=!pred&&ta&&tb?generatePrediction(rm.teamA,rm.teamB,ta.fifaRanking,tb.fifaRanking,rm.stage,rm.group||"",rm.date,rm.stadium,rm.city,ta.keyPlayers,tb.keyPlayers):null;const rp=pred||fb;const t=rm.utcDate?new Date(rm.utcDate).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:"UTC",hour12:true})+" UTC":null;return(<Link key={rm.predictionSlug} href={`/match/${rm.predictionSlug}`}><Card className="group hover:shadow-md hover:border-sports-green/50 transition-all cursor-pointer h-full"><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><span className="text-lg">{ta?.flag}</span><span className="font-medium text-sm">{rm.teamA}</span></div><span className="text-xs text-muted-foreground">vs</span><div className="flex items-center gap-2"><span className="font-medium text-sm">{rm.teamB}</span><span className="text-lg">{tb?.flag}</span></div></div>{rp&&<div className="text-center mb-2"><span className="text-lg font-bold text-sports-green">{rp.predictedScore}</span><span className="text-xs text-muted-foreground ml-2">Predicted</span></div>}<div className="flex items-center justify-between text-[10px] text-muted-foreground">{t&&<span className="flex items-center gap-1"><Clock className="h-3 w-3"/>{t}</span>}<span className="text-xs text-sports-green font-medium group-hover:underline">View Prediction →</span></div></CardContent></Card></Link>)})}</div></section>)}
    </div>
  )
}
