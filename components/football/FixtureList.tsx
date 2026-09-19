import { CalendarDays } from "lucide-react"
import { EmptyState } from "@/components/EmptyState"
import type { MatchCardFixture } from "@/lib/football/match-url"
import { MatchCard } from "./MatchCard"

interface FixtureListProps {
  fixtures: MatchCardFixture[]
  emptyMessage: string
}

/** A responsive grid of MatchCards, or a neutral empty state when there are none. */
export function FixtureList({ fixtures, emptyMessage }: FixtureListProps) {
  if (fixtures.length === 0) {
    return <EmptyState icon={CalendarDays} title="No matches" description={emptyMessage} />
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fixtures.map((fixture) => (
        <MatchCard key={fixture.id} fixture={fixture} />
      ))}
    </div>
  )
}
