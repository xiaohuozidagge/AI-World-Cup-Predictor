import type { Metadata } from "next"
import Link from "next/link"
import { readFileSync, existsSync } from "fs"
import { join } from "path"
import { Trophy, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SyncedStanding } from "@/lib/football-data/normalize"

export const metadata: Metadata = {
  title: "World Cup 2026 Standings — Group Tables & Live Rankings",
  description: "FIFA World Cup 2026 group standings, live rankings, and qualification status. Updated with official match results from football-data.org.",
  openGraph: {
    title: "World Cup 2026 Standings — Live Group Tables",
    description: "Complete FIFA World Cup 2026 group standings with live rankings and qualification status.",
  },
  alternates: { canonical: "/standings" },
}

function loadStandings(): { groups: Record<string, SyncedStanding[]>; lastSync: string | null } {
  try {
    const dataDir = join(process.cwd(), "data", "synced")
    if (!existsSync(join(dataDir, "standings.json"))) return { groups: {}, lastSync: null }

    const raw = JSON.parse(readFileSync(join(dataDir, "standings.json"), "utf-8")) as SyncedStanding[]
    const lastUpdated = existsSync(join(dataDir, "last-updated.json"))
      ? JSON.parse(readFileSync(join(dataDir, "last-updated.json"), "utf-8"))
      : null

    const groups: Record<string, SyncedStanding[]> = {}
    for (const s of raw) {
      if (!groups[s.group]) groups[s.group] = []
      groups[s.group].push(s)
    }
    for (const g of Object.keys(groups)) groups[g].sort((a, b) => a.position - b.position)

    return { groups, lastSync: lastUpdated?.lastSync || null }
  } catch {
    return { groups: {}, lastSync: null }
  }
}

const groupsOrder = ["A","B","C","D","E","F","G","H","I","J","K","L"]

export default function StandingsPage() {
  const { groups, lastSync } = loadStandings()
  const hasData = Object.keys(groups).length > 0

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">World Cup 2026 Standings</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          FIFA World Cup 2026 group tables — updated with official match results from football-data.org.
          {lastSync && <span className="text-xs block mt-1">Last updated: {new Date(lastSync).toLocaleString()}</span>}
        </p>
      </div>

      {!hasData ? (
        <Card>
          <CardContent className="p-12 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Standings will update once matches begin on June 11, 2026.</p>
            <p className="text-sm text-muted-foreground mt-2">Group tables are synced from the official football-data.org API.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupsOrder.map((g) => {
            const rows = groups[g]
            if (!rows || rows.length === 0) return null
            return (
              <Card key={g}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-sports-gold" />Group {g}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b text-muted-foreground">
                        <th className="text-left py-1 pr-1 w-6">#</th>
                        <th className="text-left py-1">Team</th>
                        <th className="text-center py-1 px-1">P</th>
                        <th className="text-center py-1 px-1">W</th>
                        <th className="text-center py-1 px-1">D</th>
                        <th className="text-center py-1 px-1">L</th>
                        <th className="text-center py-1 px-1">GD</th>
                        <th className="text-right py-1 font-bold">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, i) => (
                        <tr key={row.team} className={`border-b border-muted ${i < 2 ? "bg-sports-green/5" : ""}`}>
                          <td className="py-1.5 font-medium">{row.position}</td>
                          <td className="py-1.5">
                            {row.teamSlug ? (
                              <Link href={`/team/${row.teamSlug}`} className="hover:text-sports-green transition-colors">{row.team}</Link>
                            ) : row.team}
                            {i < 2 && <Badge variant="success" className="ml-1 text-[10px] px-1 py-0">Q</Badge>}
                          </td>
                          <td className="text-center py-1.5">{row.played}</td>
                          <td className="text-center py-1.5">{row.won}</td>
                          <td className="text-center py-1.5">{row.draw}</td>
                          <td className="text-center py-1.5">{row.lost}</td>
                          <td className="text-center py-1.5">{row.goalDifference > 0 ? "+" : ""}{row.goalDifference}</td>
                          <td className="text-right py-1.5 font-bold">{row.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link href="/2026-world-cup-group-predictions" className="text-sports-green hover:underline">Group Predictions →</Link>
        <Link href="/schedule" className="text-sports-green hover:underline">Match Schedule →</Link>
        <Link href="/predictions" className="text-sports-green hover:underline">Match Predictions →</Link>
      </div>
    </div>
  )
}
