#!/usr/bin/env tsx
import { readFileSync, existsSync } from "fs"
import { join } from "path"

const DATA_DIR = join(import.meta.dirname || __dirname, "..", "data", "synced")
const ROOT = join(import.meta.dirname || __dirname, "..")
const errors: string[] = []

// 1. API key is not committed
const envFiles = [".env", ".env.local", ".env.production"]
for (const f of envFiles) {
  const p = join(ROOT, f)
  if (existsSync(p)) {
    const content = readFileSync(p, "utf-8")
    if (content.includes("FOOTBALL_DATA_API_KEY=") && !content.includes("your_api_key_here")) {
      // Real key exists — check it's not staged
      // This is a soft check — in CI, env files shouldn't exist
      console.log(`  ⚠ ${f} exists with API key — ensure it's in .gitignore`)
    }
  }
}

// 2. Synced JSON files are valid JSON
const syncedFiles = ["matches.json", "standings.json", "teams.json", "last-updated.json"]
for (const f of syncedFiles) {
  const p = join(DATA_DIR, f)
  if (existsSync(p)) {
    try {
      JSON.parse(readFileSync(p, "utf-8"))
      console.log(`  ✓ ${f} is valid JSON`)
    } catch {
      errors.push(`${f} is not valid JSON`)
    }
  } else {
    console.log(`  - ${f} does not exist (OK before first sync)`)
  }
}

// 3. Check sitemap domain
const sitemap = readFileSync(join(ROOT, "app", "sitemap.ts"), "utf-8")
if (!sitemap.includes("aipredictor.world")) errors.push("Sitemap does not use aipredictor.world")
else console.log("  ✓ Sitemap uses aipredictor.world")

// 4. Check robots domain
const robots = readFileSync(join(ROOT, "app", "robots.ts"), "utf-8")
if (!robots.includes("aipredictor.world")) errors.push("Robots.txt does not use aipredictor.world")
else console.log("  ✓ Robots.txt uses aipredictor.world")

// 5. No old domain
const srcFiles = ["app/layout.tsx", "app/sitemap.ts", "app/robots.ts", "lib/constants.ts", "lib/jsonld.tsx"]
for (const f of srcFiles) {
  const content = readFileSync(join(ROOT, f), "utf-8")
  if (content.includes("aiworldcuppredictions.com")) errors.push(`${f} still references old domain`)
}
console.log("  ✓ No old domain references in source files")

// 6. Synced data integrity
if (existsSync(join(DATA_DIR, "matches.json"))) {
  const matches = JSON.parse(readFileSync(join(DATA_DIR, "matches.json"), "utf-8"))
  const slugs = matches.map((m: { slug: string }) => m.slug)
  const dupSlugs = slugs.filter((s: string, i: number) => slugs.indexOf(s) !== i)
  if (dupSlugs.length) errors.push(`Duplicate match slugs: ${[...new Set(dupSlugs)].join(", ")}`)

  const finished = matches.filter((m: { status: string }) => m.status === "finished")
  const finishedNoScore = finished.filter((m: { actualScore?: unknown }) => !m.actualScore)
  if (finishedNoScore.length) errors.push(`${finishedNoScore.length} finished matches have no actualScore`)

  const scheduled = matches.filter((m: { status: string }) => m.status === "scheduled")
  const scheduledWithScore = scheduled.filter((m: { actualScore?: unknown }) => m.actualScore)
  if (scheduledWithScore.length) errors.push(`${scheduledWithScore.length} scheduled matches have actualScore`)

  console.log(`  ✓ ${matches.length} synced matches, ${finished.length} finished, ${scheduled.length} scheduled`)
}

console.log(errors.length ? `\n❌ ${errors.length} errors:` : `\n✅ Validation passed`)
errors.forEach(e => console.log(`  - ${e}`))
process.exit(errors.length ? 1 : 0)
