/**
 * UTC-only date/time formatting for football match times.
 *
 * Match kickoff times are shown in UTC explicitly ("Sep 19, 2026" / "8:00 PM
 * UTC"). These helpers format with the Date object's UTC getters only, so the
 * output never depends on the server's local timezone and stays identical
 * between the server render and any client render — no hydration mismatch.
 */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function formatUtcDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

export function formatUtcTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  const hours = d.getUTCHours()
  const minutes = d.getUTCMinutes()
  const period = hours >= 12 ? "PM" : "AM"
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  return `${hour12}:${minutes.toString().padStart(2, "0")} ${period} UTC`
}
