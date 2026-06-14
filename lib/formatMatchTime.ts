export interface FormattedMatchTime {
  date: string          // "June 11, 2026"
  timeUTC: string       // "8:00 PM UTC"
  timeLocal: string     // "4:00 PM EDT" (user's local time in browser, falls back to UTC)
  dateTimeUTC: string   // "June 11, 2026, 8:00 PM UTC"
  iso: string           // raw ISO for <time> datetime attr
}

// Server-side: format with UTC time from synced data or fall back to date-only
export function formatMatchTime(dateStr: string, syncedUtcDate?: string): FormattedMatchTime {
  // If we have synced UTC data, use it
  const date = syncedUtcDate ? new Date(syncedUtcDate) : new Date(dateStr + "T00:00:00Z")

  const dateFormatted = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })

  const timeUTC = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    hour12: true,
  }) + " UTC"

  const iso = date.toISOString()

  return {
    date: dateFormatted,
    timeUTC,
    dateTimeUTC: `${dateFormatted}, ${timeUTC}`,
    timeLocal: timeUTC, // server can't know user's local time; client hydrates this
    iso,
  }
}

// Short format for cards and lists
export function formatMatchTimeShort(dateStr: string, syncedUtcDate?: string): { date: string; time: string } {
  const date = syncedUtcDate ? new Date(syncedUtcDate) : new Date(dateStr + "T00:00:00Z")
  return {
    date: date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "UTC",
      hour12: true,
    }) + " UTC",
  }
}
