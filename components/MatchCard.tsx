import Link from "next/link"
import { Calendar, Clock, MapPin, Share2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProbabilityBar } from "@/components/ProbabilityBar"
import { formatMatchTimeShort } from "@/lib/formatMatchTime"

interface MatchCardProps {
  matchSlug?: string
  predictionSlug?: string
  utcDate?: string
  teamA: string
  teamB: string
  date: string
  stadium: string
  stage: string
  teamAFlag?: string
  teamBFlag?: string
  teamAProb?: number
  drawProb?: number
  teamBProb?: number
  predictedScore?: string
}

export function MatchCard({
  predictionSlug,
  utcDate,
  teamA,
  teamB,
  date,
  stadium,
  stage,
  teamAFlag,
  teamBFlag,
  teamAProb,
  drawProb,
  teamBProb,
  predictedScore,
}: MatchCardProps) {
  return (
    <Link href={predictionSlug ? `/match/${predictionSlug}` : "#"} className={!predictionSlug ? "pointer-events-none" : ""}>
      <Card className={`group transition-all duration-200 h-full ${predictionSlug ? "hover:shadow-md hover:border-sports-green/50 cursor-pointer" : "opacity-60"}`}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="secondary" className="text-xs">{stage}</Badge>
            {predictedScore && (
              <span className="text-xs font-medium text-muted-foreground">Pred: {predictedScore}</span>
            )}
          </div>

          {/* Teams */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex-1 text-center">
              <div className="text-2xl mb-1">{teamAFlag || "⚽"}</div>
              <div className="font-semibold text-sm">{teamA}</div>
            </div>
            <div className="text-xs font-bold text-muted-foreground">VS</div>
            <div className="flex-1 text-center">
              <div className="text-2xl mb-1">{teamBFlag || "⚽"}</div>
              <div className="font-semibold text-sm">{teamB}</div>
            </div>
          </div>

          {/* Probability bar */}
          {teamAProb !== undefined && teamBProb !== undefined && (
            <div className="mb-3">
              <ProbabilityBar a={teamAProb} draw={drawProb ?? 0} b={teamBProb} />
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatMatchTimeShort(date, utcDate).date}</span>
            </div>
            {utcDate && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatMatchTimeShort(date, utcDate).time}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{stadium}</span>
            </div>
          </div>
          {predictionSlug && (
            <div className="mt-3 pt-3 border-t flex items-center justify-end">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 group-hover:text-sports-green transition-colors">
                <Share2 className="h-3 w-3" /> Share Prediction
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
