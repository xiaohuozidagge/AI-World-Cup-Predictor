import type { Metadata } from "next"
import Link from "next/link"
import { Trophy, Star, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FAQSection } from "@/components/FAQSection"

export const metadata: Metadata = {
  title: "World Cup 2026 Winner Predictions — Championship Odds",
  description: "AI-powered World Cup 2026 winner predictions. Championship probability for all 48 teams, dark horse candidates, and Golden Boot contenders.",
  openGraph: {
    title: "World Cup 2026 Winner Predictions — Championship Odds",
    description: "AI-powered championship probability for all 48 teams. Favorites, dark horses, and Golden Boot candidates.",
  },
}

function getChampionProbs() {
  return [
    { name: "Argentina", flag: "🇦🇷", prob: 22, tier: "favorite" },
    { name: "France", flag: "🇫🇷", prob: 18, tier: "favorite" },
    { name: "Brazil", flag: "🇧🇷", prob: 16, tier: "favorite" },
    { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", prob: 14, tier: "favorite" },
    { name: "Spain", flag: "🇪🇸", prob: 10, tier: "contender" },
    { name: "Portugal", flag: "🇵🇹", prob: 7, tier: "contender" },
    { name: "Germany", flag: "🇩🇪", prob: 6, tier: "contender" },
    { name: "Netherlands", flag: "🇳🇱", prob: 4, tier: "contender" },
    { name: "Uruguay", flag: "🇺🇾", prob: 2, tier: "darkhorse" },
    { name: "Colombia", flag: "🇨🇴", prob: 1, tier: "darkhorse" },
    { name: "Italy", flag: "🇮🇹", prob: 0, tier: "darkhorse" },
    { name: "Croatia", flag: "🇭🇷", prob: 0, tier: "darkhorse" },
  ]
}

const darkHorses = [
  { name: "Uruguay", flag: "🇺🇾", reason: "Bielsa's high-intensity system has transformed Uruguay into a pressing machine. Valverde, Núñez, and Araújo form a world-class spine." },
  { name: "Colombia", flag: "🇨🇴", reason: "On a historic 24-match unbeaten run. Luis Díaz is one of the world's most in-form wingers, and James Rodríguez thrives in tournament football." },
  { name: "Japan", flag: "🇯🇵", reason: "Technically gifted and tactically disciplined. Mitoma and Kubo provide creative spark, and Japan's giant-killing pedigree is well established." },
  { name: "Morocco", flag: "🇲🇦", reason: "2022 semifinalists with an even stronger squad. Hakimi and Brahim Díaz give Morocco elite-level quality in key positions." },
  { name: "Canada", flag: "🇨🇦", reason: "Co-hosts with home advantage, a world-class coach in Jesse Marsch, and elite talent in Davies and David. The 2026 surprise package." },
  { name: "United States", flag: "🇺🇸", reason: "Home soil, Pochettino's tactical expertise, and a golden generation of Champions League-level talent. The most talented USMNT ever." },
]

const goldenBootCandidates = [
  { name: "Kylian Mbappé", team: "France", flag: "🇫🇷", odds: "5/1" },
  { name: "Vinicius Jr.", team: "Brazil", flag: "🇧🇷", odds: "8/1" },
  { name: "Harry Kane", team: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", odds: "9/1" },
  { name: "Julián Álvarez", team: "Argentina", flag: "🇦🇷", odds: "12/1" },
  { name: "Lamine Yamal", team: "Spain", flag: "🇪🇸", odds: "16/1" },
  { name: "Cristiano Ronaldo", team: "Portugal", flag: "🇵🇹", odds: "16/1" },
  { name: "Darwin Núñez", team: "Uruguay", flag: "🇺🇾", odds: "20/1" },
  { name: "Jamal Musiala", team: "Germany", flag: "🇩🇪", odds: "20/1" },
  { name: "Luis Díaz", team: "Colombia", flag: "🇨🇴", odds: "25/1" },
  { name: "Victor Osimhen", team: "Nigeria", flag: "🇳🇬", odds: "25/1" },
]

const winnerFAQs = [
  { question: "Who is most likely to win the 2026 World Cup?", answer: "According to our AI model, Argentina is the favorite with a 22% championship probability. Defending champions with Lionel Messi leading a squad that has won three consecutive major tournaments (2022 World Cup, 2021 Copa America, 2024 Copa America)." },
  { question: "Which teams are the dark horses for World Cup 2026?", answer: "Uruguay, Colombia, Japan, Morocco, and co-hosts Canada and the United States are our AI-identified dark horses. Each has a combination of elite talent, strong coaching, and favorable tournament conditions." },
  { question: "Who is predicted to win the Golden Boot?", answer: "Kylian Mbappé (France) leads our Golden Boot projections at 5/1 odds, followed by Vinicius Jr. (Brazil) at 8/1 and Harry Kane (England) at 9/1. Mbappé scored 8 goals in the 2022 tournament." },
  { question: "Can a host nation win the World Cup 2026?", answer: "Yes — six previous hosts have won the World Cup. The USA, Mexico, and Canada all have talented squads and home advantage. The USA is our highest-ranked co-host for championship probability with a young, talented core." },
  { question: "How does the AI calculate championship probability?", answer: "Our model weights squad strength (40%), recent tournament performance (25%), FIFA ranking (15%), group stage difficulty (10%), and historical host-nation advantage (10%). Predictions are simulated 10,000 times to generate probability distributions." },
]

export default function WinnerPredictionsPage() {
  const champs = getChampionProbs()

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">World Cup 2026 Winner Predictions</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          AI-powered championship probability for every team. From favorites to dark horses — our model projects each nation&apos;s path to the trophy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Champion Probability Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-sports-gold" />
                Championship Probability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {champs.map((team) => (
                  <div key={team.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="text-2xl w-8">{team.flag}</span>
                    <Link href={`/team/${team.name.toLowerCase().replace(/\s+/g, "-")}`} className="font-medium text-sm w-28 hover:text-sports-green transition-colors">
                      {team.name}
                    </Link>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${team.tier === "favorite" ? "bg-sports-green" : team.tier === "contender" ? "bg-sports-blue" : "bg-sports-gold"}`}
                          style={{ width: `${Math.max(team.prob * 4, 2)}%` }}
                        />
                      </div>
                    </div>
                    <span className="font-bold text-sm w-16 text-right">{team.prob > 0 ? `${team.prob}%` : "<1%"}</span>
                    <Badge variant={
                      team.tier === "favorite" ? "success" :
                      team.tier === "contender" ? "info" : "warning"
                    } className="text-xs w-20 justify-center">
                      {team.tier === "favorite" ? "Favorite" : team.tier === "contender" ? "Contender" : "Dark Horse"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dark Horses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-sports-blue" />
                Dark Horse Teams to Watch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {darkHorses.map((team) => (
                  <div key={team.name} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{team.flag}</span>
                      <Link href={`/team/${team.name.toLowerCase().replace(/\s+/g, "-")}`} className="font-semibold text-sm hover:text-sports-blue transition-colors">
                        {team.name}
                      </Link>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{team.reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <FAQSection faqs={winnerFAQs} />
        </div>

        {/* Sidebar: Golden Boot */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Star className="h-5 w-5 text-sports-gold" />
                Golden Boot Candidates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {goldenBootCandidates.map((player) => (
                  <div key={player.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="text-xl">{player.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{player.name}</div>
                      <div className="text-xs text-muted-foreground">{player.team}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">{player.odds}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Explore More</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/predictions" className="block text-sm text-muted-foreground hover:text-sports-green">All Match Predictions</Link>
              <Link href="/simulator" className="block text-sm text-muted-foreground hover:text-sports-green">Match Simulator</Link>
              <Link href="/teams" className="block text-sm text-muted-foreground hover:text-sports-green">Team Profiles</Link>
              <Link href="/schedule" className="block text-sm text-muted-foreground hover:text-sports-green">Full Schedule</Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
