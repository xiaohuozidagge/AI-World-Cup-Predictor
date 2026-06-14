export function getCountdown(utcDate: string): string {
  const target = new Date(utcDate).getTime()
  const now = Date.now()
  const diff = target - now
  if (diff <= 0) return "Starting soon"

  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    const remH = hours % 24
    return remH > 0 ? `${days}d ${remH}h` : `${days}d`
  }
  if (hours > 0) {
    const remM = mins % 60
    return remM > 0 ? `${hours}h ${remM}m` : `${hours}h`
  }
  return `${mins}m`
}

export function isMatchLive(utcDate: string): boolean {
  const target = new Date(utcDate).getTime()
  const now = Date.now()
  // Live if within 2.5h of kickoff and match isn't finished
  return now >= target && now - target < 2.5 * 60 * 60 * 1000
}
