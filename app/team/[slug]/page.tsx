import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Trophy, Star, Users, TrendingUp, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MatchCard } from "@/components/MatchCard"
import { FAQSection } from "@/components/FAQSection"
import { JsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/jsonld"
import { SITE_URL } from "@/lib/constants"
import { teams, getTeamBySlug, getTeamsByGroup } from "@/data/teams"
import { getMatchesByTeam } from "@/data/matches"
import { predictions } from "@/data/predictions"

export async function generateStaticParams() {
  return teams.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const team = getTeamBySlug(slug)
  if (!team) return { title: "Team Not Found" }

  const title = `${team.name} World Cup 2026 — Team Profile & Predictions`
  const description = `${team.name} World Cup 2026 team profile. FIFA ranking #${team.fifaRanking}, coach ${team.coach}, key players: ${team.keyPlayers.slice(0, 3).join(", ")}. AI predictions and match analysis.`

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
    alternates: { canonical: `/team/${slug}` },
  }
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const team = getTeamBySlug(slug)
  if (!team) notFound()

  const teamMatches = getMatchesByTeam(team.name)

  const teamFAQs = [
    { question: `Can ${team.name} win the World Cup 2026?`, answer: `${team.worldCupTitles > 0 ? `${team.name} has won the FIFA World Cup ${team.worldCupTitles} time(s) — ${team.bestResult}.` : `${team.name} has never won the World Cup, with a best finish of ${team.bestResult}.`} ${team.description}` },
    { question: `Who are ${team.name}'s key players for World Cup 2026?`, answer: `${team.keyPlayers.join(", ")} form the core of ${team.name}'s squad. ${team.keyPlayers[0]} is the standout talent and will be central to ${team.name}'s chances of progressing from Group ${team.group}.` },
    { question: `What is ${team.name}'s FIFA ranking and World Cup record?`, answer: `${team.name} is ranked #${team.fifaRanking} in the latest FIFA World Rankings. Their best World Cup performance is ${team.bestResult}. They are coached by ${team.coach}, who has implemented a distinctive tactical approach.` },
    { question: `What group is ${team.name} in for World Cup 2026?`, answer: `${team.name} has been drawn in Group ${team.group} for the 2026 FIFA World Cup. The group stage will be crucial — ${team.name} will need to navigate their fixtures carefully to advance to the knockout rounds.` },
    { question: `How far can ${team.name} go in World Cup 2026?`, answer: `Based on our AI analysis, ${team.name}'s tournament trajectory depends heavily on their group stage performance and potential knockout bracket. With a FIFA ranking of #${team.fifaRanking} and the tactical guidance of ${team.coach}, ${team.name} has the quality to ${team.fifaRanking <= 10 ? "compete for the latter stages of the tournament" : team.fifaRanking <= 20 ? "reach the knockout rounds and potentially cause an upset" : "be a dangerous opponent that could surprise higher-ranked teams"}.` },
  ]

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* JSON-LD */}
      <JsonLd data={faqJsonLd(teamFAQs)} />
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "Teams", url: "/teams" },
        { name: team.name, url: `/team/${slug}` },
      ], SITE_URL)} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-sports-green">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/teams" className="hover:text-sports-green">Teams</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">{team.name}</span>
      </nav>

      {/* Team Header */}
      <div className="flex flex-col sm:flex-row items-start gap-6 mb-10">
        <div className="text-6xl">{team.flag}</div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{team.name}</h1>
            {team.worldCupTitles > 0 && (
              <Badge variant="warning">
                <Trophy className="h-3 w-3 mr-1" /> {team.worldCupTitles}x Champion
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mb-4">{team.description}</p>
          <div className="flex flex-wrap gap-4">
            <Badge variant="secondary">Group {team.group}</Badge>
            <Badge variant="info">#{team.fifaRanking} FIFA</Badge>
            <Badge variant="outline">Coach: {team.coach}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Key players */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-sports-gold" />
                Key Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {team.keyPlayers.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                    <Star className="h-4 w-4 text-sports-gold flex-shrink-0" />
                    <span className="text-sm font-medium">{p}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="h-5 w-5 text-sports-gold mx-auto mb-1" />
                <div className="text-2xl font-bold">{team.worldCupTitles}</div>
                <div className="text-xs text-muted-foreground">World Cup Titles</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-5 w-5 text-sports-green mx-auto mb-1" />
                <div className="text-2xl font-bold">#{team.fifaRanking}</div>
                <div className="text-xs text-muted-foreground">FIFA Ranking</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-5 w-5 text-sports-blue mx-auto mb-1" />
                <div className="text-2xl font-bold">G{team.group}</div>
                <div className="text-xs text-muted-foreground">Group</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-5 w-5 text-sports-green mx-auto mb-1" />
                <div className="text-xs font-medium">{team.bestResult}</div>
                <div className="text-xs text-muted-foreground">Best Result</div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ */}
          <FAQSection faqs={teamFAQs} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Team Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Coach:</span>{" "}
                <span className="font-medium">{team.coach}</span>
              </div>
              <div>
                <span className="text-muted-foreground">FIFA Ranking:</span>{" "}
                <span className="font-medium">#{team.fifaRanking}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Group:</span>{" "}
                <span className="font-medium">Group {team.group}</span>
              </div>
              <div>
                <span className="text-muted-foreground">World Cup Titles:</span>{" "}
                <span className="font-medium">{team.worldCupTitles}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Best Result:</span>{" "}
                <span className="font-medium">{team.bestResult}</span>
              </div>
            </CardContent>
          </Card>

          {/* Group Rivals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Group {team.group} Rivals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {getTeamsByGroup(team.group).filter(t => t.slug !== team.slug).map((rival) => (
                <Link key={rival.slug} href={`/team/${rival.slug}`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                  <span className="text-lg">{rival.flag}</span>
                  <div>
                    <div className="text-sm font-medium">{rival.name}</div>
                    <div className="text-xs text-muted-foreground">#{rival.fifaRanking} FIFA</div>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Quick links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/predictions" className="block text-sm text-muted-foreground hover:text-sports-green">All Predictions</Link>
              <Link href="/winner-predictions" className="block text-sm text-muted-foreground hover:text-sports-green">Winner Predictions</Link>
              <Link href="/schedule" className="block text-sm text-muted-foreground hover:text-sports-green">Schedule</Link>
              <Link href={`/teams`} className="block text-sm text-muted-foreground hover:text-sports-green">All Teams</Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upcoming Matches */}
      {teamMatches.length > 0 && (
        <section className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6">
            {team.name} Matches
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMatches.map((match) => {
              const pred = predictions.find(p => p.matchSlug === match.predictionSlug)
              const ta = teams.find(t => t.name === match.teamA)
              const tb = teams.find(t => t.name === match.teamB)
              return (
                <MatchCard
                  key={match.slug}
                  matchSlug={match.slug}
                  predictionSlug={match.predictionSlug}
                  teamA={match.teamA}
                  teamB={match.teamB}
                  date={match.date}
                  stadium={match.stadium}
                  stage={match.stage}
                  teamAFlag={ta?.flag}
                  teamBFlag={tb?.flag}
                  teamAProb={pred?.teamAWinProbability}
                  drawProb={pred?.drawProbability}
                  teamBProb={pred?.teamBWinProbability}
                  predictedScore={pred?.predictedScore}
                />
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
