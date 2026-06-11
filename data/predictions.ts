export interface MatchPrediction {
  matchSlug: string
  teamAWinProbability: number
  drawProbability: number
  teamBWinProbability: number
  predictedScore: string
  analysis: string
  teamForm: { teamA: string; teamB: string }
  keyPlayers: { teamA: string[]; teamB: string[] }
  faq: { question: string; answer: string }[]
}

// Key matches with hand-written analysis. All other matches use the deterministic
// prediction engine fallback at render time, ensuring every match page has content
// even without a hand-written entry here.
export const predictions: MatchPrediction[] = [
  // ================================================================
  // OPENING MATCH
  // ================================================================
  {
    matchSlug: "mexico-vs-south-africa-prediction",
    teamAWinProbability: 58, drawProbability: 24, teamBWinProbability: 18,
    predictedScore: "2-0",
    analysis: "The opening match of World Cup 2026 at the legendary Estadio Azteca. Mexico's seven consecutive Round of 16 appearances speak to their group stage mastery — they know how to navigate tournament openers. South Africa returns to the World Cup for the first time since hosting in 2010 with a squad that exceeded expectations at AFCON 2024. The Azteca atmosphere will be overwhelming for any visitor, and Mexico's experience in managing high-pressure home matches should prove decisive. Santiago Giménez's clinical finishing could be the difference in a match where chances may be limited.",
    teamForm: { teamA: "WWLWD - Giménez has 4 goals in his last 6 Mexico appearances. Mexico's home record at Azteca in competitive matches is formidable.", teamB: "WDLWD - South Africa exceeded expectations in AFCON 2024. Foster's pace on the counter is their most dangerous weapon." },
    keyPlayers: { teamA: ["Santiago Giménez", "Edson Álvarez"], teamB: ["Percy Tau", "Lyle Foster"] },
    faq: [
      { question: "Who wins Mexico vs South Africa opening match?", answer: "Mexico is favored at 58% win probability. The Azteca atmosphere and Mexico's tournament experience give them a significant edge in the opening fixture." },
      { question: "When is the World Cup 2026 opening match?", answer: "June 11, 2026 at the historic Estadio Azteca in Mexico City — the first stadium to host three World Cup opening matches." },
      { question: "Has South Africa ever played Mexico in a World Cup?", answer: "Yes — South Africa drew 1-1 with Mexico in the 2010 World Cup opening match in Johannesburg. Siphiwe Tshabalala scored the opening goal, one of the most iconic in World Cup history." },
    ]
  },
  // ================================================================
  // MARQUEE GROUP MATCHES
  // ================================================================
  {
    matchSlug: "spain-vs-uruguay-prediction",
    teamAWinProbability: 48, drawProbability: 28, teamBWinProbability: 24,
    predictedScore: "2-1",
    analysis: "Spain's positional play against Bielsa's chaotic pressing machine — one of the most tactically fascinating group stage matchups. Spain's young wingers Yamal and Williams have the pace to exploit spaces behind Uruguay's high defensive line. But Uruguay's pressing under Bielsa is designed to disrupt the exact kind of patient build-up Spain relies on. Valverde versus Pedri in midfield could decide the match. Spain's technical superiority gives them a narrow edge, but Uruguay's intensity means this could swing either way.",
    teamForm: { teamA: "WWWLW - Yamal has been Spain's primary creative force at 17. Spain averages 67% possession since winning Euro 2024.", teamB: "WWWLW - Valverde covers more ground per 90 than any midfielder at the tournament. Uruguay's pressing forces turnovers in dangerous areas." },
    keyPlayers: { teamA: ["Lamine Yamal", "Rodri"], teamB: ["Federico Valverde", "Darwin Núñez"] },
    faq: [
      { question: "Spain vs Uruguay prediction?", answer: "Spain holds a narrow 48% edge in this clash of contrasting football philosophies. Uruguay's pressing under Bielsa makes them dangerous underdogs." },
      { question: "Have Spain and Uruguay met in a World Cup before?", answer: "Never — this is their first World Cup meeting. Their most recent encounter was a 2013 Confederations Cup match Spain won 2-1." },
    ]
  },
  {
    matchSlug: "france-vs-senegal-prediction",
    teamAWinProbability: 62, drawProbability: 22, teamBWinProbability: 16,
    predictedScore: "2-0",
    analysis: "A rematch of the 2002 World Cup opening match — one of the biggest upsets in tournament history when Senegal beat the defending champions France 1-0. Twenty-four years later, the footballing relationship between the two nations remains deep: most of Senegal's squad plays in Ligue 1 or was developed in French academies. France's attacking firepower through Mbappé and Dembélé is overwhelming, but Senegal's physical midfield and Mané's big-match experience keep this more competitive than the rankings suggest.",
    teamForm: { teamA: "WWLWW - Mbappé has 12 World Cup goals and is chasing Klose's record of 16. France's squad depth is the tournament's best.", teamB: "WWLWD - Senegal's AFCON 2024 triumph showed their tournament pedigree. Mané remains one of Africa's greatest-ever players." },
    keyPlayers: { teamA: ["Kylian Mbappé", "William Saliba"], teamB: ["Sadio Mané", "Kalidou Koulibaly"] },
    faq: [
      { question: "France vs Senegal prediction?", answer: "France is favored at 62%, but Senegal's 2002 upset of the same opponent proves anything is possible. France's attacking depth is the key differentiator." },
      { question: "What happened in the 2002 France vs Senegal match?", answer: "Senegal, playing their first-ever World Cup match, beat defending champions France 1-0 with a goal from Papa Bouba Diop. It remains one of the greatest upsets in World Cup history." },
    ]
  },
  {
    matchSlug: "argentina-vs-austria-prediction",
    teamAWinProbability: 55, drawProbability: 26, teamBWinProbability: 19,
    predictedScore: "2-1",
    analysis: "Messi's Argentina meets Rangnick's pressing machine. Austria's high-intensity system under Rangnick has transformed them into one of Europe's most tactically distinctive sides — they will not sit back and defend. But Argentina's tournament experience is unmatched: this core has won three consecutive major tournaments. Alaba's defensive leadership against Messi's roaming creativity is the individual matchup of the match. Austria's pressing will create moments, but Argentina's composure under pressure should ultimately prevail.",
    teamForm: { teamA: "WWWDW - Messi in tournament football remains the ultimate difference-maker. Argentina's defense has kept clean sheets in 5 of their last 7 competitive matches.", teamB: "WWLWD - Rangnick's system requires peak physical output. Sabitzer and Baumgartner's pressing from midfield sets the tone." },
    keyPlayers: { teamA: ["Lionel Messi", "Enzo Fernández"], teamB: ["David Alaba", "Marcel Sabitzer"] },
    faq: [
      { question: "Argentina vs Austria prediction?", answer: "Argentina is favored at 55%, but Austria's pressing under Rangnick makes this far from a routine group match. Austria has the tactical identity to trouble any opponent." },
      { question: "When is Argentina vs Austria World Cup 2026?", answer: "June 21, 2026 at AT&T Stadium in Arlington, Texas — Argentina's second group match in Group J." },
    ]
  },
  {
    matchSlug: "england-vs-croatia-prediction",
    teamAWinProbability: 52, drawProbability: 27, teamBWinProbability: 21,
    predictedScore: "2-1",
    analysis: "England's Euro 2020 semifinal win over Croatia feels distant now — both squads have evolved significantly. Bellingham's emergence as the world's best midfielder gives England a dimension they've never had. Croatia's midfield mastery through Modrić remains their identity, but at 40, covering ground against England's athletic midfield is a growing challenge. This is likely Modrić's final World Cup group stage match, and Croatia's tournament mentality — second and third in the last two World Cups — cannot be dismissed.",
    teamForm: { teamA: "WWWWD - Bellingham has been England's best player for 18 months. Kane's tournament record is elite: 8 World Cup goals, 7 Euro goals.", teamB: "WLWLD - Modrić still dictates tempo at the highest level. Croatia's tournament resilience defies all logic for a nation of under 4 million." },
    keyPlayers: { teamA: ["Jude Bellingham", "Harry Kane"], teamB: ["Luka Modrić", "Joško Gvardiol"] },
    faq: [
      { question: "England vs Croatia prediction?", answer: "England is favored at 52% — Bellingham's athletic advantage in midfield is the key factor. But Croatia has reached the semifinals in consecutive World Cups and cannot be underestimated." },
      { question: "What happened in England vs Croatia 2018 semifinal?", answer: "Croatia won 2-1 after extra time with goals from Perišić and Mandžukić. England took an early lead through Trippier but couldn't hold on. Croatia advanced to their first-ever World Cup final." },
    ]
  },
  {
    matchSlug: "brazil-vs-morocco-prediction",
    teamAWinProbability: 55, drawProbability: 26, teamBWinProbability: 19,
    predictedScore: "2-1",
    analysis: "Brazil's attacking depth meets the best defensive structure in African football. Morocco's 2022 semifinal run was no fluke — Regragui's system conceded only one opposition goal in the entire knockout stage before the semifinals. But Brazil's front four of Vinicius Jr., Rodrygo, Endrick, and Raphinha is the most productive attacking unit in world football. Hakimi's defensive discipline against Vinicius on Morocco's right flank will be the decisive individual battle.",
    teamForm: { teamA: "WWWWL - Vinicius Jr. has become Brazil's talisman. The Seleção enters 2026 determined to end a 24-year World Cup drought.", teamB: "WWLWW - Morocco's defense is elite. The addition of Brahim Díaz adds creative firepower that was missing in Qatar." },
    keyPlayers: { teamA: ["Vinicius Jr.", "Alisson Becker"], teamB: ["Achraf Hakimi", "Brahim Díaz"] },
    faq: [
      { question: "Brazil vs Morocco prediction?", answer: "Brazil holds a 55% edge over Morocco. Brazil's attacking depth is overwhelming, but Morocco's defensive organization is among the best at the tournament." },
      { question: "Have Brazil and Morocco played in a World Cup before?", answer: "They've never met in a competitive match. Brazil's only friendly against Morocco was a 2-1 win in 2023." },
    ]
  },
  {
    matchSlug: "portugal-vs-colombia-prediction",
    teamAWinProbability: 47, drawProbability: 28, teamBWinProbability: 25,
    predictedScore: "1-1",
    analysis: "Ronaldo's final World Cup group stage versus Colombia's historic unbeaten run — this has all the ingredients of a classic. Portugal's attacking variety through Fernandes and Leão will test Colombia's defensive organization, but Luis Díaz is the most in-form winger at the tournament and can trouble any defense. The draw probability at 28% reflects how evenly matched these styles are. A single moment — a Ronaldo header, a Díaz solo run — could decide a match that feels destined for the knife's edge.",
    teamForm: { teamA: "WWWLW - Ronaldo's movement in the box remains elite even at 41. Portugal's squad depth allows game-changing substitutions.", teamB: "WWWWD - Colombia's 24-match unbeaten run is the longest active streak in international football. Díaz has been the catalyst." },
    keyPlayers: { teamA: ["Cristiano Ronaldo", "Rafael Leão"], teamB: ["Luis Díaz", "James Rodríguez"] },
    faq: [
      { question: "Portugal vs Colombia prediction?", answer: "This is one of the tightest group stage matches — Portugal at 47% vs Colombia at 25%, with a 28% chance of a draw. A draw would not surprise anyone." },
      { question: "Has Colombia ever beaten Portugal?", answer: "They've only met twice — both friendlies. Portugal won the most recent meeting 3-0 in 2018." },
    ]
  },
]

export function getPredictionBySlug(slug: string): MatchPrediction | undefined {
  return predictions.find((p) => p.matchSlug === slug)
}

export function getLatestPredictions(count: number = 6): MatchPrediction[] {
  return predictions.slice(0, count)
}
