import { ImageResponse } from "next/og"
import { matches } from "@/data/matches"
import { teams } from "@/data/teams"
import { predictions } from "@/data/predictions"
import { generatePrediction } from "@/lib/prediction-engine"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const runtime = "edge"

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const match = matches.find(m => m.predictionSlug === slug)
  if (!match) return defaultOG()

  const teamAData = teams.find(t => t.name === match.teamA)
  const teamBData = teams.find(t => t.name === match.teamB)
  if (!teamAData || !teamBData) return defaultOG()

  const prediction = predictions.find(p => p.matchSlug === slug)
    || generatePrediction(
        match.teamA, match.teamB,
        teamAData.fifaRanking, teamBData.fifaRanking,
        match.stage, match.group, match.date, match.stadium, match.city,
        teamAData.keyPlayers, teamBData.keyPlayers,
      )

  const matchDate = new Date(match.date)

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          fontFamily: "Geist",
          padding: 48,
          color: "white",
        }}
      >
        {/* VS Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 32, marginBottom: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 64 }}>{teamAData.flag}</span>
            <span style={{ fontSize: 32, fontWeight: 700 }}>{match.teamA}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: "#16a34a" }}>VS</span>
            <span style={{ fontSize: 48, fontWeight: 900, color: "#16a34a", marginTop: 4 }}>
              {prediction.predictedScore}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 64 }}>{teamBData.flag}</span>
            <span style={{ fontSize: 32, fontWeight: 700 }}>{match.teamB}</span>
          </div>
        </div>

        {/* Probability bar */}
        <div style={{
          display: "flex",
          width: 700,
          height: 24,
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 24,
        }}>
          <div style={{ width: `${prediction.teamAWinProbability}%`, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "white" }}>{prediction.teamAWinProbability}%</span>
          </div>
          <div style={{ width: `${prediction.drawProbability}%`, background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "white" }}>{prediction.drawProbability}%</span>
          </div>
          <div style={{ width: `${prediction.teamBWinProbability}%`, background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "white" }}>{prediction.teamBWinProbability}%</span>
          </div>
        </div>

        <p style={{
          fontSize: 20,
          opacity: 0.7,
          textAlign: "center",
        }}>
          {matchDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · {match.stadium}, {match.city}
        </p>
      </div>
    ),
    { ...size }
  )
}

function defaultOG() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #16a34a 0%, #2563eb 100%)",
          fontFamily: "Geist",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: 64, fontWeight: 900, textAlign: "center" }}>World Cup Predictions 2026</h1>
      </div>
    ),
    { ...size }
  )
}
