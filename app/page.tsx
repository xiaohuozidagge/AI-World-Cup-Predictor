import Link from "next/link"
import { ArrowRight, BarChart3, Brain, Search, Trophy, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MatchCard } from "@/components/MatchCard"
import { TeamCard } from "@/components/TeamCard"
import { FAQSection } from "@/components/FAQSection"
import { getLatestPredictions } from "@/data/predictions"
import { matches } from "@/data/matches"
import { teams } from "@/data/teams"
import { JsonLd, faqJsonLd } from "@/lib/jsonld"

const homeFAQs = [
  { question: "How accurate are the AI World Cup predictions?", answer: "Our AI model analyzes historical match data, current team form, player statistics, FIFA rankings, and head-to-head records. While no prediction is 100% accurate, our model has been calibrated against past tournament results and provides data-driven probability estimates for every match." },
  { question: "Who is predicted to win the 2026 World Cup?", answer: "Argentina enters as the favorite with a 22% championship probability according to our AI model. France, Brazil, and England round out the top contenders. See our full winner predictions page for detailed odds on all 48 teams." },
  { question: "When does the 2026 World Cup start?", answer: "The 2026 FIFA World Cup kicks off on June 11, 2026 with the opening match at Estadio Azteca in Mexico City. The tournament runs through the final on July 19, 2026 at MetLife Stadium in New Jersey." },
  { question: "How are the match predictions generated?", answer: "Our AI model uses a weighted ensemble of factors: recent team form (30%), FIFA ranking differential (15%), head-to-head history (15%), player availability and squad strength (25%), and tournament context/historical performance (15%). Predictions are updated regularly as new data becomes available." },
  { question: "Can I use the simulator to predict any matchup?", answer: "Yes! Our match simulator lets you select any two teams and generates an instant prediction with win probability and predicted score. It's free to use and a fun way to explore hypothetical matchups." },
]

function getWinnerProbs() {
  return [
    { name: "Argentina", slug: "argentina", flag: "🇦🇷", prob: 22 },
    { name: "France", slug: "france", flag: "🇫🇷", prob: 18 },
    { name: "Brazil", slug: "brazil", flag: "🇧🇷", prob: 16 },
    { name: "England", slug: "england", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", prob: 14 },
    { name: "Spain", slug: "spain", flag: "🇪🇸", prob: 10 },
    { name: "Portugal", slug: "portugal", flag: "🇵🇹", prob: 7 },
    { name: "Germany", slug: "germany", flag: "🇩🇪", prob: 6 },
    { name: "Netherlands", slug: "netherlands", flag: "🇳🇱", prob: 4 },
    { name: "Uruguay", slug: "uruguay", flag: "🇺🇾", prob: 2 },
    { name: "Colombia", slug: "colombia", flag: "🇨🇴", prob: 1 },
  ]
}

export default function HomePage() {
  const latestPredictions = getLatestPredictions(6)
  const winnerProbs = getWinnerProbs()
  const topTeams = teams.filter(t => ["argentina", "brazil", "france", "england", "spain", "portugal"].includes(t.slug))

  return (
    <div>
      <JsonLd data={faqJsonLd(homeFAQs)} />
      {/* Hero */}
      <section className="bg-gradient-to-br from-sports-green/5 via-white to-sports-blue/5 border-b">
        <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="success" className="mb-4 text-sm px-4 py-1">
              <Zap className="h-3 w-3 mr-1" /> AI-Powered Analysis
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              World Cup Predictions{" "}
              <span className="text-sports-green">2026</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              AI-driven match forecasts, win probabilities, and predicted scores for every fixture of the FIFA World Cup 2026. Get data-backed predictions powered by advanced analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/predictions">
                <Button size="xl" className="w-full sm:w-auto bg-sports-green hover:bg-sports-green/90">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Predictions
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/simulator">
                <Button size="xl" variant="outline" className="w-full sm:w-auto">
                  <Brain className="h-4 w-4 mr-2" />
                  Match Simulator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-sports-green/20">
            <CardHeader>
              <Brain className="h-8 w-8 text-sports-green mb-2" />
              <CardTitle className="text-lg">AI-Powered Predictions</CardTitle>
              <CardDescription>Advanced machine learning models analyze match data, form, and historical patterns to generate accurate forecasts.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-sports-blue/20">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-sports-blue mb-2" />
              <CardTitle className="text-lg">Win Probability Analysis</CardTitle>
              <CardDescription>Every match comes with detailed win/draw/loss probabilities and predicted scorelines backed by data.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-sports-gold/20">
            <CardHeader>
              <Trophy className="h-8 w-8 text-sports-gold mb-2" />
              <CardTitle className="text-lg">Winner & Dark Horse Odds</CardTitle>
              <CardDescription>Complete championship probability table covering all 48 teams from favorites to dark horses.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Featured Match Predictions */}
      <section className="container mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Featured Match Predictions</h2>
            <p className="text-muted-foreground mt-1">Latest AI-powered match forecasts and analysis</p>
          </div>
          <Link href="/predictions">
            <Button variant="outline" className="hidden sm:flex">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPredictions.map((pred) => {
            const match = matches.find(m => m.predictionSlug === pred.matchSlug)
            if (!match) return null
            const teamA = teams.find(t => t.name === match.teamA)
            const teamB = teams.find(t => t.name === match.teamB)
            return (
              <MatchCard
                key={pred.matchSlug}
                matchSlug={match.slug}
                predictionSlug={match.predictionSlug}
                teamA={match.teamA}
                teamB={match.teamB}
                date={match.date}
                stadium={match.stadium}
                stage={match.stage}
                teamAFlag={teamA?.flag}
                teamBFlag={teamB?.flag}
                teamAProb={pred.teamAWinProbability}
                drawProb={pred.drawProbability}
                teamBProb={pred.teamBWinProbability}
                predictedScore={pred.predictedScore}
              />
            )
          })}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Link href="/predictions">
            <Button variant="outline">View All Predictions <ArrowRight className="h-4 w-4 ml-1" /></Button>
          </Link>
        </div>
      </section>

      {/* Winner Probabilities */}
      <section className="bg-muted/30 border-y">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">World Cup Winner Probability</h2>
            <p className="text-muted-foreground mt-1">AI-projected championship odds for the top contenders</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              {winnerProbs.slice(0, 5).map((team) => (
                <div key={team.slug} className="flex items-center gap-3">
                  <span className="text-xl w-8">{team.flag}</span>
                  <span className="font-medium w-24 text-sm">{team.name}</span>
                  <div className="flex-1">
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-sports-green rounded-full transition-all duration-700" style={{ width: `${team.prob * 4}%` }} />
                    </div>
                  </div>
                  <span className="font-bold text-sm w-12 text-right text-sports-green">{team.prob}%</span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {winnerProbs.slice(5).map((team) => (
                <div key={team.slug} className="flex items-center gap-3">
                  <span className="text-xl w-8">{team.flag}</span>
                  <span className="font-medium w-24 text-sm">{team.name}</span>
                  <div className="flex-1">
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-sports-blue rounded-full transition-all duration-700" style={{ width: `${team.prob * 4}%` }} />
                    </div>
                  </div>
                  <span className="font-bold text-sm w-12 text-right text-sports-blue">{team.prob}%</span>
                </div>
              ))}
              <Link href="/winner-predictions">
                <Button variant="link" className="mt-2 p-0 h-auto text-sports-green">
                  Full winner predictions →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top Teams */}
      <section className="container mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Top Contenders</h2>
          <p className="text-muted-foreground mt-1">The teams our AI model projects as strongest entering the tournament</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topTeams.map((team) => (
            <TeamCard key={team.slug} {...team} />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/teams">
            <Button variant="outline">View All Teams <ArrowRight className="h-4 w-4 ml-1" /></Button>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-sports-green to-sports-blue text-white">
        <div className="container mx-auto max-w-7xl px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Try the Match Simulator</h2>
          <p className="text-lg mb-6 opacity-90 max-w-xl mx-auto">
            Pick any two teams and get an instant AI prediction — win probability, predicted score, and analysis.
          </p>
          <Link href="/simulator">
            <Button size="xl" variant="secondary" className="font-semibold">
              <Zap className="h-4 w-4 mr-2" />
              Launch Simulator
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto max-w-7xl px-4 py-12">
        <FAQSection faqs={homeFAQs} />
      </section>
    </div>
  )
}
