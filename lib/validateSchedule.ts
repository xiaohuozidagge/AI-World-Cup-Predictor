import { matches, getGroupStageMatches } from "@/data/matches"
import { teams, getAllGroups } from "@/data/teams"

export interface ScheduleValidation {
  valid: boolean
  totalMatches: number
  groupStageMatches: number
  knockoutMatches: number
  groups: { group: string; count: number; valid: boolean }[]
  errors: string[]
}

export function validateSchedule(): ScheduleValidation {
  const errors: string[] = []
  const groupStage = getGroupStageMatches()

  // Total matches = 104
  if (matches.length !== 104) {
    errors.push(`Expected 104 total matches, found ${matches.length}`)
  }

  // Group stage = 72
  if (groupStage.length !== 72) {
    errors.push(`Expected 72 group stage matches, found ${groupStage.length}`)
  }

  // Knockout matches
  const knockoutCount = matches.length - groupStage.length
  if (knockoutCount !== 32) {
    errors.push(`Expected 32 knockout matches, found ${knockoutCount}`)
  }

  // 12 groups, each with 6 matches
  const allGroups = getAllGroups()
  if (allGroups.length !== 12) {
    errors.push(`Expected 12 groups, found ${allGroups.length}`)
  }

  const groupDetails: ScheduleValidation["groups"] = []
  for (const group of allGroups) {
    const count = groupStage.filter(m => m.group === group).length
    groupDetails.push({ group, count, valid: count === 6 })
    if (count !== 6) {
      errors.push(`Group ${group} has ${count} group-stage matches (expected 6)`)
    }
  }

  // Each team has exactly 3 group-stage matches
  for (const team of teams) {
    const teamMatches = groupStage.filter(
      m => m.teamA === team.name || m.teamB === team.name
    )
    if (teamMatches.length !== 3) {
      errors.push(`${team.name} has ${teamMatches.length} group-stage matches (expected 3)`)
    }
  }

  // No duplicate match slugs
  const slugs = matches.map(m => m.slug)
  const uniqueSlugs = new Set(slugs)
  if (uniqueSlugs.size !== slugs.length) {
    const duplicates = slugs.filter((s, i) => slugs.indexOf(s) !== i)
    errors.push(`Duplicate match slugs: ${[...new Set(duplicates)].join(", ")}`)
  }

  // No duplicate match numbers
  const nums = matches.map(m => m.matchNumber)
  const uniqueNums = new Set(nums)
  if (uniqueNums.size !== nums.length) {
    errors.push("Duplicate match numbers found")
  }

  // No group-stage match has missing team names
  for (const m of groupStage) {
    if (!m.teamA || !m.teamB || m.teamA.includes("Winner") || m.teamB.includes("Winner") || m.teamA.includes("Group") || m.teamB.includes("Group")) {
      errors.push(`Group-stage match ${m.matchNumber} has placeholder team names: ${m.teamA} vs ${m.teamB}`)
    }
  }

  // Knockout placeholder matches do NOT have predictionSlug
  for (const m of matches) {
    if (m.stage !== "Group Stage" && m.predictionSlug) {
      errors.push(`Knockout match ${m.matchNumber} has predictionSlug but should not`)
    }
  }

  // Group-stage matches DO have predictionSlug
  for (const m of groupStage) {
    if (!m.predictionSlug) {
      errors.push(`Group-stage match ${m.matchNumber} is missing predictionSlug`)
    }
  }

  return {
    valid: errors.length === 0,
    totalMatches: matches.length,
    groupStageMatches: groupStage.length,
    knockoutMatches: knockoutCount,
    groups: groupDetails,
    errors,
  }
}
