/**
 * Cloudflare Worker entry point (Phase 5).
 *
 * Wraps the generated OpenNext handler so we can add a `scheduled` handler for
 * the football-data.org cron sync without touching the generated worker or
 * duplicating any sync logic. `fetch` is delegated through unchanged.
 *
 * Durable Object classes (`DOQueueHandler`, `DOShardedTagCache`,
 * `BucketCachePurge`) are deliberately NOT re-exported: `wrangler.jsonc` binds
 * no Durable Objects (OpenNext is configured with dummy caches), so there is
 * nothing to wire. If DO bindings are added later, re-export them here.
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: generated at build time by OpenNext; absent while `next build` type-checks
import handler from "./.open-next/worker.js"

import { createWorker } from "./worker/create-worker"

export default createWorker(handler)
