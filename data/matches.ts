export interface Match {
  id: number
  matchNumber: number
  stage: "Group Stage" | "Round of 32" | "Round of 16" | "Quarter-finals" | "Semi-finals" | "Third-place Play-off" | "Final"
  group?: string
  date: string
  teamA: string
  teamB: string
  stadium: string
  city: string
  slug: string
  predictionSlug?: string
}

// ====================================================================
// FIFA WORLD CUP 2026 — OFFICIAL MATCH SCHEDULE
// 104 matches: 72 group stage + 32 knockout
// Source: fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026
// ====================================================================

export const matches: Match[] = [

  // ================================================================
  // GROUP STAGE — MATCHDAY 1 (June 11–15, 2026)
  // 24 matches
  // ================================================================

  // --- June 11 (Thursday) ---
  { id: 1, matchNumber: 1, stage: "Group Stage", group: "A", date: "2026-06-11", teamA: "Mexico", teamB: "South Africa", stadium: "Estadio Azteca", city: "Mexico City", slug: "mexico-vs-south-africa", predictionSlug: "mexico-vs-south-africa-prediction" },
  { id: 2, matchNumber: 2, stage: "Group Stage", group: "A", date: "2026-06-11", teamA: "South Korea", teamB: "Czech Republic", stadium: "Estadio Akron", city: "Guadalajara", slug: "south-korea-vs-czech-republic", predictionSlug: "south-korea-vs-czech-republic-prediction" },

  // --- June 12 (Friday) ---
  { id: 3, matchNumber: 3, stage: "Group Stage", group: "B", date: "2026-06-12", teamA: "Canada", teamB: "Bosnia-Herzegovina", stadium: "BMO Field", city: "Toronto", slug: "canada-vs-bosnia-herzegovina", predictionSlug: "canada-vs-bosnia-herzegovina-prediction" },
  { id: 4, matchNumber: 4, stage: "Group Stage", group: "D", date: "2026-06-12", teamA: "United States", teamB: "Paraguay", stadium: "SoFi Stadium", city: "Inglewood", slug: "united-states-vs-paraguay", predictionSlug: "united-states-vs-paraguay-prediction" },
  { id: 5, matchNumber: 5, stage: "Group Stage", group: "H", date: "2026-06-12", teamA: "Saudi Arabia", teamB: "Uruguay", stadium: "BC Place", city: "Vancouver", slug: "saudi-arabia-vs-uruguay", predictionSlug: "saudi-arabia-vs-uruguay-prediction" },
  { id: 6, matchNumber: 6, stage: "Group Stage", group: "L", date: "2026-06-12", teamA: "Ghana", teamB: "Panama", stadium: "Levi's Stadium", city: "Santa Clara", slug: "ghana-vs-panama", predictionSlug: "ghana-vs-panama-prediction" },

  // --- June 13 (Saturday) ---
  { id: 7, matchNumber: 7, stage: "Group Stage", group: "C", date: "2026-06-13", teamA: "Haiti", teamB: "Scotland", stadium: "Gillette Stadium", city: "Foxborough", slug: "haiti-vs-scotland", predictionSlug: "haiti-vs-scotland-prediction" },
  { id: 8, matchNumber: 8, stage: "Group Stage", group: "D", date: "2026-06-13", teamA: "Australia", teamB: "Turkey", stadium: "BC Place", city: "Vancouver", slug: "australia-vs-turkey", predictionSlug: "australia-vs-turkey-prediction" },
  { id: 9, matchNumber: 9, stage: "Group Stage", group: "G", date: "2026-06-13", teamA: "Iran", teamB: "New Zealand", stadium: "Lincoln Financial Field", city: "Philadelphia", slug: "iran-vs-new-zealand", predictionSlug: "iran-vs-new-zealand-prediction" },
  { id: 10, matchNumber: 10, stage: "Group Stage", group: "I", date: "2026-06-13", teamA: "Iraq", teamB: "Norway", stadium: "Mercedes-Benz Stadium", city: "Atlanta", slug: "iraq-vs-norway", predictionSlug: "iraq-vs-norway-prediction" },

  // --- June 14 (Sunday) ---
  { id: 11, matchNumber: 11, stage: "Group Stage", group: "B", date: "2026-06-14", teamA: "Qatar", teamB: "Switzerland", stadium: "Levi's Stadium", city: "Santa Clara", slug: "qatar-vs-switzerland", predictionSlug: "qatar-vs-switzerland-prediction" },
  { id: 12, matchNumber: 12, stage: "Group Stage", group: "C", date: "2026-06-14", teamA: "Brazil", teamB: "Morocco", stadium: "MetLife Stadium", city: "East Rutherford", slug: "brazil-vs-morocco", predictionSlug: "brazil-vs-morocco-prediction" },
  { id: 13, matchNumber: 13, stage: "Group Stage", group: "F", date: "2026-06-14", teamA: "Sweden", teamB: "Tunisia", stadium: "NRG Stadium", city: "Houston", slug: "sweden-vs-tunisia", predictionSlug: "sweden-vs-tunisia-prediction" },
  { id: 14, matchNumber: 14, stage: "Group Stage", group: "J", date: "2026-06-14", teamA: "Austria", teamB: "Jordan", stadium: "Estadio BBVA", city: "Monterrey", slug: "austria-vs-jordan", predictionSlug: "austria-vs-jordan-prediction" },

  // --- June 15 (Monday) ---
  { id: 15, matchNumber: 15, stage: "Group Stage", group: "E", date: "2026-06-15", teamA: "Germany", teamB: "Curacao", stadium: "Arrowhead Stadium", city: "Kansas City", slug: "germany-vs-curacao", predictionSlug: "germany-vs-curacao-prediction" },
  { id: 16, matchNumber: 16, stage: "Group Stage", group: "E", date: "2026-06-15", teamA: "Ivory Coast", teamB: "Ecuador", stadium: "AT&T Stadium", city: "Arlington", slug: "ivory-coast-vs-ecuador", predictionSlug: "ivory-coast-vs-ecuador-prediction" },
  { id: 17, matchNumber: 17, stage: "Group Stage", group: "K", date: "2026-06-15", teamA: "Uzbekistan", teamB: "Colombia", stadium: "Hard Rock Stadium", city: "Miami Gardens", slug: "uzbekistan-vs-colombia", predictionSlug: "uzbekistan-vs-colombia-prediction" },
  { id: 18, matchNumber: 18, stage: "Group Stage", group: "F", date: "2026-06-15", teamA: "Netherlands", teamB: "Japan", stadium: "Lumen Field", city: "Seattle", slug: "netherlands-vs-japan", predictionSlug: "netherlands-vs-japan-prediction" },

  // --- June 16 (Tuesday) ---
  { id: 19, matchNumber: 19, stage: "Group Stage", group: "J", date: "2026-06-16", teamA: "Argentina", teamB: "Algeria", stadium: "Arrowhead Stadium", city: "Kansas City", slug: "argentina-vs-algeria", predictionSlug: "argentina-vs-algeria-prediction" },
  { id: 20, matchNumber: 20, stage: "Group Stage", group: "H", date: "2026-06-16", teamA: "Spain", teamB: "Cape Verde", stadium: "Hard Rock Stadium", city: "Miami Gardens", slug: "spain-vs-cape-verde", predictionSlug: "spain-vs-cape-verde-prediction" },
  { id: 21, matchNumber: 21, stage: "Group Stage", group: "G", date: "2026-06-16", teamA: "Belgium", teamB: "Egypt", stadium: "MetLife Stadium", city: "East Rutherford", slug: "belgium-vs-egypt", predictionSlug: "belgium-vs-egypt-prediction" },
  { id: 22, matchNumber: 22, stage: "Group Stage", group: "I", date: "2026-06-16", teamA: "France", teamB: "Senegal", stadium: "SoFi Stadium", city: "Inglewood", slug: "france-vs-senegal", predictionSlug: "france-vs-senegal-prediction" },

  // ================================================================
  // GROUP STAGE — MATCHDAY 2 (June 17–22, 2026)
  // 24 matches
  // ================================================================

  // --- June 17 (Wednesday) ---
  { id: 23, matchNumber: 23, stage: "Group Stage", group: "L", date: "2026-06-17", teamA: "England", teamB: "Croatia", stadium: "AT&T Stadium", city: "Arlington", slug: "england-vs-croatia", predictionSlug: "england-vs-croatia-prediction" },
  { id: 24, matchNumber: 24, stage: "Group Stage", group: "K", date: "2026-06-17", teamA: "Portugal", teamB: "DR Congo", stadium: "NRG Stadium", city: "Houston", slug: "portugal-vs-dr-congo", predictionSlug: "portugal-vs-dr-congo-prediction" },
  { id: 25, matchNumber: 25, stage: "Group Stage", group: "A", date: "2026-06-17", teamA: "Mexico", teamB: "South Korea", stadium: "Estadio Azteca", city: "Mexico City", slug: "mexico-vs-south-korea", predictionSlug: "mexico-vs-south-korea-prediction" },
  { id: 26, matchNumber: 26, stage: "Group Stage", group: "A", date: "2026-06-17", teamA: "South Africa", teamB: "Czech Republic", stadium: "Estadio Akron", city: "Guadalajara", slug: "south-africa-vs-czech-republic", predictionSlug: "south-africa-vs-czech-republic-prediction" },

  // --- June 18 (Thursday) ---
  { id: 27, matchNumber: 27, stage: "Group Stage", group: "B", date: "2026-06-18", teamA: "Canada", teamB: "Qatar", stadium: "BMO Field", city: "Toronto", slug: "canada-vs-qatar", predictionSlug: "canada-vs-qatar-prediction" },
  { id: 28, matchNumber: 28, stage: "Group Stage", group: "B", date: "2026-06-18", teamA: "Bosnia-Herzegovina", teamB: "Switzerland", stadium: "Gillette Stadium", city: "Foxborough", slug: "bosnia-herzegovina-vs-switzerland", predictionSlug: "bosnia-herzegovina-vs-switzerland-prediction" },
  { id: 29, matchNumber: 29, stage: "Group Stage", group: "D", date: "2026-06-18", teamA: "United States", teamB: "Australia", stadium: "SoFi Stadium", city: "Inglewood", slug: "united-states-vs-australia", predictionSlug: "united-states-vs-australia-prediction" },
  { id: 30, matchNumber: 30, stage: "Group Stage", group: "D", date: "2026-06-18", teamA: "Paraguay", teamB: "Turkey", stadium: "NRG Stadium", city: "Houston", slug: "paraguay-vs-turkey", predictionSlug: "paraguay-vs-turkey-prediction" },

  // --- June 19 (Friday) ---
  { id: 31, matchNumber: 31, stage: "Group Stage", group: "C", date: "2026-06-19", teamA: "Brazil", teamB: "Haiti", stadium: "MetLife Stadium", city: "East Rutherford", slug: "brazil-vs-haiti", predictionSlug: "brazil-vs-haiti-prediction" },
  { id: 32, matchNumber: 32, stage: "Group Stage", group: "C", date: "2026-06-19", teamA: "Morocco", teamB: "Scotland", stadium: "Lincoln Financial Field", city: "Philadelphia", slug: "morocco-vs-scotland", predictionSlug: "morocco-vs-scotland-prediction" },
  { id: 33, matchNumber: 33, stage: "Group Stage", group: "E", date: "2026-06-19", teamA: "Germany", teamB: "Ivory Coast", stadium: "Arrowhead Stadium", city: "Kansas City", slug: "germany-vs-ivory-coast", predictionSlug: "germany-vs-ivory-coast-prediction" },
  { id: 34, matchNumber: 34, stage: "Group Stage", group: "E", date: "2026-06-19", teamA: "Curacao", teamB: "Ecuador", stadium: "BC Place", city: "Vancouver", slug: "curacao-vs-ecuador", predictionSlug: "curacao-vs-ecuador-prediction" },

  // --- June 20 (Saturday) ---
  { id: 35, matchNumber: 35, stage: "Group Stage", group: "H", date: "2026-06-20", teamA: "Spain", teamB: "Saudi Arabia", stadium: "Hard Rock Stadium", city: "Miami Gardens", slug: "spain-vs-saudi-arabia", predictionSlug: "spain-vs-saudi-arabia-prediction" },
  { id: 36, matchNumber: 36, stage: "Group Stage", group: "H", date: "2026-06-20", teamA: "Cape Verde", teamB: "Uruguay", stadium: "Gillette Stadium", city: "Foxborough", slug: "cape-verde-vs-uruguay", predictionSlug: "cape-verde-vs-uruguay-prediction" },
  { id: 37, matchNumber: 37, stage: "Group Stage", group: "L", date: "2026-06-20", teamA: "England", teamB: "Ghana", stadium: "AT&T Stadium", city: "Arlington", slug: "england-vs-ghana", predictionSlug: "england-vs-ghana-prediction" },
  { id: 38, matchNumber: 38, stage: "Group Stage", group: "L", date: "2026-06-20", teamA: "Croatia", teamB: "Panama", stadium: "Mercedes-Benz Stadium", city: "Atlanta", slug: "croatia-vs-panama", predictionSlug: "croatia-vs-panama-prediction" },

  // --- June 21 (Sunday) ---
  { id: 39, matchNumber: 39, stage: "Group Stage", group: "F", date: "2026-06-21", teamA: "Netherlands", teamB: "Sweden", stadium: "Lumen Field", city: "Seattle", slug: "netherlands-vs-sweden", predictionSlug: "netherlands-vs-sweden-prediction" },
  { id: 40, matchNumber: 40, stage: "Group Stage", group: "F", date: "2026-06-21", teamA: "Japan", teamB: "Tunisia", stadium: "Levi's Stadium", city: "Santa Clara", slug: "japan-vs-tunisia", predictionSlug: "japan-vs-tunisia-prediction" },
  { id: 41, matchNumber: 41, stage: "Group Stage", group: "K", date: "2026-06-21", teamA: "Portugal", teamB: "Uzbekistan", stadium: "NRG Stadium", city: "Houston", slug: "portugal-vs-uzbekistan", predictionSlug: "portugal-vs-uzbekistan-prediction" },
  { id: 42, matchNumber: 42, stage: "Group Stage", group: "K", date: "2026-06-21", teamA: "DR Congo", teamB: "Colombia", stadium: "SoFi Stadium", city: "Inglewood", slug: "dr-congo-vs-colombia", predictionSlug: "dr-congo-vs-colombia-prediction" },

  // --- June 22 (Monday) ---
  { id: 43, matchNumber: 43, stage: "Group Stage", group: "G", date: "2026-06-22", teamA: "Belgium", teamB: "Iran", stadium: "MetLife Stadium", city: "East Rutherford", slug: "belgium-vs-iran", predictionSlug: "belgium-vs-iran-prediction" },
  { id: 44, matchNumber: 44, stage: "Group Stage", group: "G", date: "2026-06-22", teamA: "Egypt", teamB: "New Zealand", stadium: "BC Place", city: "Vancouver", slug: "egypt-vs-new-zealand", predictionSlug: "egypt-vs-new-zealand-prediction" },
  { id: 45, matchNumber: 45, stage: "Group Stage", group: "I", date: "2026-06-22", teamA: "France", teamB: "Iraq", stadium: "SoFi Stadium", city: "Inglewood", slug: "france-vs-iraq", predictionSlug: "france-vs-iraq-prediction" },
  { id: 46, matchNumber: 46, stage: "Group Stage", group: "I", date: "2026-06-22", teamA: "Senegal", teamB: "Norway", stadium: "Lincoln Financial Field", city: "Philadelphia", slug: "senegal-vs-norway", predictionSlug: "senegal-vs-norway-prediction" },

  // --- June 23 (Tuesday) ---
  { id: 47, matchNumber: 47, stage: "Group Stage", group: "J", date: "2026-06-23", teamA: "Argentina", teamB: "Austria", stadium: "Arrowhead Stadium", city: "Kansas City", slug: "argentina-vs-austria", predictionSlug: "argentina-vs-austria-prediction" },
  { id: 48, matchNumber: 48, stage: "Group Stage", group: "J", date: "2026-06-23", teamA: "Algeria", teamB: "Jordan", stadium: "Estadio BBVA", city: "Monterrey", slug: "algeria-vs-jordan", predictionSlug: "algeria-vs-jordan-prediction" },

  // ================================================================
  // GROUP STAGE — MATCHDAY 3 (June 24–27, 2026)
  // 24 matches (both group matches played simultaneously)
  // ================================================================

  // --- June 24 (Wednesday) ---
  { id: 49, matchNumber: 49, stage: "Group Stage", group: "A", date: "2026-06-24", teamA: "Mexico", teamB: "Czech Republic", stadium: "Estadio Azteca", city: "Mexico City", slug: "mexico-vs-czech-republic", predictionSlug: "mexico-vs-czech-republic-prediction" },
  { id: 50, matchNumber: 50, stage: "Group Stage", group: "A", date: "2026-06-24", teamA: "South Africa", teamB: "South Korea", stadium: "Estadio Akron", city: "Guadalajara", slug: "south-africa-vs-south-korea", predictionSlug: "south-africa-vs-south-korea-prediction" },
  { id: 51, matchNumber: 51, stage: "Group Stage", group: "B", date: "2026-06-24", teamA: "Canada", teamB: "Switzerland", stadium: "BMO Field", city: "Toronto", slug: "canada-vs-switzerland", predictionSlug: "canada-vs-switzerland-prediction" },
  { id: 52, matchNumber: 52, stage: "Group Stage", group: "B", date: "2026-06-24", teamA: "Bosnia-Herzegovina", teamB: "Qatar", stadium: "Gillette Stadium", city: "Foxborough", slug: "bosnia-herzegovina-vs-qatar", predictionSlug: "bosnia-herzegovina-vs-qatar-prediction" },
  { id: 53, matchNumber: 53, stage: "Group Stage", group: "D", date: "2026-06-24", teamA: "United States", teamB: "Turkey", stadium: "SoFi Stadium", city: "Inglewood", slug: "united-states-vs-turkey", predictionSlug: "united-states-vs-turkey-prediction" },
  { id: 54, matchNumber: 54, stage: "Group Stage", group: "D", date: "2026-06-24", teamA: "Paraguay", teamB: "Australia", stadium: "NRG Stadium", city: "Houston", slug: "paraguay-vs-australia", predictionSlug: "paraguay-vs-australia-prediction" },

  // --- June 25 (Thursday) ---
  { id: 55, matchNumber: 55, stage: "Group Stage", group: "C", date: "2026-06-25", teamA: "Brazil", teamB: "Scotland", stadium: "MetLife Stadium", city: "East Rutherford", slug: "brazil-vs-scotland", predictionSlug: "brazil-vs-scotland-prediction" },
  { id: 56, matchNumber: 56, stage: "Group Stage", group: "C", date: "2026-06-25", teamA: "Morocco", teamB: "Haiti", stadium: "Lincoln Financial Field", city: "Philadelphia", slug: "morocco-vs-haiti", predictionSlug: "morocco-vs-haiti-prediction" },
  { id: 57, matchNumber: 57, stage: "Group Stage", group: "E", date: "2026-06-25", teamA: "Germany", teamB: "Ecuador", stadium: "Arrowhead Stadium", city: "Kansas City", slug: "germany-vs-ecuador", predictionSlug: "germany-vs-ecuador-prediction" },
  { id: 58, matchNumber: 58, stage: "Group Stage", group: "E", date: "2026-06-25", teamA: "Curacao", teamB: "Ivory Coast", stadium: "BC Place", city: "Vancouver", slug: "curacao-vs-ivory-coast", predictionSlug: "curacao-vs-ivory-coast-prediction" },
  { id: 59, matchNumber: 59, stage: "Group Stage", group: "H", date: "2026-06-25", teamA: "Spain", teamB: "Uruguay", stadium: "Hard Rock Stadium", city: "Miami Gardens", slug: "spain-vs-uruguay", predictionSlug: "spain-vs-uruguay-prediction" },
  { id: 60, matchNumber: 60, stage: "Group Stage", group: "H", date: "2026-06-25", teamA: "Cape Verde", teamB: "Saudi Arabia", stadium: "Estadio BBVA", city: "Monterrey", slug: "cape-verde-vs-saudi-arabia", predictionSlug: "cape-verde-vs-saudi-arabia-prediction" },

  // --- June 26 (Friday) ---
  { id: 61, matchNumber: 61, stage: "Group Stage", group: "F", date: "2026-06-26", teamA: "Netherlands", teamB: "Tunisia", stadium: "Lumen Field", city: "Seattle", slug: "netherlands-vs-tunisia", predictionSlug: "netherlands-vs-tunisia-prediction" },
  { id: 62, matchNumber: 62, stage: "Group Stage", group: "F", date: "2026-06-26", teamA: "Japan", teamB: "Sweden", stadium: "Levi's Stadium", city: "Santa Clara", slug: "japan-vs-sweden", predictionSlug: "japan-vs-sweden-prediction" },
  { id: 63, matchNumber: 63, stage: "Group Stage", group: "K", date: "2026-06-26", teamA: "Portugal", teamB: "Colombia", stadium: "AT&T Stadium", city: "Arlington", slug: "portugal-vs-colombia", predictionSlug: "portugal-vs-colombia-prediction" },
  { id: 64, matchNumber: 64, stage: "Group Stage", group: "K", date: "2026-06-26", teamA: "DR Congo", teamB: "Uzbekistan", stadium: "Mercedes-Benz Stadium", city: "Atlanta", slug: "dr-congo-vs-uzbekistan", predictionSlug: "dr-congo-vs-uzbekistan-prediction" },

  // --- June 27 (Saturday) ---
  { id: 65, matchNumber: 65, stage: "Group Stage", group: "G", date: "2026-06-27", teamA: "Belgium", teamB: "New Zealand", stadium: "MetLife Stadium", city: "East Rutherford", slug: "belgium-vs-new-zealand", predictionSlug: "belgium-vs-new-zealand-prediction" },
  { id: 66, matchNumber: 66, stage: "Group Stage", group: "G", date: "2026-06-27", teamA: "Egypt", teamB: "Iran", stadium: "SoFi Stadium", city: "Inglewood", slug: "egypt-vs-iran", predictionSlug: "egypt-vs-iran-prediction" },
  { id: 67, matchNumber: 67, stage: "Group Stage", group: "I", date: "2026-06-27", teamA: "France", teamB: "Norway", stadium: "AT&T Stadium", city: "Arlington", slug: "france-vs-norway", predictionSlug: "france-vs-norway-prediction" },
  { id: 68, matchNumber: 68, stage: "Group Stage", group: "I", date: "2026-06-27", teamA: "Senegal", teamB: "Iraq", stadium: "Arrowhead Stadium", city: "Kansas City", slug: "senegal-vs-iraq", predictionSlug: "senegal-vs-iraq-prediction" },
  { id: 69, matchNumber: 69, stage: "Group Stage", group: "J", date: "2026-06-27", teamA: "Argentina", teamB: "Jordan", stadium: "Hard Rock Stadium", city: "Miami Gardens", slug: "argentina-vs-jordan", predictionSlug: "argentina-vs-jordan-prediction" },
  { id: 70, matchNumber: 70, stage: "Group Stage", group: "J", date: "2026-06-27", teamA: "Algeria", teamB: "Austria", stadium: "Estadio BBVA", city: "Monterrey", slug: "algeria-vs-austria", predictionSlug: "algeria-vs-austria-prediction" },
  { id: 71, matchNumber: 71, stage: "Group Stage", group: "L", date: "2026-06-27", teamA: "England", teamB: "Panama", stadium: "BC Place", city: "Vancouver", slug: "england-vs-panama", predictionSlug: "england-vs-panama-prediction" },
  { id: 72, matchNumber: 72, stage: "Group Stage", group: "L", date: "2026-06-27", teamA: "Croatia", teamB: "Ghana", stadium: "Lumen Field", city: "Seattle", slug: "croatia-vs-ghana", predictionSlug: "croatia-vs-ghana-prediction" },

  // ================================================================
  // ROUND OF 32 (June 28 – July 3, 2026)
  // 16 matches — PLACEHOLDERS (teams TBD after group stage)
  // No predictionSlug — these do not generate prediction pages
  // ================================================================

  { id: 73, matchNumber: 73, stage: "Round of 32", date: "2026-06-28", teamA: "Group A Winners", teamB: "Group B Runners-up", stadium: "Estadio Azteca", city: "Mexico City", slug: "r32-1a-vs-2b" },
  { id: 74, matchNumber: 74, stage: "Round of 32", date: "2026-06-28", teamA: "Group E Winners", teamB: "Group A/B/C/D 3rd Place", stadium: "SoFi Stadium", city: "Inglewood", slug: "r32-1e-vs-3abcd" },
  { id: 75, matchNumber: 75, stage: "Round of 32", date: "2026-06-29", teamA: "Group C Winners", teamB: "Group D Runners-up", stadium: "Gillette Stadium", city: "Foxborough", slug: "r32-1c-vs-2d" },
  { id: 76, matchNumber: 76, stage: "Round of 32", date: "2026-06-29", teamA: "Group F Winners", teamB: "Group E Runners-up", stadium: "Estadio BBVA", city: "Monterrey", slug: "r32-1f-vs-2e" },
  { id: 77, matchNumber: 77, stage: "Round of 32", date: "2026-06-29", teamA: "Group I Winners", teamB: "Group J Runners-up", stadium: "MetLife Stadium", city: "East Rutherford", slug: "r32-1i-vs-2j" },
  { id: 78, matchNumber: 78, stage: "Round of 32", date: "2026-06-29", teamA: "Group K Winners", teamB: "Group L Runners-up", stadium: "AT&T Stadium", city: "Arlington", slug: "r32-1k-vs-2l" },
  { id: 79, matchNumber: 79, stage: "Round of 32", date: "2026-06-30", teamA: "Group B Winners", teamB: "Group C Runners-up", stadium: "BMO Field", city: "Toronto", slug: "r32-1b-vs-2c" },
  { id: 80, matchNumber: 80, stage: "Round of 32", date: "2026-06-30", teamA: "Group D Winners", teamB: "Group E Runners-up", stadium: "BC Place", city: "Vancouver", slug: "r32-1d-vs-2e" },
  { id: 81, matchNumber: 81, stage: "Round of 32", date: "2026-06-30", teamA: "Group G Winners", teamB: "Group H Runners-up", stadium: "Levi's Stadium", city: "Santa Clara", slug: "r32-1g-vs-2h" },
  { id: 82, matchNumber: 82, stage: "Round of 32", date: "2026-06-30", teamA: "Group H Winners", teamB: "Group G Runners-up", stadium: "Hard Rock Stadium", city: "Miami Gardens", slug: "r32-1h-vs-2g" },
  { id: 83, matchNumber: 83, stage: "Round of 32", date: "2026-07-01", teamA: "Group J Winners", teamB: "Group I Runners-up", stadium: "Arrowhead Stadium", city: "Kansas City", slug: "r32-1j-vs-2i" },
  { id: 84, matchNumber: 84, stage: "Round of 32", date: "2026-07-01", teamA: "Group L Winners", teamB: "Group K Runners-up", stadium: "NRG Stadium", city: "Houston", slug: "r32-1l-vs-2k" },
  { id: 85, matchNumber: 85, stage: "Round of 32", date: "2026-07-01", teamA: "Group A Runners-up", teamB: "Group B Winners", stadium: "Estadio Akron", city: "Guadalajara", slug: "r32-2a-vs-1b" },
  { id: 86, matchNumber: 86, stage: "Round of 32", date: "2026-07-02", teamA: "Best 3rd Place 1", teamB: "Best 3rd Place 2", stadium: "Lincoln Financial Field", city: "Philadelphia", slug: "r32-3rd-1-vs-3rd-2" },
  { id: 87, matchNumber: 87, stage: "Round of 32", date: "2026-07-02", teamA: "Best 3rd Place 3", teamB: "Best 3rd Place 4", stadium: "Mercedes-Benz Stadium", city: "Atlanta", slug: "r32-3rd-3-vs-3rd-4" },
  { id: 88, matchNumber: 88, stage: "Round of 32", date: "2026-07-03", teamA: "Best 3rd Place 5", teamB: "Best 3rd Place 6", stadium: "Lumen Field", city: "Seattle", slug: "r32-3rd-5-vs-3rd-6" },

  // ================================================================
  // ROUND OF 16 (July 4–7, 2026)
  // 8 matches — PLACEHOLDERS
  // ================================================================

  { id: 89, matchNumber: 89, stage: "Round of 16", date: "2026-07-04", teamA: "Winner Match 73", teamB: "Winner Match 74", stadium: "AT&T Stadium", city: "Arlington", slug: "r16-1" },
  { id: 90, matchNumber: 90, stage: "Round of 16", date: "2026-07-04", teamA: "Winner Match 75", teamB: "Winner Match 76", stadium: "MetLife Stadium", city: "East Rutherford", slug: "r16-2" },
  { id: 91, matchNumber: 91, stage: "Round of 16", date: "2026-07-05", teamA: "Winner Match 77", teamB: "Winner Match 78", stadium: "SoFi Stadium", city: "Inglewood", slug: "r16-3" },
  { id: 92, matchNumber: 92, stage: "Round of 16", date: "2026-07-05", teamA: "Winner Match 79", teamB: "Winner Match 80", stadium: "Hard Rock Stadium", city: "Miami Gardens", slug: "r16-4" },
  { id: 93, matchNumber: 93, stage: "Round of 16", date: "2026-07-06", teamA: "Winner Match 81", teamB: "Winner Match 82", stadium: "NRG Stadium", city: "Houston", slug: "r16-5" },
  { id: 94, matchNumber: 94, stage: "Round of 16", date: "2026-07-06", teamA: "Winner Match 83", teamB: "Winner Match 84", stadium: "Estadio Azteca", city: "Mexico City", slug: "r16-6" },
  { id: 95, matchNumber: 95, stage: "Round of 16", date: "2026-07-07", teamA: "Winner Match 85", teamB: "Winner Match 86", stadium: "Arrowhead Stadium", city: "Kansas City", slug: "r16-7" },
  { id: 96, matchNumber: 96, stage: "Round of 16", date: "2026-07-07", teamA: "Winner Match 87", teamB: "Winner Match 88", stadium: "BC Place", city: "Vancouver", slug: "r16-8" },

  // ================================================================
  // QUARTER-FINALS (July 9–11, 2026)
  // 4 matches — PLACEHOLDERS
  // ================================================================

  { id: 97, matchNumber: 97, stage: "Quarter-finals", date: "2026-07-09", teamA: "Winner Match 89", teamB: "Winner Match 90", stadium: "MetLife Stadium", city: "East Rutherford", slug: "qf-1" },
  { id: 98, matchNumber: 98, stage: "Quarter-finals", date: "2026-07-10", teamA: "Winner Match 91", teamB: "Winner Match 92", stadium: "SoFi Stadium", city: "Inglewood", slug: "qf-2" },
  { id: 99, matchNumber: 99, stage: "Quarter-finals", date: "2026-07-10", teamA: "Winner Match 93", teamB: "Winner Match 94", stadium: "AT&T Stadium", city: "Arlington", slug: "qf-3" },
  { id: 100, matchNumber: 100, stage: "Quarter-finals", date: "2026-07-11", teamA: "Winner Match 95", teamB: "Winner Match 96", stadium: "Hard Rock Stadium", city: "Miami Gardens", slug: "qf-4" },

  // ================================================================
  // SEMI-FINALS (July 14–15, 2026)
  // 2 matches — PLACEHOLDERS
  // ================================================================

  { id: 101, matchNumber: 101, stage: "Semi-finals", date: "2026-07-14", teamA: "Winner Match 97", teamB: "Winner Match 98", stadium: "AT&T Stadium", city: "Arlington", slug: "sf-1" },
  { id: 102, matchNumber: 102, stage: "Semi-finals", date: "2026-07-15", teamA: "Winner Match 99", teamB: "Winner Match 100", stadium: "Mercedes-Benz Stadium", city: "Atlanta", slug: "sf-2" },

  // ================================================================
  // THIRD-PLACE PLAY-OFF (July 18, 2026)
  // ================================================================

  { id: 103, matchNumber: 103, stage: "Third-place Play-off", date: "2026-07-18", teamA: "Loser Match 101", teamB: "Loser Match 102", stadium: "Hard Rock Stadium", city: "Miami Gardens", slug: "third-place" },

  // ================================================================
  // FINAL (July 19, 2026)
  // ================================================================

  { id: 104, matchNumber: 104, stage: "Final", date: "2026-07-19", teamA: "Winner Match 101", teamB: "Winner Match 102", stadium: "MetLife Stadium", city: "East Rutherford", slug: "final" },
]

export function getMatchBySlug(slug: string): Match | undefined {
  return matches.find((m) => m.slug === slug)
}

export function getMatchesByTeam(teamName: string): Match[] {
  return matches.filter((m) => m.teamA === teamName || m.teamB === teamName)
}

export function getMatchesByStage(stage: string): Match[] {
  return matches.filter((m) => m.stage === stage)
}

export function getGroupStageMatches(): Match[] {
  return matches.filter((m) => m.stage === "Group Stage")
}
