"use client"

import { useState } from "react"
import { Copy, Check, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProbabilityBar } from "@/components/ProbabilityBar"
import { formatMatchTimeShort } from "@/lib/formatMatchTime"

interface PredictionShareModuleProps {
  teamA: string
  teamB: string
  predictedScore: { teamA: number; teamB: number }
  probabilities: { teamA: number; draw: number; teamB: number }
  confidence: "Low" | "Medium" | "High"
  matchDate: string
  utcDate?: string
  stadium?: string
  url: string
}

const confidenceColor: Record<string, string> = {
  High: "bg-sports-green",
  Medium: "bg-sports-blue",
  Low: "bg-sports-gold",
}

export function PredictionShareModule({
  teamA, teamB, predictedScore, probabilities, confidence, matchDate, utcDate, stadium, url,
}: PredictionShareModuleProps) {
  const [copied, setCopied] = useState(false)

  const shareText = `${teamA} vs ${teamB} AI Prediction: ${teamA} ${predictedScore.teamA}-${predictedScore.teamB} ${teamB}

Win probability:
${teamA} ${probabilities.teamA}%
Draw ${probabilities.draw}%
${teamB} ${probabilities.teamB}%

See full prediction:
${url}`

  const encodedText = encodeURIComponent(shareText)
  const encodedUrl = encodeURIComponent(url)

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Card className="border-sports-green/20 bg-gradient-to-br from-sports-green/5 to-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Share2 className="h-4 w-4 text-sports-green" />
          Share This Prediction
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Compact prediction card */}
        <div className="border rounded-lg p-4 mb-4 bg-white/50">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex-1 text-center">
              <div className="font-bold text-sm">{teamA}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-sports-green">
                {predictedScore.teamA}-{predictedScore.teamB}
              </div>
              <div className="text-[10px] text-muted-foreground">Predicted</div>
            </div>
            <div className="flex-1 text-center">
              <div className="font-bold text-sm">{teamB}</div>
            </div>
          </div>
          <ProbabilityBar a={probabilities.teamA} draw={probabilities.draw} b={probabilities.teamB} size="sm" />
          <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
            <span>{formatMatchTimeShort(matchDate).date}{utcDate ? ` · ${formatMatchTimeShort(matchDate, utcDate).time}` : ""}</span>
            {stadium && <span className="truncate max-w-40">{stadium}</span>}
            <Badge className={`text-[10px] px-1.5 py-0 ${confidenceColor[confidence]} text-white`}>
              {confidence} Confidence
            </Badge>
          </div>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="text-xs h-9"
          >
            {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
            {copied ? "Copied!" : "Copy Link"}
          </Button>

          <a
            href={`https://twitter.com/intent/tweet?text=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1 text-xs font-medium hover:bg-accent hover:text-accent-foreground h-9"
          >
            𝕏 Share
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1 text-xs font-medium hover:bg-accent hover:text-accent-foreground h-9"
          >
            Facebook
          </a>

          <a
            href={`https://wa.me/?text=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1 text-xs font-medium hover:bg-accent hover:text-accent-foreground h-9"
          >
            WhatsApp
          </a>
        </div>

        <p className="text-[10px] text-muted-foreground mt-3 text-center">
          aipredictor.world
        </p>
      </CardContent>
    </Card>
  )
}
