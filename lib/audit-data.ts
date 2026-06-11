import { teams, getAllGroups } from "@/data/teams"
import { matches, getGroupStageMatches } from "@/data/matches"
import { predictions } from "@/data/predictions"

const errors: string[] = []

// 1. Teams
const groups = getAllGroups()
const EXPECTED_GROUPS = ["A","B","C","D","E","F","G","H","I","J","K","L"]

if (teams.length !== 48) errors.push(`TEAMS: Expected 48 teams, got ${teams.length}`)
for (const g of EXPECTED_GROUPS) {
  const c = teams.filter(t => t.group === g).length
  if (c !== 4) errors.push(`TEAMS: Group ${g} has ${c} teams (expected 4)`)
}
const dupSlugs = teams.map(t => t.slug).filter((s, i, a) => a.indexOf(s) !== i)
if (dupSlugs.length) errors.push(`TEAMS: Duplicate slugs: ${[...new Set(dupSlugs)].join(", ")}`)
const dupNames = teams.map(t => t.name).filter((n, i, a) => a.indexOf(n) !== i)
if (dupNames.length) errors.push(`TEAMS: Duplicate names: ${[...new Set(dupNames)].join(", ")}`)

// 2. Matches
const gs = getGroupStageMatches()
const ko = matches.filter(m => m.stage !== "Group Stage")

if (matches.length !== 104) errors.push(`MATCHES: Expected 104 total, got ${matches.length}`)
if (gs.length !== 72) errors.push(`MATCHES: Expected 72 group-stage, got ${gs.length}`)
if (ko.length !== 32) errors.push(`MATCHES: Expected 32 knockout, got ${ko.length}`)

const dupNums = matches.map(m => m.matchNumber).filter((n, i, a) => a.indexOf(n) !== i)
if (dupNums.length) errors.push(`MATCHES: Duplicate match numbers: ${dupNums.join(", ")}`)

// Group teams vs declared group
for (const m of gs) {
  const ta = teams.find(t => t.name === m.teamA)
  const tb = teams.find(t => t.name === m.teamB)
  if (!ta) errors.push(`MATCHES: "${m.teamA}" (match #${m.matchNumber}) not found in teams.ts`)
  if (!tb) errors.push(`MATCHES: "${m.teamB}" (match #${m.matchNumber}) not found in teams.ts`)
  if (ta && ta.group !== m.group) errors.push(`MATCHES: ${m.teamA} (Group ${ta.group}) in match #${m.matchNumber} under Group ${m.group}`)
  if (tb && tb.group !== m.group) errors.push(`MATCHES: ${m.teamB} (Group ${tb.group}) in match #${m.matchNumber} under Group ${m.group}`)
}

// Each team: exactly 3 group-stage matches
for (const t of teams) {
  const c = gs.filter(m => m.teamA === t.name || m.teamB === t.name).length
  if (c !== 3) errors.push(`MATCHES: ${t.name} (G${t.group}) has ${c} group matches (expected 3)`)
}

// Each group: exactly 6 matches + correct round-robin
for (const g of EXPECTED_GROUPS) {
  const gm = gs.filter(m => m.group === g)
  if (gm.length !== 6) errors.push(`MATCHES: Group ${g} has ${gm.length} matches (expected 6)`)
  const groupTeams = teams.filter(t => t.group === g)
  const matchups = gm.map(m => [m.teamA, m.teamB].sort().join(" vs "))
  for (let i = 0; i < groupTeams.length; i++) {
    for (let j = i + 1; j < groupTeams.length; j++) {
      const expected = [groupTeams[i].name, groupTeams[j].name].sort().join(" vs ")
      if (!matchups.includes(expected)) errors.push(`MATCHES: Group ${g} missing ${expected}`)
    }
  }
}

// predictionSlug uniqueness
const ps = matches.filter(m => m.predictionSlug).map(m => m.predictionSlug!)
const dupPs = ps.filter((s, i, a) => a.indexOf(s) !== i)
if (dupPs.length) errors.push(`MATCHES: Duplicate predictionSlug: ${[...new Set(dupPs)].join(", ")}`)

// Knockout must NOT have predictionSlug
const koWithPred = ko.filter(m => m.predictionSlug)
if (koWithPred.length) errors.push(`MATCHES: ${koWithPred.length} knockout matches have predictionSlug`)

// 3. Predictions
for (const p of predictions) {
  const m = matches.find(x => x.predictionSlug === p.matchSlug)
  if (!m) errors.push(`PREDICTIONS: matchSlug "${p.matchSlug}" not found in matches.ts`)
  else if (m.stage !== "Group Stage") errors.push(`PREDICTIONS: "${p.matchSlug}" is knockout (should be group-stage only)`)
}

// Output
console.log(`Teams: ${teams.length} | Groups: ${groups.length} | Matches: ${matches.length} (${gs.length}+${ko.length}) | Predictions: ${predictions.length}`)
if (errors.length) {
  console.log(`\nFAILED — ${errors.length} errors:`)
  errors.forEach(e => console.log(`  ❌ ${e}`))
  process.exit(1)
} else {
  console.log(`✅ ALL CHECKS PASSED`)
}
