import Link from "next/link"
import { Trophy, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TeamCardProps {
  name: string
  slug: string
  flag: string
  fifaRanking: number
  group: string
  worldCupTitles: number
  keyPlayers: string[]
}

export function TeamCard({ name, slug, flag, fifaRanking, group, worldCupTitles, keyPlayers }: TeamCardProps) {
  return (
    <Link href={`/team/${slug}`}>
      <Card className="group hover:shadow-md hover:border-sports-blue/50 transition-all duration-200 cursor-pointer h-full">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{flag}</span>
            <div>
              <h3 className="font-semibold group-hover:text-sports-blue transition-colors">{name}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Group {group}</span>
                <span>•</span>
                <span>#{fifaRanking} FIFA</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            {worldCupTitles > 0 && (
              <Badge variant="warning" className="text-xs">
                <Trophy className="h-3 w-3 mr-1" /> {worldCupTitles}x
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              <Star className="h-3 w-3 mr-1" /> #{fifaRanking}
            </Badge>
          </div>

          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Key players:</span>{" "}
            {keyPlayers.slice(0, 3).join(", ")}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
