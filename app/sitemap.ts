import type { MetadataRoute } from "next"
import { matches } from "@/data/matches"
import { teams } from "@/data/teams"
import { SITE_URL } from "@/lib/constants"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL

  const staticRoutes = [
    { url: baseUrl, lastModified: "2026-06-11", changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/predictions`, lastModified: "2026-06-11", changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/teams`, lastModified: "2026-06-11", changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/schedule`, lastModified: "2026-06-11", changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/winner-predictions`, lastModified: "2026-06-11", changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/methodology`, lastModified: "2026-06-11", changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: "2026-06-11", changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/how-we-predict`, lastModified: "2026-06-11", changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/data-sources`, lastModified: "2026-06-11", changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: "2026-06-11", changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/ai-track-record`, lastModified: "2026-06-11", changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${baseUrl}/2026-world-cup-group-predictions`, lastModified: "2026-06-11", changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/2026-world-cup-group-a-predictions`, lastModified: "2026-06-11", changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/2026-world-cup-group-b-predictions`, lastModified: "2026-06-11", changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/2026-world-cup-group-c-predictions`, lastModified: "2026-06-11", changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/2026-world-cup-group-d-predictions`, lastModified: "2026-06-11", changeFrequency: "weekly" as const, priority: 0.8 },
  ]

  // Only group-stage matches with known teams get prediction pages indexed
  const matchRoutes = matches
    .filter((m) => m.stage === "Group Stage" && m.predictionSlug)
    .map((m) => ({
      url: `${baseUrl}/match/${m.predictionSlug}`,
      lastModified: "2026-06-11",
      changeFrequency: "daily" as const,
      priority: 0.8,
    }))

  const teamRoutes = teams.map((t) => ({
    url: `${baseUrl}/team/${t.slug}`,
    lastModified: "2026-06-11",
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...matchRoutes, ...teamRoutes]
}
