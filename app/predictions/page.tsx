import type { Metadata } from "next"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MatchCard } from "@/components/MatchCard"
import { matches } from "@/data/matches"
import { predictions } from "@/data/predictions"
import { teams } from "@/data/teams"
import { generatePrediction } from "@/lib/prediction-engine"
import { lookupUtcDate } from "@/lib/synced-data"

export const metadata: Metadata = {
  title: "World Cup 2026 Match Predictions — All Fixtures",
  description: "Complete AI-powered match predictions for every FIFA World Cup 2026 fixture. Browse by team, stage, or group. Includes win probabilities, predicted scores, and analysis.",
  openGraph: {
    title: "World Cup 2026 Match Predictions — All Fixtures",
    description: "Complete AI-powered match predictions for every FIFA World Cup 2026 fixture. Browse by team, stage, or group.",
  },
}

const allTeams = Array.from(new Set([...matches.map(m => m.teamA), ...matches.map(m => m.teamB)])).sort()

export default async function PredictionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const search = typeof sp.search === "string" ? sp.search.toLowerCase() : ""
  const teamFilter = typeof sp.team === "string" ? sp.team : ""

  let filteredMatches = matches
  if (search) {
    filteredMatches = filteredMatches.filter(m =>
      m.teamA.toLowerCase().includes(search) ||
      m.teamB.toLowerCase().includes(search) ||
      m.stadium.toLowerCase().includes(search) ||
      m.stage.toLowerCase().includes(search) ||
      (m.group && m.group.toLowerCase().includes(search))
    )
  }
  if (teamFilter) {
    filteredMatches = filteredMatches.filter(m => m.teamA === teamFilter || m.teamB === teamFilter)
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Match Predictions</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          AI-powered predictions for every FIFA World Cup 2026 fixture. Click any match for detailed analysis, win probabilities, and predicted scores.
        </p>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            name="search"
            placeholder="Search by team, stadium, or stage..."
            className="pl-9"
            defaultValue={search}
          />
        </div>
        <form className="flex flex-wrap gap-2 items-center">
          <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
          {allTeams.slice(0, 12).map(team => (
            <button
              key={team}
              type="submit"
              name="team"
              value={teamFilter === team ? "" : team}
              className="inline-block"
            >
              <Badge variant={teamFilter === team ? "default" : "outline"} className="cursor-pointer">
                {team}
              </Badge>
            </button>
          ))}
          {teamFilter && (
            <a href="/predictions" className="text-xs text-muted-foreground hover:text-foreground ml-1">
              Clear filter
            </a>
          )}
        </form>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-6">
        Showing {filteredMatches.length} match{filteredMatches.length !== 1 ? "es" : ""}
        {teamFilter && <> for <strong>{teamFilter}</strong></>}
        {search && <> matching &quot;<strong>{search}</strong>&quot;</>}
      </p>

      {/* Match grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMatches.map((match) => {
          const pred = predictions.find(p => p.matchSlug === match.predictionSlug)
          const teamA = teams.find(t => t.name === match.teamA)
          const teamB = teams.find(t => t.name === match.teamB)
          const fallbackPred = (!pred && teamA && teamB)
            ? generatePrediction(match.teamA, match.teamB, teamA.fifaRanking, teamB.fifaRanking, match.stage, match.group, match.date, match.stadium, match.city, teamA.keyPlayers, teamB.keyPlayers)
            : null
          const resolvedPred = pred || fallbackPred
          return (
            <MatchCard
              key={match.slug}
              matchSlug={match.slug}
              predictionSlug={match.predictionSlug}
              utcDate={lookupUtcDate(match.teamA, match.teamB)}
              teamA={match.teamA}
              teamB={match.teamB}
              date={match.date}
              stadium={match.stadium}
              stage={match.stage}
              teamAFlag={teamA?.flag}
              teamBFlag={teamB?.flag}
              teamAProb={resolvedPred?.teamAWinProbability}
              drawProb={resolvedPred?.drawProbability}
              teamBProb={resolvedPred?.teamBWinProbability}
              predictedScore={resolvedPred?.predictedScore}
            />
          )
        })}
      </div>

      {filteredMatches.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No matches found matching your criteria.</p>
          <a href="/predictions" className="text-sports-green hover:underline mt-2 inline-block">Clear all filters</a>
        </div>
      )}
    </div>
  )
}
