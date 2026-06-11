import type { Metadata } from "next"
import { TeamCard } from "@/components/TeamCard"
import { teams } from "@/data/teams"

export const metadata: Metadata = {
  title: "World Cup 2026 Teams — All 48 Nations",
  description: "Complete guide to all 48 teams competing in the FIFA World Cup 2026. FIFA rankings, key players, coaches, and World Cup chances for every nation.",
  openGraph: {
    title: "World Cup 2026 Teams — All 48 Nations",
    description: "Complete guide to all 48 teams competing in the FIFA World Cup 2026. Rankings, key players, and analysis.",
  },
}

const groups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

export default function TeamsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">World Cup 2026 Teams</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          All 48 nations competing for the FIFA World Cup 2026 trophy. Click any team for detailed profiles, AI predictions, and World Cup chances.
        </p>
      </div>

      {groups.map((group) => {
        const groupTeams = teams.filter(t => t.group === group)
        if (groupTeams.length === 0) return null
        return (
          <section key={group} className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Group {group}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupTeams.map((team) => (
                <TeamCard key={team.slug} {...team} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
