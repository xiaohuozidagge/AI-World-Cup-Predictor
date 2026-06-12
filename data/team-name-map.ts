// Maps football-data.org API team names to local team slugs.
// API names vary — sometimes "USA", sometimes "United States", etc.

export const API_NAME_TO_SLUG: Record<string, string> = {
  // Direct matches
  "Mexico": "mexico",
  "South Africa": "south-africa",
  "South Korea": "south-korea",
  "Korea Republic": "south-korea",
  "Czech Republic": "czech-republic",
  "Czechia": "czech-republic",
  "Canada": "canada",
  "Bosnia-Herzegovina": "bosnia-herzegovina",
  "Bosnia and Herzegovina": "bosnia-herzegovina",
  "Qatar": "qatar",
  "Switzerland": "switzerland",
  "Brazil": "brazil",
  "Morocco": "morocco",
  "Haiti": "haiti",
  "Scotland": "scotland",
  "United States": "united-states",
  "USA": "united-states",
  "Paraguay": "paraguay",
  "Australia": "australia",
  "Turkey": "turkey",
  "Türkiye": "turkey",
  "Germany": "germany",
  "Curacao": "curacao",
  "Curaçao": "curacao",
  "Ivory Coast": "ivory-coast",
  "Côte d'Ivoire": "ivory-coast",
  "Ecuador": "ecuador",
  "Netherlands": "netherlands",
  "Japan": "japan",
  "Sweden": "sweden",
  "Tunisia": "tunisia",
  "Belgium": "belgium",
  "Egypt": "egypt",
  "Iran": "iran",
  "New Zealand": "new-zealand",
  "Spain": "spain",
  "Cape Verde": "cape-verde",
  "Cabo Verde": "cape-verde",
  "Saudi Arabia": "saudi-arabia",
  "Uruguay": "uruguay",
  "France": "france",
  "Senegal": "senegal",
  "Iraq": "iraq",
  "Norway": "norway",
  "Argentina": "argentina",
  "Algeria": "algeria",
  "Austria": "austria",
  "Jordan": "jordan",
  "Portugal": "portugal",
  "DR Congo": "dr-congo",
  "Congo DR": "dr-congo",
  "Uzbekistan": "uzbekistan",
  "Colombia": "colombia",
  "England": "england",
  "Croatia": "croatia",
  "Ghana": "ghana",
  "Panama": "panama",
}

export function mapApiTeamToSlug(apiName: string): string | undefined {
  return API_NAME_TO_SLUG[apiName]
}

export function getUnmappedTeams(apiNames: string[]): string[] {
  return apiNames.filter(n => !API_NAME_TO_SLUG[n])
}
