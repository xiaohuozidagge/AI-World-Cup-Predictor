import { readFileSync, readdirSync, statSync } from "fs"
import { join, extname } from "path"

const OLD_DOMAIN = "aiworldcuppredictions.com"
const NEW_DOMAIN = "aipredictor.world"
const SOURCE_EXTS = [".ts", ".tsx", ".js", ".mjs", ".json", ".css"]

const SKIP_DIRS = new Set(["node_modules", ".next", ".git"])
const SKIP_FILES = new Set(["package-lock.json"])

const errors: string[] = []

function walk(dir: string) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) { walk(full); continue }
    if (SKIP_FILES.has(entry)) continue
    if (!SOURCE_EXTS.includes(extname(entry))) continue

    const content = readFileSync(full, "utf-8")
    const lines = content.split("\n")

    // Check for old domain
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(OLD_DOMAIN)) {
        errors.push(`${full}:${i + 1} — OLD DOMAIN "${OLD_DOMAIN}"`)
      }
    }

    // Check for localhost in metadata/URL configs (not comments)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.includes("//")) continue
      if (line.includes("localhost") && (line.includes("url") || line.includes("URL") || line.includes("baseUrl") || line.includes("SITE"))) {
        errors.push(`${full}:${i + 1} — LOCALHOST in URL context`)
      }
    }

    // Check for vercel.app references
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("vercel.app")) {
        errors.push(`${full}:${i + 1} — VERCEL.APP reference`)
      }
    }
  }
}

walk(process.cwd())

// Verify specific files
const files = {
  sitemap: "app/sitemap.ts",
  robots: "app/robots.ts",
  constants: "lib/constants.ts",
  jsonld: "lib/jsonld.tsx",
}

for (const [name, path] of Object.entries(files)) {
  try {
    const content = readFileSync(path, "utf-8")
    if (!content.includes(NEW_DOMAIN)) {
      errors.push(`${path} — Missing NEW DOMAIN "${NEW_DOMAIN}"`)
    }
  } catch {
    errors.push(`${path} — FILE NOT FOUND`)
  }
}

console.log(`Domain: ${NEW_DOMAIN}`)
if (errors.length) {
  console.log(`\n❌ ${errors.length} issues found:`)
  errors.forEach(e => console.log(`  - ${e}`))
  process.exit(1)
} else {
  console.log(`✅ All checks passed — no old domain, no localhost, no vercel.app references`)
}
