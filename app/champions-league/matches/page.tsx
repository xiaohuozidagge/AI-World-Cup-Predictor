import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld"
import { SITE_URL } from "@/lib/constants"
import { formatUtcDate, formatUtcTime } from "@/lib/format-utc"
import {
  getMatchDirectoryData,
  parsePositiveInt,
  parseWhitelistedInt,
  parseWhitelistedString,
} from "@/lib/football/match-queries"
import { MatchDirectory, type MatchDirectoryView } from "@/components/football/MatchDirectory"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Champions League Fixtures & Results 2026/27",
  description:
    "Browse the full Champions League fixture list and results, grouped by matchday. Match data is sourced from football-data.org.",
  alternates: { canonical: "/champions-league/matches" },
  openGraph: {
    title: "Champions League Fixtures & Results 2026/27 | AI Predictor",
    description:
      "Browse the full Champions League fixture list and results, grouped by matchday. Match data is sourced from football-data.org.",
  },
}

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Champions League", url: "/champions-league" },
  { name: "Matches", url: "/champions-league/matches" },
]

export default async function ChampionsLeagueMatchesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const data = await getMatchDirectoryData("champions-league")

  if (!data) {
    return (
      <>
        <JsonLd data={breadcrumbJsonLd(breadcrumbs, SITE_URL)} />
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <Breadcrumbs items={breadcrumbs} />
          <div className="rounded-xl border bg-muted/30 px-6 py-10 text-center">
            <p className="font-medium text-foreground">Match data is temporarily unavailable.</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              Please check back shortly. Champions League fixtures and results are being refreshed.
            </p>
          </div>
        </div>
      </>
    )
  }

  const matchweek = sp.matchweek != null ? parseWhitelistedInt(sp.matchweek, data.filterOptions.matchweeks) : null
  const stage = sp.stage != null ? parseWhitelistedString(sp.stage, data.filterOptions.stages) : null
  const page = parsePositiveInt(sp.page) ?? 1

  let view: MatchDirectoryView = "overview"
  const viewRaw = sp.view
  if (typeof viewRaw === "string") {
    if (viewRaw === "in-progress" || viewRaw === "upcoming" || viewRaw === "results" || viewRaw === "other") {
      view = viewRaw
    }
  }

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs, SITE_URL)} />

      <div className="container mx-auto max-w-7xl px-4 py-12">
        <Breadcrumbs items={breadcrumbs} />

        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Champions League Fixtures &amp; Results</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Browse every Champions League fixture and result, grouped by matchday. Use the filters to jump to a
            specific stage or matchday.
          </p>
          {data.lastUpdatedAt && (
            <p className="mt-2 text-sm text-muted-foreground">
              Last updated {formatUtcDate(data.lastUpdatedAt)} · {formatUtcTime(data.lastUpdatedAt)}
            </p>
          )}
        </header>

        <MatchDirectory
          data={data}
          view={view}
          page={page}
          filter={{ matchweek, stage }}
          nowIso={new Date().toISOString()}
        />

        <p className="mt-10 text-xs text-muted-foreground">
          Match data is sourced from football-data.org. Scores and status updates may be delayed.
        </p>
      </div>
    </>
  )
}
