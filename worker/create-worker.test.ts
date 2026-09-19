import { test } from "node:test"
import assert from "node:assert/strict"

import { createWorker, type CronRunner } from "./create-worker"

test("createWorker delegates fetch to the provided handler unchanged", async () => {
  const response = new Response("ok", { status: 200 })
  const handler = { fetch: async () => response }
  const worker = createWorker(handler)
  assert.equal(worker.fetch, handler.fetch)
  const fetchFn = worker.fetch as unknown as (
    request: Request,
    env: unknown,
    ctx: unknown,
  ) => Promise<Response>
  const out = await fetchFn(new Request("https://example.com/"), {}, {})
  assert.equal(out, response)
})

test("createWorker wires scheduled to ctx.waitUntil with the injected cron run", async () => {
  const waited: unknown[] = []
  const ctx = {
    waitUntil: (p: unknown) => {
      waited.push(p)
    },
  } as unknown as ExecutionContext

  const ranEnvs: unknown[] = []
  const run: CronRunner = async (env) => {
    ranEnvs.push(env)
    return { ok: true }
  }

  const env = { SUPABASE_SECRET_KEY: "s" } as unknown as Env
  const worker = createWorker({ fetch: async () => new Response("ok") }, run)
  await worker.scheduled!({} as ScheduledController, env, ctx)

  assert.equal(waited.length, 1)
  assert.equal(ranEnvs.length, 1)
  assert.equal(ranEnvs[0], env) // the scheduled env flows through to the runner
  assert.deepEqual(await (waited[0] as Promise<unknown>), { ok: true })
})
