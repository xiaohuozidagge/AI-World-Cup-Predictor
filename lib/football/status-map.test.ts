import { test } from "node:test"
import assert from "node:assert/strict"

import { mapFixtureStatus } from "./status-map"
import type { FixtureStatus } from "@/lib/supabase/types"

const known: Array<[string, FixtureStatus]> = [
  ["SCHEDULED", "SCHEDULED"],
  ["TIMED", "TIMED"],
  ["IN_PLAY", "LIVE"],
  ["PAUSED", "HALFTIME"],
  ["FINISHED", "FINISHED"],
  ["SUSPENDED", "SUSPENDED"],
  ["POSTPONED", "POSTPONED"],
  ["CANCELLED", "CANCELLED"],
  ["AWARDED", "FINISHED"],
]

test("maps every known football-data.org status", () => {
  for (const [input, expected] of known) {
    const r = mapFixtureStatus(input)
    assert.equal(r.recognized, true, `status "${input}" should be recognized`)
    assert.equal(r.status, expected, `status "${input}" should map to ${expected}`)
    assert.equal(r.rawStatus, input)
  }
})

test("is case-insensitive and trims surrounding whitespace", () => {
  assert.equal(mapFixtureStatus("in_play").status, "LIVE")
  assert.equal(mapFixtureStatus(" finished ").status, "FINISHED")
  assert.equal(mapFixtureStatus("AWARDED").status, "FINISHED")
})

test("unknown status returns recognized:false with a null status", () => {
  assert.deepEqual(mapFixtureStatus("SOMETHING_NEW"), {
    recognized: false,
    status: null,
    rawStatus: "SOMETHING_NEW",
  })
})

test("null, undefined and empty input are unrecognized with an empty rawStatus", () => {
  const expected = { recognized: false, status: null, rawStatus: "" }
  assert.deepEqual(mapFixtureStatus(null), expected)
  assert.deepEqual(mapFixtureStatus(undefined), expected)
  assert.deepEqual(mapFixtureStatus(""), expected)
  assert.deepEqual(mapFixtureStatus("   "), expected)
})

test("never coerces unknown input to SCHEDULED or FINISHED", () => {
  const r = mapFixtureStatus("NOT_A_REAL_STATUS")
  assert.notEqual(r.status, "SCHEDULED")
  assert.notEqual(r.status, "FINISHED")
  assert.equal(r.status, null)
})
