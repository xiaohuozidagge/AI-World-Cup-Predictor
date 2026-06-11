// Deterministic prediction engine — same input always produces identical output.
// Used by Simulator and as fallback when match predictions are missing from data.

function hashStr(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

function variant(hash: number, index: number, min: number, max: number): number {
  const v = ((hash * (index + 1) * 2654435761) >>> 0) % (max - min + 1)
  return min + v
}

export interface GeneratedPrediction {
  teamAWinProbability: number
  drawProbability: number
  teamBWinProbability: number
  predictedScore: string
  analysis: string
  teamForm: { teamA: string; teamB: string }
  keyPlayers: { teamA: string[]; teamB: string[] }
  faq: { question: string; answer: string }[]
}

export function generatePrediction(
  teamA: string,
  teamB: string,
  rankingA: number,
  rankingB: number,
  stage: string,
  group: string | undefined,
  date: string,
  stadium: string,
  city: string,
  playersA: string[],
  playersB: string[],
): GeneratedPrediction {
  const h = hashStr([teamA, teamB].sort().join("-"))
  const rankingDiff = rankingB - rankingA
  const baseAProb = 50 + (rankingDiff > 0 ? Math.min(rankingDiff * 2, 35) : Math.max(rankingDiff * 2, -35))
  const jitter = variant(h, 0, -5, 5)
  const aProb = Math.round(Math.max(10, Math.min(80, baseAProb + jitter)))
  const maxDraw = Math.max(10, Math.min(30, 30 - Math.abs(rankingDiff)))
  const drawProb = Math.round(10 + variant(h, 1, 0, maxDraw - 10))
  const bProb = 100 - aProb - drawProb

  const s1 = variant(h, 2, 0, 3)
  const s2 = variant(h, 3, 0, 3)
  let score: string
  if (aProb > 55) score = `${Math.max(s1, 2)}-${Math.min(s2, 1)}`
  else if (bProb > 55) score = `${Math.min(s1, 1)}-${Math.max(s2, 2)}`
  else score = `${Math.max(s1, 1)}-${Math.max(s2, 1)}`

  const analysis = generateAnalysis(teamA, teamB, aProb, rankingA, rankingB, stage)
  const form = generateForm(teamA, teamB, aProb, bProb)
  const faqs = generateFAQ(teamA, teamB, aProb, drawProb, score, date, stadium)

  return {
    teamAWinProbability: aProb,
    drawProbability: drawProb,
    teamBWinProbability: bProb,
    predictedScore: score,
    analysis,
    teamForm: form,
    keyPlayers: { teamA: playersA.slice(0, 2), teamB: playersB.slice(0, 2) },
    faq: faqs,
  }
}

function generateAnalysis(
  teamA: string, teamB: string, aProb: number,
  rankingA: number, rankingB: number, stage: string,
): string {
  const stageContext = stage === "Final"
    ? "In the World Cup final, pressure and experience often matter more than form. "
    : stage === "Semi-final"
    ? "At this stage of the tournament, margins are razor-thin. "
    : stage === "Quarter-final"
    ? "Knockout football demands clinical finishing and defensive discipline. "
    : stage === "Round of 32"
    ? "The knockout rounds begin — there are no second chances from here. "
    : "Group stage matches set the tone for the tournament. "

  if (aProb > 60) {
    return `${stageContext}${teamA} enters as the clear favorite with a superior FIFA ranking (#${rankingA} vs #${rankingB}). ${teamA} is expected to control possession and generate more scoring chances from open play. ${teamB} will need to be compact defensively and clinical on the counter-attack to have a realistic chance of an upset. Set pieces could be ${teamB}'s best route to goal.`
  } else if (aProb > 45) {
    return `${stageContext}This is projected to be a tightly contested match. ${teamA} holds a marginal edge (FIFA #${rankingA} vs #${rankingB}), but the underlying numbers suggest the match could swing either way. The key battle will be in midfield — whichever side controls the tempo is likely to create the decisive chance. A single moment of brilliance or a defensive lapse could prove the difference.`
  } else {
    return `${stageContext}${teamB} is favored heading into this fixture, leveraging a higher FIFA ranking (#${rankingB} vs #${rankingA}) and stronger overall squad depth. ${teamA} will need a near-perfect defensive performance and must capitalize on whatever limited opportunities come their way. If ${teamA} can score first, the dynamics of the match could shift significantly.`
  }
}

function generateForm(teamA: string, teamB: string, aProb: number, bProb: number) {
  const forms = ["WWWLW", "WWWDW", "WWWWD", "WWLWD", "WDLWW", "WDWWL", "WWWDL", "WDWLW"]
  const h = hashStr(teamA + teamB)
  const formA = forms[variant(h, 4, 0, forms.length - 1)]
  const formB = forms[variant(h, 5, 0, forms.length - 1)]

  const aStrong = aProb > 50
  const bStrong = bProb > 50

  return {
    teamA: aStrong
      ? `${formA} - Strong recent form with consistent performances. Scoring average above 2.0 goals per match in recent fixtures.`
      : `${formA} - Mixed recent results. Capable of strong performances but consistency has been an issue in the build-up.`,
    teamB: bStrong
      ? `${formB} - Impressive run of results heading into this fixture. Defensive record has been particularly solid.`
      : `${formB} - Inconsistent form in recent matches. Will need to raise their level significantly for this contest.`,
  }
}

function generateFAQ(
  teamA: string, teamB: string,
  aProb: number, drawProb: number,
  score: string, date: string, stadium: string,
) {
  const matchDate = new Date(date)
  return [
    {
      question: `Who is predicted to win ${teamA} vs ${teamB}?`,
      answer: `${teamA} has a ${aProb}% win probability, with a ${drawProb}% chance of a draw. Our AI model projects a ${score} final score.`,
    },
    {
      question: `When is ${teamA} vs ${teamB}?`,
      answer: `The match is scheduled for ${matchDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} at ${stadium}.`,
    },
    {
      question: `What are the key factors for ${teamA} vs ${teamB}?`,
      answer: `Midfield control and set-piece efficiency are projected as the decisive factors. ${aProb > 50 ? teamA : teamB}'s FIFA ranking advantage gives them an edge, but knockout tournament football often defies the numbers.`,
    },
  ]
}
