import { Badge } from "@/components/ui/badge"
import type { FixtureStatus } from "@/lib/supabase/types"

type StatusVariant = "secondary" | "info" | "success" | "warning"

/**
 * Human-readable status badge for a football fixture.
 *
 * Text is always present (never colour-only): SCHEDULED/TIMED read "Upcoming",
 * LIVE reads "In progress", HALFTIME reads "Half-time", FINISHED reads "FT",
 * and the postponed/cancelled/suspended states are spelled out. We deliberately
 * avoid "Live Scores" / "Real-Time" wording.
 */
const STATUS_META: Record<FixtureStatus, { label: string; variant: StatusVariant }> = {
  SCHEDULED: { label: "Upcoming", variant: "secondary" },
  TIMED: { label: "Upcoming", variant: "secondary" },
  LIVE: { label: "In progress", variant: "info" },
  HALFTIME: { label: "Half-time", variant: "info" },
  FINISHED: { label: "FT", variant: "success" },
  POSTPONED: { label: "Postponed", variant: "warning" },
  CANCELLED: { label: "Cancelled", variant: "warning" },
  SUSPENDED: { label: "Suspended", variant: "warning" },
}

export function MatchStatusBadge({ status }: { status: FixtureStatus }) {
  const meta = STATUS_META[status]
  return <Badge variant={meta.variant}>{meta.label}</Badge>
}
