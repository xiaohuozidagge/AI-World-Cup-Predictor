import { teams, getAllGroups } from "@/data/teams"

export interface GroupValidation {
  valid: boolean
  totalTeams: number
  totalGroups: number
  groups: { group: string; count: number; valid: boolean }[]
  errors: string[]
}

export function validateGroups(): GroupValidation {
  const errors: string[] = []
  const allGroups = getAllGroups()
  const groupMap = new Map<string, typeof teams>()

  for (const team of teams) {
    const existing = groupMap.get(team.group) || []
    existing.push(team)
    groupMap.set(team.group, existing)
  }

  const groupDetails: GroupValidation["groups"] = []
  for (const group of allGroups) {
    const groupTeams = groupMap.get(group) || []
    groupDetails.push({
      group,
      count: groupTeams.length,
      valid: groupTeams.length === 4,
    })
  }

  // Check exactly 12 groups
  if (allGroups.length !== 12) {
    errors.push(`Expected 12 groups, found ${allGroups.length}`)
  }

  // Check each group has exactly 4 teams
  for (const g of groupDetails) {
    if (g.count !== 4) {
      errors.push(`Group ${g.group} has ${g.count} teams (expected 4)`)
    }
  }

  // Check no duplicate team slugs
  const slugs = teams.map(t => t.slug)
  const uniqueSlugs = new Set(slugs)
  if (uniqueSlugs.size !== slugs.length) {
    const duplicates = slugs.filter((s, i) => slugs.indexOf(s) !== i)
    errors.push(`Duplicate team slugs: ${[...new Set(duplicates)].join(", ")}`)
  }

  // Check no duplicate team names
  const names = teams.map(t => t.name)
  const uniqueNames = new Set(names)
  if (uniqueNames.size !== names.length) {
    const duplicates = names.filter((n, i) => names.indexOf(n) !== i)
    errors.push(`Duplicate team names: ${[...new Set(duplicates)].join(", ")}`)
  }

  // Check total = 48
  const total = teams.length
  if (total !== 48) {
    errors.push(`Expected 48 teams, found ${total}`)
  }

  return {
    valid: errors.length === 0,
    totalTeams: total,
    totalGroups: allGroups.length,
    groups: groupDetails,
    errors,
  }
}
