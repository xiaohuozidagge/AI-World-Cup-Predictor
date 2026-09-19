import { runCronSync, type CronEnv } from "../lib/football-data/cron-sync"

/**
 * Builds the Cloudflare Worker exported by `custom-worker.ts`.
 *
 * The generated OpenNext handler (`.open-next/worker.js`) is passed in as
 * `handler` and its `fetch` is delegated through unchanged. The only addition is
 * the `scheduled` hook: Cloudflare Cron Triggers call it once per hour, and it
 * hands the cron sync off to `ctx.waitUntil` so the event stays alive for the
 * duration of the (serial PL → CL) sync.
 *
 * `run` is injectable so unit tests can verify the wiring without importing the
 * generated worker or touching the network. Defaults to `runCronSync`.
 */

export type CronRunner = (env: CronEnv) => Promise<unknown>

export type FetchHandler = {
  fetch: NonNullable<ExportedHandler<Env>["fetch"]>
}

export function createWorker(
  handler: FetchHandler,
  run?: CronRunner,
): ExportedHandler<Env> {
  const defaultRun: CronRunner = (env) => runCronSync(env)

  return {
    fetch: handler.fetch,
    async scheduled(controller, env, ctx) {
      // The controller carries cron metadata (cron expression, scheduled time);
      // the sync does not consume it, but it is kept in the signature to match
      // the Workers runtime contract.
      void controller
      ctx.waitUntil((run ?? defaultRun)(env))
    },
  }
}
