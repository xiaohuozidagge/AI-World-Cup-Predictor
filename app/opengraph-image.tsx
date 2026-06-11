import { ImageResponse } from "next/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const runtime = "edge"

export default function Image() {
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
          padding: 64,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <span style={{ fontSize: 48 }}>⚽</span>
          <span style={{ color: "white", fontSize: 36, fontWeight: 700, opacity: 0.9 }}>AI WORLD CUP PREDICTIONS</span>
        </div>
        <h1 style={{
          color: "white",
          fontSize: 72,
          fontWeight: 900,
          textAlign: "center",
          lineHeight: 1.1,
          marginBottom: 24,
          maxWidth: 900,
        }}>
          World Cup Predictions 2026
        </h1>
        <p style={{
          color: "white",
          fontSize: 28,
          textAlign: "center",
          opacity: 0.85,
          maxWidth: 700,
          lineHeight: 1.4,
        }}>
          AI-powered match forecasts, win probabilities, and predicted scores for every FIFA World Cup 2026 fixture
        </p>
      </div>
    ),
    { ...size }
  )
}
