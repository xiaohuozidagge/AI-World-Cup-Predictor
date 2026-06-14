import type { Metadata } from "next"
import Link from "next/link"
import { Search, Calendar, Clock, MapPin, Filter, EyeOff, Zap, Trophy, ChevronRight, TrendingUp, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProbabilityBar } from "@/components/ProbabilityBar"
import { matches } from "@/data/matches"
import { predictions } from "@/data/predictions"
import { teams } from "@/data/teams"
import { generatePrediction } from "@/lib/prediction-engine"
import { loadSyncedMatches, lookupUtcDate } from "@/lib/synced-data"
import { sortMatchesByKickoff, findNextMatch, uniqueMatchDates } from "@/lib/sortMatches"
import { getCountdown } from "@/lib/getCountdown"
import { getPredictionAccuracy, accuracyEmoji } from "@/lib/predictionAccuracy"
import { SITE_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "World Cup 2026 Predictions & Watch Calendar — Live Scores & Match Schedule",
  description: "Complete World Cup 2026 match predictions calendar. Live scores, finished results, upcoming kickoff times with countdown, AI predictions, and match analysis.",
  openGraph: {
    title: "World Cup 2026 Predictions & Watch Calendar",
    description: "Live scores, finished results, upcoming kickoff times, and AI predictions for every World Cup 2026 match.",
  },
}

const GROUPS = ["A","B","C","D","E","F","G","H","I","J","K","L"]

export default async function PredictionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const searchTerm = typeof sp.search === "string" ? sp.search.toLowerCase() : ""
  const groupFilter = typeof sp.group === "string" ? sp.group : ""
  const dateFilter = typeof sp.date === "string" ? sp.date : ""
  const hideCompleted = sp.hide === "1"

  const synced = loadSyncedMatches()
  const groupStageMatches = matches.filter(m => m.stage === "Group Stage" && m.predictionSlug)

  // Enrich with synced data
  const enriched = groupStageMatches.map(m => {
    const sm = synced.find(s =>
      (s.teamA === m.teamA || s.teamASlug === m.teamA) &&
      (s.teamB === m.teamB || s.teamBSlug === m.teamB)
    )
    return { ...m, synced: sm }
  })

  // Filter
  let filtered = enriched

  if (searchTerm) {
    filtered = filtered.filter(m =>
      m.teamA.toLowerCase().includes(searchTerm) ||
      m.teamB.toLowerCase().includes(searchTerm) ||
      m.group?.toLowerCase().includes(searchTerm)
    )
  }
  if (groupFilter) {
    filtered = filtered.filter(m => m.group === groupFilter)
  }
  if (hideCompleted) {
    filtered = filtered.filter(m => m.synced?.status !== "finished")
  }
  if (dateFilter) {
    filtered = filtered.filter(m => m.date === dateFilter)
  }

  // Sort by kickoff
  const sorted = sortMatchesByKickoff(filtered.map(m => ({
    ...m,
    utcDate: m.synced?.utcDate,
  }))) as (typeof enriched[number] & { utcDate?: string })[]

  // Date tabs
  const allDates = uniqueMatchDates(enriched)
  const today = new Date().toISOString().split("T")[0]
  const tomorrowDate = new Date(Date.now() + 86400000).toISOString().split("T")[0]
  const hasToday = allDates.includes(today)
  const hasTomorrow = allDates.includes(tomorrowDate)

  // Next match
  const allWithUtc = enriched.map(m => ({ ...m, utcDate: m.synced?.utcDate || undefined }))
  const nextMatch = findNextMatch(allWithUtc)
  const nextMatchId = nextMatch?.id

  // Today's date label
  const todayLabel = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  const tomorrowLabel = new Date(Date.now() + 86400000).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Match Predictions</h1>
        <p className="text-muted-foreground">
          World Cup 2026 watch calendar — live scores, kickoff times, and AI predictions for every match.
        </p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col gap-3 mb-6">
        {/* Search + group filter + hide completed */}
        <div className="flex flex-col sm:flex-row gap-3">
          <form className="flex gap-3 flex-1" method="GET">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="search"
                placeholder="Search team..."
                className="pl-9"
                defaultValue={searchTerm}
              />
            </div>
            <select
              name="group"
              defaultValue={groupFilter}
              className="rounded-md border border-input bg-background px-3 py-1 text-sm"
              onChange={(e) => { (e.target.form as HTMLFormElement)?.requestSubmit() }}
            >
              <option value="">All Groups</option>
              {GROUPS.map(g => <option key={g} value={g}>Group {g}</option>)}
            </select>
            <Button type="submit" variant="outline" size="sm">Filter</Button>
            {hideCompleted && <input type="hidden" name="hide" value="1" />}
            {dateFilter && <input type="hidden" name="date" value={dateFilter} />}
          </form>
          <form method="GET" className="flex gap-2">
            {searchTerm && <input type="hidden" name="search" value={searchTerm} />}
            {groupFilter && <input type="hidden" name="group" value={groupFilter} />}
            {dateFilter && <input type="hidden" name="date" value={dateFilter} />}
            <Button type="submit" name="hide" value={hideCompleted ? "0" : "1"} variant={hideCompleted ? "default" : "outline"} size="sm">
              <EyeOff className="h-4 w-4 mr-1" />
              {hideCompleted ? "Showing All" : "Hide Completed"}
            </Button>
          </form>
        </div>

        {/* Date tabs */}
        <div className="flex flex-wrap gap-1.5">
          <DateTab href="?" label="All" active={!dateFilter && !hideCompleted} />
          {hasToday && <DateTab href={`?date=${today}${hideCompleted ? "&hide=1" : ""}`} label={`Today · ${todayLabel}`} active={dateFilter === today} />}
          {hasTomorrow && <DateTab href={`?date=${tomorrowDate}${hideCompleted ? "&hide=1" : ""}`} label={`Tomorrow · ${tomorrowLabel}`} active={dateFilter === tomorrowDate} />}
          {allDates.filter(d => d !== today && d !== tomorrowDate).map(d => {
            const label = new Date(d + "T00:00:00Z").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
            const linkDate = `?date=${d}${hideCompleted ? "&hide=1" : ""}`;
            return <DateTab key={d} href={linkDate} label={label} active={dateFilter === d} />
          })}
        </div>
      </div>

      {/* Match list */}
      <div className="space-y-3">
        {sorted.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No matches matching your criteria.</p>
            <a href="/predictions" className="text-sports-green hover:underline mt-2 inline-block">Clear all filters</a>
          </div>
        )}

        {sorted.map((m) => {
          const pred = predictions.find(p => p.matchSlug === m.predictionSlug)
          const teamA = teams.find(t => t.name === m.teamA)
          const teamB = teams.find(t => t.name === m.teamB)
          const fallback = (!pred && teamA && teamB)
            ? generatePrediction(m.teamA, m.teamB, teamA.fifaRanking, teamB.fifaRanking, m.stage, m.group || "", m.date, m.stadium, m.city, teamA.keyPlayers, teamB.keyPlayers)
            : null
          const resolvedPred = pred || fallback
          const isFinished = m.synced?.status === "finished"
          const isLive = m.synced?.status === "live"
          const actualScore = m.synced?.actualScore
          const accuracy = isFinished && actualScore && resolvedPred
            ? getPredictionAccuracy(resolvedPred.predictedScore, actualScore)
            : null
          const isNext = m.id === nextMatchId
          const utcDate = m.synced?.utcDate
          const countdown = utcDate && !isFinished ? getCountdown(utcDate) : null
          const timeDisplay = utcDate
            ? new Date(utcDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC", hour12: true }) + " UTC"
            : null
          const dateDisplay = new Date(m.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" })

          return (
            <Link key={m.slug} href={`/match/${m.predictionSlug}`}>
              <Card className={`group hover:shadow-md transition-all duration-200 cursor-pointer ${isNext ? "border-sports-green ring-1 ring-sports-green/30" : "hover:border-sports-green/50"} ${isLive ? "border-red-400/50 bg-red-50/30" : ""} ${isFinished ? "opacity-75" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Left: Date / Time / Status */}
                    <div className="flex items-center gap-3 sm:w-44 flex-shrink-0">
                      {/* Status badge */}
                      {isLive && <Badge className="bg-red-500 text-white text-[10px] animate-pulse">LIVE</Badge>}
                      {isFinished && <Badge variant="secondary" className="text-[10px]">FT</Badge>}
                      {!isFinished && !isLive && isNext && <Badge className="bg-sports-green text-white text-[10px]">⭐ NEXT</Badge>}
                      {!isFinished && !isLive && !isNext && <Badge variant="outline" className="text-[10px]">Upcoming</Badge>}
                    </div>

                    {/* Center: Teams + Score */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                        <span className="font-semibold text-sm truncate">{m.teamA}</span>
                        <span className="text-lg flex-shrink-0">{teamA?.flag || "⚽"}</span>
                      </div>

                      {/* Score */}
                      <div className="text-center flex-shrink-0 min-w-[60px]">
                        {isFinished && actualScore ? (
                          <>
                            <div className="text-lg font-extrabold">{actualScore.teamA}-{actualScore.teamB}</div>
                            <div className="text-[10px] text-muted-foreground">Final</div>
                          </>
                        ) : isLive && actualScore ? (
                          <>
                            <div className="text-lg font-extrabold text-red-500">{actualScore.teamA}-{actualScore.teamB}</div>
                            <div className="text-[10px] text-red-500 font-medium">LIVE</div>
                          </>
                        ) : (
                          <>
                            <div className="text-lg font-extrabold text-sports-green">{resolvedPred?.predictedScore || "?-?"}</div>
                            <div className="text-[10px] text-muted-foreground">Predicted</div>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-lg flex-shrink-0">{teamB?.flag || "⚽"}</span>
                        <span className="font-semibold text-sm truncate">{m.teamB}</span>
                      </div>
                    </div>

                    {/* Right: Meta */}
                    <div className="flex items-center gap-4 sm:w-56 flex-shrink-0 justify-end text-xs text-muted-foreground">
                      <div className="text-right leading-tight">
                        <div className="flex items-center gap-1 justify-end">
                          <Calendar className="h-3 w-3" />
                          <span>{dateDisplay}</span>
                        </div>
                        {timeDisplay && (
                          <div className="flex items-center gap-1 justify-end">
                            <Clock className="h-3 w-3" />
                            <span>{timeDisplay}</span>
                          </div>
                        )}
                        {countdown && !isFinished && (
                          <div className="text-sports-green font-medium">{countdown}</div>
                        )}
                        {accuracy && (
                          <div>{accuracyEmoji(accuracy)} {accuracy}</div>
                        )}
                      </div>
                      <div className="text-center">
                        <Badge variant="secondary" className="text-[10px]">G{m.group}</Badge>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-sports-green transition-colors flex-shrink-0" />
                    </div>
                  </div>

                  {/* Probability bar for upcoming */}
                  {!isFinished && resolvedPred && (
                    <div className="mt-2 pt-2 border-t border-muted/50">
                      <ProbabilityBar
                        a={resolvedPred.teamAWinProbability}
                        draw={resolvedPred.drawProbability}
                        b={resolvedPred.teamBWinProbability}
                        size="sm"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Match count */}
      <p className="text-xs text-muted-foreground mt-6 text-center">
        {sorted.length} match{sorted.length !== 1 ? "es" : ""} shown
        {searchTerm && <> — searching &quot;{searchTerm}&quot;</>}
        {groupFilter && <> — Group {groupFilter}</>}
        {hideCompleted && <> — completed hidden</>}
      </p>
    </div>
  )
}

function DateTab({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <a href={href}>
      <Badge variant={active ? "default" : "outline"} className={`cursor-pointer whitespace-nowrap text-xs ${active ? "bg-sports-green hover:bg-sports-green/90" : ""}`}>
        {label}
      </Badge>
    </a>
  )
}
