/**
 * Error taxonomy for the football-data.org client.
 *
 * The `kind` drives retry decisions: only rate-limit / server / network /
 * timeout errors are retried; auth (401/403) and not-found (404) are not.
 * Error messages never contain the API key.
 */

export type FootballDataErrorKind =
  | "auth" // 401 / 403
  | "not_found" // 404
  | "rate_limit" // 429
  | "server" // 5xx
  | "http" // any other non-2xx
  | "network" // fetch threw
  | "timeout" // request aborted

export class FootballDataError extends Error {
  readonly kind: FootballDataErrorKind
  readonly status: number | null
  readonly retryAfterSeconds: number | null

  constructor(
    message: string,
    opts: {
      kind: FootballDataErrorKind
      status?: number | null
      retryAfterSeconds?: number | null
      cause?: unknown
    },
  ) {
    super(message, { cause: opts.cause })
    this.name = "FootballDataError"
    this.kind = opts.kind
    this.status = opts.status ?? null
    this.retryAfterSeconds = opts.retryAfterSeconds ?? null
  }
}

export function isRetryable(kind: FootballDataErrorKind): boolean {
  return kind === "rate_limit" || kind === "server" || kind === "network" || kind === "timeout"
}
