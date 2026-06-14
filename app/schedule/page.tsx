import type { Metadata } from "next"
import Link from "next/link"
import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { matches } from "@/data/matches"
import { teams } from "@/data/teams"
import { lookupUtcDate } from "@/lib/synced-data"

export const metadata: Metadata = {
  title: "World Cup 2026 Schedule: Fixtures, Dates, Stadiums & Match Predictions",
  description: "View the complete FIFA World Cup 2026 schedule with group-stage fixtures, knockout dates, stadiums and AI match prediction links.",
  openGraph: {
    title: "World Cup 2026 Schedule: Fixtures, Dates, Stadiums & Match Predictions",
    description: "Complete FIFA World Cup 2026 match schedule. Every fixture, date, and stadium with links to AI predictions for group-stage matches.",
  },
}

const allStages = ["Group Stage", "Round of 32", "Round of 16", "Quarter-finals", "Semi-finals", "Third-place Play-off", "Final"]
const groupsAtoL = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

export default function SchedulePage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">World Cup 2026 Schedule</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Complete FIFA World Cup 2026 match schedule — 104 matches across 16 stadiums in Canada, Mexico, and the United States. Click group-stage matches for AI predictions.
        </p>
      </div>

      <div className="space-y-10">
        {allStages.map((stage) => {
          const stageMatches = matches.filter(m => m.stage === stage)
          if (stageMatches.length === 0) return null

          const isGroupStage = stage === "Group Stage"

          return (
            <section key={stage}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-sports-green" />
                {stage}
              </h2>

              {isGroupStage ? (
                // Group stage: organize by group
                groupsAtoL.map((group) => {
                  const groupMatches = stageMatches.filter(m => m.group === group)
                  if (groupMatches.length === 0) return null
                  return (
                    <div key={group} className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-muted-foreground">Group {group}</h3>
                      <div className="space-y-2">
                        {groupMatches.map((match) => {
                          const teamA = teams.find(t => t.name === match.teamA)
                          const teamB = teams.find(t => t.name === match.teamB)
                          const utcDate = lookupUtcDate(match.teamA, match.teamB)
                          return (
                            <Link key={match.slug} href={`/match/${encodeURIComponent(match.predictionSlug!)}`}>
                              <Card className="group hover:shadow-md hover:border-sports-green/50 transition-all duration-200 cursor-pointer">
                                <CardContent className="p-4">
                                  <ScheduleRow match={match} teamA={teamA} teamB={teamB} utcDate={utcDate} />
                                </CardContent>
                              </Card>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )
                })
              ) : (
                // Knockout: list by date, no prediction links (teams TBD)
                <div className="space-y-2">
                  {stageMatches.map((match) => (
                    <Card key={match.slug} className="border-dashed opacity-75">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="text-center sm:text-left sm:w-32 flex-shrink-0">
                            <div className="text-sm font-bold">
                              {new Date(match.date).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}
                            </div>
                            <div className="text-xs text-muted-foreground">{match.city}</div>
                          </div>
                          <div className="flex items-center gap-3 flex-1 justify-center min-w-0">
                            <span className="font-semibold text-sm text-muted-foreground">{match.teamA}</span>
                            <Badge variant="secondary" className="text-xs flex-shrink-0">VS</Badge>
                            <span className="font-semibold text-sm text-muted-foreground">{match.teamB}</span>
                          </div>
                          <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground sm:w-48 flex-shrink-0">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{match.stadium}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              {stage !== "Final" && <Separator className="mt-6" />}
            </section>
          )
        })}
      </div>
    </div>
  )
}

function ScheduleRow({ match, teamA, teamB, utcDate }: { match: typeof matches[0]; teamA?: typeof teams[0]; teamB?: typeof teams[0]; utcDate?: string }) {
  const date = new Date(match.date)
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="text-center sm:text-left sm:w-32 flex-shrink-0">
        <div className="text-sm font-bold">
          {date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}
        </div>
        {utcDate && (
          <div className="text-xs text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
            <Clock className="h-3 w-3" />
            {new Date(utcDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC", hour12: true })} UTC
          </div>
        )}
        <div className="text-xs text-muted-foreground">{match.city}</div>
      </div>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
          <span className="font-semibold text-sm truncate">{match.teamA}</span>
          <span className="text-xl flex-shrink-0">{teamA?.flag || "⚽"}</span>
        </div>
        <Badge variant="secondary" className="text-xs flex-shrink-0">VS</Badge>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xl flex-shrink-0">{teamB?.flag || "⚽"}</span>
          <span className="font-semibold text-sm truncate">{match.teamB}</span>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground sm:w-48 flex-shrink-0">
        <MapPin className="h-3 w-3 flex-shrink-0" />
        <span className="truncate">{match.stadium}</span>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-sports-green transition-colors hidden sm:block flex-shrink-0" />
    </div>
  )
}
