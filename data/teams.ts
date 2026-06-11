export interface Team {
  name: string
  slug: string
  countryCode: string
  fifaRanking: number
  coach: string
  keyPlayers: string[]
  description: string
  group: string
  flag: string
  worldCupTitles: number
  bestResult: string
}

export const teams: Team[] = [
  // ================================================================
  // Group A: Mexico, South Africa, South Korea, Czech Republic
  // ================================================================
  {
    name: "Mexico", slug: "mexico", countryCode: "MX", fifaRanking: 15,
    coach: "Javier Aguirre",
    keyPlayers: ["Santiago Giménez", "Edson Álvarez", "Hirving Lozano", "Guillermo Ochoa"],
    description: "Co-hosts with an unmatched Round of 16 streak — seven consecutive World Cups reaching the knockout stage. Playing at Estadio Azteca gives Mexico one of the biggest home advantages in tournament history.",
    group: "A", flag: "🇲🇽", worldCupTitles: 0, bestResult: "Quarter-finals (1970, 1986)",
  },
  {
    name: "South Africa", slug: "south-africa", countryCode: "ZA", fifaRanking: 57,
    coach: "Hugo Broos",
    keyPlayers: ["Percy Tau", "Lyle Foster", "Teboho Mokoena", "Ronwen Williams"],
    description: "Africa's only previous World Cup hosts return to the tournament for the first time since 2010. Bafana Bafana exceeded expectations in AFCON 2024 and carry growing confidence into 2026.",
    group: "A", flag: "🇿🇦", worldCupTitles: 0, bestResult: "Group Stage (1998, 2002, 2010)",
  },
  {
    name: "South Korea", slug: "south-korea", countryCode: "KR", fifaRanking: 22,
    coach: "Hong Myung-bo",
    keyPlayers: ["Son Heung-min", "Lee Kang-in", "Kim Min-jae", "Hwang Hee-chan"],
    description: "Asia's most consistent World Cup performer, reaching the knockout stage in 2022 behind Son Heung-min's brilliance. Kim Min-jae anchors one of the tournament's most underrated defenses.",
    group: "A", flag: "🇰🇷", worldCupTitles: 0, bestResult: "Fourth Place (2002)",
  },
  {
    name: "Czech Republic", slug: "czech-republic", countryCode: "CZ", fifaRanking: 36,
    coach: "Ivan Hašek",
    keyPlayers: ["Patrik Schick", "Tomáš Souček", "Adam Hložek", "Vladimír Coufal"],
    description: "Returning to the World Cup for the first time as the Czech Republic. Schick's goalscoring — joint-top scorer at Euro 2020 — and Souček's midfield leadership make them Group A's dangerous unknown quantity.",
    group: "A", flag: "🇨🇿", worldCupTitles: 0, bestResult: "Runner-up (1934, 1962 as Czechoslovakia)",
  },

  // ================================================================
  // Group B: Canada, Bosnia-Herzegovina, Qatar, Switzerland
  // ================================================================
  {
    name: "Canada", slug: "canada", countryCode: "CA", fifaRanking: 31,
    coach: "Jesse Marsch",
    keyPlayers: ["Alphonso Davies", "Jonathan David", "Stephen Eustáquio", "Tajon Buchanan"],
    description: "Co-hosts with a golden generation led by Alphonso Davies — one of the world's best left-backs. Marsch's high-pressing system and home advantage at BC Place could fuel a historic run.",
    group: "B", flag: "🇨🇦", worldCupTitles: 0, bestResult: "Group Stage (1986, 2022)",
  },
  {
    name: "Bosnia-Herzegovina", slug: "bosnia-herzegovina", countryCode: "BA", fifaRanking: 63,
    coach: "Sergej Barbarez",
    keyPlayers: ["Edin Džeko", "Miralem Pjanić", "Anel Ahmedhodžić", "Ermedin Demirović"],
    description: "Back at the World Cup for the second time after 2014. Veteran Džeko remains their attacking focal point, while Pjanić's set-piece delivery gives Bosnia a reliable route to goals in tight matches.",
    group: "B", flag: "🇧🇦", worldCupTitles: 0, bestResult: "Group Stage (2014)",
  },
  {
    name: "Qatar", slug: "qatar", countryCode: "QA", fifaRanking: 48,
    coach: "Tintín Márquez",
    keyPlayers: ["Akram Afif", "Almoez Ali", "Hassan Al-Haydos", "Abdulaziz Hatem"],
    description: "2022 hosts who endured a difficult campaign on home soil. Qatar's AFC Asian Cup triumph in 2024 proved they can win on the continental stage — now they aim to translate that to the World Cup.",
    group: "B", flag: "🇶🇦", worldCupTitles: 0, bestResult: "Group Stage (2022)",
  },
  {
    name: "Switzerland", slug: "switzerland", countryCode: "CH", fifaRanking: 19,
    coach: "Murat Yakin",
    keyPlayers: ["Manuel Akanji", "Granit Xhaka", "Breel Embolo", "Xherdan Shaqiri"],
    description: "Tournament-tested and tactically disciplined — Switzerland has reached the knockout stage in five of their last six major tournaments. Xhaka's leadership and Akanji's defensive solidity make them Group B favorites.",
    group: "B", flag: "🇨🇭", worldCupTitles: 0, bestResult: "Quarter-finals (1934, 1938, 1954)",
  },

  // ================================================================
  // Group C: Brazil, Morocco, Haiti, Scotland
  // ================================================================
  {
    name: "Brazil", slug: "brazil", countryCode: "BR", fifaRanking: 5,
    coach: "Dorival Júnior",
    keyPlayers: ["Vinicius Jr.", "Rodrygo", "Alisson Becker", "Bruno Guimarães"],
    description: "Five-time champions with the deepest attacking talent pool in world football. Vinicius Jr. has become Brazil's talisman, and the Seleção enters 2026 determined to end a 24-year title drought.",
    group: "C", flag: "🇧🇷", worldCupTitles: 5, bestResult: "Champion (1958, 1962, 1970, 1994, 2002)",
  },
  {
    name: "Morocco", slug: "morocco", countryCode: "MA", fifaRanking: 12,
    coach: "Walid Regragui",
    keyPlayers: ["Achraf Hakimi", "Brahim Díaz", "Youssef En-Nesyri", "Sofyan Amrabat"],
    description: "2022 semifinalists — the first African and Arab nation to reach that stage. Morocco's defensive structure under Regragui is elite, and the addition of Brahim Díaz adds creative firepower they lacked in Qatar.",
    group: "C", flag: "🇲🇦", worldCupTitles: 0, bestResult: "Fourth Place (2022)",
  },
  {
    name: "Haiti", slug: "haiti", countryCode: "HT", fifaRanking: 73,
    coach: "Sébastien Migné",
    keyPlayers: ["Duckens Nazon", "Frantzdy Pierrot", "Carlens Arcus", "Johny Placide"],
    description: "Haiti's return to the World Cup for the first time since 1974 is one of 2026's most inspiring stories. Athletic, physical, and playing with nothing to lose — Haiti embodies the romance of a 48-team tournament.",
    group: "C", flag: "🇭🇹", worldCupTitles: 0, bestResult: "Group Stage (1974)",
  },
  {
    name: "Scotland", slug: "scotland", countryCode: "GB-SCT", fifaRanking: 28,
    coach: "Steve Clarke",
    keyPlayers: ["Andy Robertson", "Scott McTominay", "John McGinn", "Kieran Tierney"],
    description: "Scotland's qualification ends a 28-year World Cup drought. Robertson captains a side built on grit, set-piece efficiency, and McTominay's unlikely goal-scoring form from midfield. The Tartan Army will travel in force.",
    group: "C", flag: "🏴", worldCupTitles: 0, bestResult: "Group Stage (1954, 1958, 1974, 1978, 1982, 1986, 1990, 1998)",
  },

  // ================================================================
  // Group D: United States, Paraguay, Australia, Turkey
  // ================================================================
  {
    name: "United States", slug: "united-states", countryCode: "US", fifaRanking: 16,
    coach: "Mauricio Pochettino",
    keyPlayers: ["Christian Pulisic", "Gio Reyna", "Weston McKennie", "Tyler Adams"],
    description: "Co-hosts with their most talented generation ever, now guided by world-class coach Mauricio Pochettino. Home soil, a golden generation, and a favorable draw — the stage is set for the deepest USMNT run since 1930.",
    group: "D", flag: "🇺🇸", worldCupTitles: 0, bestResult: "Third Place (1930)",
  },
  {
    name: "Paraguay", slug: "paraguay", countryCode: "PY", fifaRanking: 47,
    coach: "Gustavo Alfaro",
    keyPlayers: ["Miguel Almirón", "Julio Enciso", "Gustavo Gómez", "Ramón Sosa"],
    description: "Back at the World Cup after missing 2022. Almirón's Premier League pace and Enciso's creative flair give Paraguay a dangerous counter-attacking edge. CONMEBOL qualifying forged their resilience.",
    group: "D", flag: "🇵🇾", worldCupTitles: 0, bestResult: "Quarter-finals (2010)",
  },
  {
    name: "Australia", slug: "australia", countryCode: "AU", fifaRanking: 26,
    coach: "Tony Popovic",
    keyPlayers: ["Harry Souttar", "Jackson Irvine", "Craig Goodwin", "Mathew Ryan"],
    description: "Australia's 2022 Round of 16 run proved the Socceroos can compete beyond the group stage. Souttar's aerial dominance at both ends and their collective physicality make Australia a difficult opponent for any team.",
    group: "D", flag: "🇦🇺", worldCupTitles: 0, bestResult: "Round of 16 (2006, 2022)",
  },
  {
    name: "Turkey", slug: "turkey", countryCode: "TR", fifaRanking: 32,
    coach: "Vincenzo Montella",
    keyPlayers: ["Hakan Çalhanoğlu", "Arda Güler", "Kenan Yıldız", "Orkun Kökçü"],
    description: "Turkey's golden generation, led by teen sensation Arda Güler and Inter's Çalhanoğlu, returns to the World Cup for the first time since 2002 — when they finished third. This squad has the talent to match that run.",
    group: "D", flag: "🇹🇷", worldCupTitles: 0, bestResult: "Third Place (2002)",
  },

  // ================================================================
  // Group E: Germany, Curacao, Ivory Coast, Ecuador
  // ================================================================
  {
    name: "Germany", slug: "germany", countryCode: "DE", fifaRanking: 10,
    coach: "Julian Nagelsmann",
    keyPlayers: ["Jamal Musiala", "Florian Wirtz", "Kai Havertz", "Antonio Rüdiger"],
    description: "Four-time champions with the most exciting young attacking duo in international football — Musiala and Wirtz. After back-to-back group stage exits in 2018 and 2022, Germany is on a redemption mission.",
    group: "E", flag: "🇩🇪", worldCupTitles: 4, bestResult: "Champion (1954, 1974, 1990, 2014)",
  },
  {
    name: "Curacao", slug: "curacao", countryCode: "CW", fifaRanking: 82,
    coach: "Dick Advocaat",
    keyPlayers: ["Vurnon Anita", "Leandro Bacuna", "Juninho Bacuna", "Rangelo Janga"],
    description: "The smallest nation at World Cup 2026 by population. Curacao's qualification is a celebration of the Dutch Caribbean football development system. They play with freedom and will be neutral fans' favorite underdog.",
    group: "E", flag: "🇨🇼", worldCupTitles: 0, bestResult: "Debut (2026)",
  },
  {
    name: "Ivory Coast", slug: "ivory-coast", countryCode: "CI", fifaRanking: 42,
    coach: "Emerse Faé",
    keyPlayers: ["Simon Adingra", "Sébastien Haller", "Franck Kessié", "Ousmane Diomande"],
    description: "2024 AFCON champions with a squad blending Premier League experience and emerging talent. Faé's tactical organization transformed the Elephants mid-tournament — they now carry Africa's hottest momentum into 2026.",
    group: "E", flag: "🇨🇮", worldCupTitles: 0, bestResult: "Group Stage (2006, 2010, 2014)",
  },
  {
    name: "Ecuador", slug: "ecuador", countryCode: "EC", fifaRanking: 25,
    coach: "Sebastián Beccacece",
    keyPlayers: ["Moisés Caicedo", "Piero Hincapié", "Enner Valencia", "Kendry Páez"],
    description: "South America's rising force, built on the foundation of midfield star Moisés Caicedo. Ecuador's high-altitude qualifying forged a resilient, high-energy side, and 17-year-old Kendry Páez carries the hopes of a nation.",
    group: "E", flag: "🇪🇨", worldCupTitles: 0, bestResult: "Round of 16 (2006)",
  },

  // ================================================================
  // Group F: Netherlands, Japan, Sweden, Tunisia
  // ================================================================
  {
    name: "Netherlands", slug: "netherlands", countryCode: "NL", fifaRanking: 7,
    coach: "Ronald Koeman",
    keyPlayers: ["Virgil van Dijk", "Frenkie de Jong", "Cody Gakpo", "Xavi Simons"],
    description: "The eternal contenders, still seeking their first World Cup title. Van Dijk anchors a defense that can shut down any attack. Simons' emergence as a creative force gives the Dutch a dimension they've lacked since Sneijder.",
    group: "F", flag: "🇳🇱", worldCupTitles: 0, bestResult: "Runner-up (1974, 1978, 2010)",
  },
  {
    name: "Japan", slug: "japan", countryCode: "JP", fifaRanking: 18,
    coach: "Hajime Moriyasu",
    keyPlayers: ["Kaoru Mitoma", "Takefusa Kubo", "Wataru Endo", "Daizen Maeda"],
    description: "Asia's most technically accomplished side — they eliminated Germany and Spain from the 2022 group stage. Mitoma's dribbling wizardry and Japan's collective pressing make them dangerous against any opponent.",
    group: "F", flag: "🇯🇵", worldCupTitles: 0, bestResult: "Round of 16 (2002, 2010, 2018, 2022)",
  },
  {
    name: "Sweden", slug: "sweden", countryCode: "SE", fifaRanking: 29,
    coach: "Jon Dahl Tomasson",
    keyPlayers: ["Alexander Isak", "Dejan Kulusevski", "Viktor Gyökeres", "Victor Lindelöf"],
    description: "Sweden's new attacking era is defined by Isak's elegance and Gyökeres' physicality — a strike partnership as balanced as any at the tournament. Without Ibrahimovic for the first time since 2002, a new identity emerges.",
    group: "F", flag: "🇸🇪", worldCupTitles: 0, bestResult: "Runner-up (1958)",
  },
  {
    name: "Tunisia", slug: "tunisia", countryCode: "TN", fifaRanking: 41,
    coach: "Faouzi Benzarti",
    keyPlayers: ["Ellyes Skhiri", "Hannibal Mejbri", "Youssef Msakni", "Aïssa Laïdouni"],
    description: "African regulars seeking their first knockout stage appearance after six World Cup attempts. Skhiri's defensive midfield work and Mejbri's creative energy give Tunisia a competitive spine in midfield.",
    group: "F", flag: "🇹🇳", worldCupTitles: 0, bestResult: "Group Stage (1978, 1998, 2002, 2006, 2018, 2022)",
  },

  // ================================================================
  // Group G: Belgium, Egypt, Iran, New Zealand
  // ================================================================
  {
    name: "Belgium", slug: "belgium", countryCode: "BE", fifaRanking: 14,
    coach: "Domenico Tedesco",
    keyPlayers: ["Kevin De Bruyne", "Jérémy Doku", "Loïs Openda", "Amadou Onana"],
    description: "Belgium's golden generation has largely transitioned, but De Bruyne remains world-class and Doku's explosive emergence gives the Red Devils a new attacking dimension. This is Belgium's last dance with their greatest-ever player.",
    group: "G", flag: "🇧🇪", worldCupTitles: 0, bestResult: "Third Place (2018)",
  },
  {
    name: "Egypt", slug: "egypt", countryCode: "EG", fifaRanking: 33,
    coach: "Hossam Hassan",
    keyPlayers: ["Mohamed Salah", "Omar Marmoush", "Trézéguet", "Mohamed Elneny"],
    description: "Salah's final World Cup — and Egypt's best chance to make history. Marmoush's breakout Bundesliga season gives Egypt a second elite attacker. The Pharaohs have never won a World Cup match in three previous appearances.",
    group: "G", flag: "🇪🇬", worldCupTitles: 0, bestResult: "Group Stage (1934, 1990, 2018)",
  },
  {
    name: "Iran", slug: "iran", countryCode: "IR", fifaRanking: 21,
    coach: "Amir Ghalenoei",
    keyPlayers: ["Mehdi Taremi", "Sardar Azmoun", "Saman Ghoddos", "Alireza Jahanbakhsh"],
    description: "Asia's top-ranked side with a battle-hardened core that has now played in three consecutive World Cups. Taremi and Azmoun form one of the most proven strike partnerships in international football.",
    group: "G", flag: "🇮🇷", worldCupTitles: 0, bestResult: "Group Stage (1978, 1998, 2006, 2014, 2018, 2022)",
  },
  {
    name: "New Zealand", slug: "new-zealand", countryCode: "NZ", fifaRanking: 89,
    coach: "Darren Bazeley",
    keyPlayers: ["Chris Wood", "Sarpreet Singh", "Liberato Cacace", "Marko Stamenic"],
    description: "The All Whites return for their third World Cup, powered by Chris Wood's prolific form at Nottingham Forest. New Zealand's underdog spirit and physical presence make them a tricky opponent — they remain unbeaten in World Cup group stages (3 draws in 2010).",
    group: "G", flag: "🇳🇿", worldCupTitles: 0, bestResult: "Group Stage (1982, 2010)",
  },

  // ================================================================
  // Group H: Spain, Cape Verde, Saudi Arabia, Uruguay
  // ================================================================
  {
    name: "Spain", slug: "spain", countryCode: "ES", fifaRanking: 3,
    coach: "Luis de la Fuente",
    keyPlayers: ["Lamine Yamal", "Pedri", "Rodri", "Nico Williams"],
    description: "Euro 2024 champions and the most exciting young team at the tournament. Yamal at 17 years old is already Spain's primary creative force. Rodri is the world's best defensive midfielder. Spain plays football from the future.",
    group: "H", flag: "🇪🇸", worldCupTitles: 1, bestResult: "Champion (2010)",
  },
  {
    name: "Cape Verde", slug: "cape-verde", countryCode: "CV", fifaRanking: 68,
    coach: "Bubista",
    keyPlayers: ["Ryan Mendes", "Jovane Cabral", "Garry Rodrigues", "Stopira"],
    description: "Africa's smallest nation at the tournament, Cape Verde's qualification is a triumph of diaspora talent development. The Blue Sharks play with tactical intelligence well beyond their size and will be a feel-good story in Group H.",
    group: "H", flag: "🇨🇻", worldCupTitles: 0, bestResult: "Debut (2026)",
  },
  {
    name: "Saudi Arabia", slug: "saudi-arabia", countryCode: "SA", fifaRanking: 52,
    coach: "Roberto Mancini",
    keyPlayers: ["Salem Al-Dawsari", "Firas Al-Buraikan", "Saud Abdulhamid", "Mohammed Al-Owais"],
    description: "Saudi Arabia's football investment is reshaping Asian football. Their 2-1 upset of Argentina in 2022 remains the biggest shock of that tournament. Under Mancini, the Green Falcons have added European tactical structure to their natural flair.",
    group: "H", flag: "🇸🇦", worldCupTitles: 0, bestResult: "Round of 16 (1994)",
  },
  {
    name: "Uruguay", slug: "uruguay", countryCode: "UY", fifaRanking: 11,
    coach: "Marcelo Bielsa",
    keyPlayers: ["Federico Valverde", "Darwin Núñez", "Ronald Araújo", "Manuel Ugarte"],
    description: "Two-time champions transformed by Bielsa's high-octane system into one of the most exciting teams to watch. Valverde is a Ballon d'Or-caliber midfielder, and Núñez's chaos factor under Bielsa has been refined into genuine world-class production.",
    group: "H", flag: "🇺🇾", worldCupTitles: 2, bestResult: "Champion (1930, 1950)",
  },

  // ================================================================
  // Group I: France, Senegal, Iraq, Norway
  // ================================================================
  {
    name: "France", slug: "france", countryCode: "FR", fifaRanking: 2,
    coach: "Didier Deschamps",
    keyPlayers: ["Kylian Mbappé", "Aurélien Tchouaméni", "William Saliba", "Ousmane Dembélé"],
    description: "Mbappé is the best player at the tournament — 12 World Cup goals at age 27, chasing Klose's all-time record of 16. France's squad depth is unmatched, from World Cup winners to emerging stars. The favorites in everything but name.",
    group: "I", flag: "🇫🇷", worldCupTitles: 2, bestResult: "Champion (1998, 2018)",
  },
  {
    name: "Senegal", slug: "senegal", countryCode: "SN", fifaRanking: 17,
    coach: "Pape Thiaw",
    keyPlayers: ["Sadio Mané", "Nicolas Jackson", "Kalidou Koulibaly", "Édouard Mendy"],
    description: "African champions with athleticism that rivals any team at the tournament. Mané remains Senegal's talisman, Jackson's emergence at Chelsea adds a new dimension in attack, and Koulibaly's defensive leadership anchors a formidable back line.",
    group: "I", flag: "🇸🇳", worldCupTitles: 0, bestResult: "Quarter-finals (2002)",
  },
  {
    name: "Iraq", slug: "iraq", countryCode: "IQ", fifaRanking: 56,
    coach: "Jesús Casas",
    keyPlayers: ["Aymen Hussein", "Ali Jasim", "Zidane Iqbal", "Jalal Hassan"],
    description: "Iraq's return to the World Cup for the first time since 1986 carries deep emotional resonance. The Lions of Mesopotamia are Asian football's most passionate story — technically gifted, tactically organized, and representing more than just football.",
    group: "I", flag: "🇮🇶", worldCupTitles: 0, bestResult: "Group Stage (1986)",
  },
  {
    name: "Norway", slug: "norway", countryCode: "NO", fifaRanking: 44,
    coach: "Ståle Solbakken",
    keyPlayers: ["Erling Haaland", "Martin Ødegaard", "Antonio Nusa", "Sander Berge"],
    description: "Back at the World Cup after a 28-year absence — and they arrive with the most feared striker on the planet. Haaland's physical presence transforms Norway from plucky qualifier to genuine knockout threat. Ødegaard's creativity provides the ammunition.",
    group: "I", flag: "🇳🇴", worldCupTitles: 0, bestResult: "Round of 16 (1938, 1998)",
  },

  // ================================================================
  // Group J: Argentina, Algeria, Austria, Jordan
  // ================================================================
  {
    name: "Argentina", slug: "argentina", countryCode: "AR", fifaRanking: 1,
    coach: "Lionel Scaloni",
    keyPlayers: ["Lionel Messi", "Julián Álvarez", "Enzo Fernández", "Emiliano Martínez"],
    description: "Defending champions. Messi's final World Cup. The greatest player of all time leads a squad that has won the World Cup and two Copas in three years. Argentina's tournament mentality — forged across three consecutive major finals — is the best in international football.",
    group: "J", flag: "🇦🇷", worldCupTitles: 3, bestResult: "Champion (1978, 1986, 2022)",
  },
  {
    name: "Algeria", slug: "algeria", countryCode: "DZ", fifaRanking: 39,
    coach: "Vladimir Petković",
    keyPlayers: ["Riyad Mahrez", "Ismaël Bennacer", "Rayan Cherki", "Amine Gouiri"],
    description: "The Desert Foxes return after the heartbreak of missing 2022 by a single goal. Mahrez captains a talented generation bolstered by dual-nationality recruits. Algeria's technical quality in midfield can trouble any opponent in Group J.",
    group: "J", flag: "🇩🇿", worldCupTitles: 0, bestResult: "Round of 16 (2014)",
  },
  {
    name: "Austria", slug: "austria", countryCode: "AT", fifaRanking: 24,
    coach: "Ralf Rangnick",
    keyPlayers: ["David Alaba", "Marcel Sabitzer", "Christoph Baumgartner", "Konrad Laimer"],
    description: "Rangnick's high-intensity pressing system has transformed Austria into one of Europe's most tactically distinctive sides. Alaba's leadership from the back and Sabitzer's box-to-box energy make Austria a genuine Group J threat — even to Argentina.",
    group: "J", flag: "🇦🇹", worldCupTitles: 0, bestResult: "Third Place (1954)",
  },
  {
    name: "Jordan", slug: "jordan", countryCode: "JO", fifaRanking: 76,
    coach: "Hussein Ammouta",
    keyPlayers: ["Mousa Al-Taamari", "Yazan Al-Naimat", "Ehsan Haddad", "Noor Al-Rawabdeh"],
    description: "Jordan's first-ever World Cup qualification is one of 2026's most historic moments. Al-Taamari, starring in Ligue 1, is the first Jordanian to play in a top-5 European league. Every match in Group J will be the biggest in Jordanian football history.",
    group: "J", flag: "🇯🇴", worldCupTitles: 0, bestResult: "Debut (2026)",
  },

  // ================================================================
  // Group K: Portugal, DR Congo, Uzbekistan, Colombia
  // ================================================================
  {
    name: "Portugal", slug: "portugal", countryCode: "PT", fifaRanking: 6,
    coach: "Roberto Martínez",
    keyPlayers: ["Cristiano Ronaldo", "Bruno Fernandes", "Rafael Leão", "Rúben Dias"],
    description: "Ronaldo's sixth and final World Cup — no player in history has scored in five different World Cups, and he'll aim for six. Portugal's depth rivals any squad at the tournament: Fernandes' creativity, Leão's explosiveness, Dias' defensive command.",
    group: "K", flag: "🇵🇹", worldCupTitles: 0, bestResult: "Third Place (1966)",
  },
  {
    name: "DR Congo", slug: "dr-congo", countryCode: "CD", fifaRanking: 60,
    coach: "Sébastien Desabre",
    keyPlayers: ["Chancel Mbemba", "Yoane Wissa", "Gaël Kakuta", "Cédric Bakambu"],
    description: "The Leopards return for their second World Cup, 52 years after their 1974 debut as Zaire. Physical, pacey, and technically underrated — DR Congo's diaspora talent has raised the squad's ceiling significantly since their AFCON 2024 semifinal run.",
    group: "K", flag: "🇨🇩", worldCupTitles: 0, bestResult: "Group Stage (1974 as Zaire)",
  },
  {
    name: "Uzbekistan", slug: "uzbekistan", countryCode: "UZ", fifaRanking: 55,
    coach: "Srečko Katanec",
    keyPlayers: ["Eldor Shomurodov", "Jaloliddin Masharipov", "Abbosbek Fayzullaev", "Odiljon Xamrobekov"],
    description: "Central Asia's first World Cup representative — Uzbekistan's qualification is a milestone for the entire region. Shomurodov's Serie A experience and Fayzullaev's emerging talent at CSKA Moscow give the White Wolves genuine attacking quality.",
    group: "K", flag: "🇺🇿", worldCupTitles: 0, bestResult: "Debut (2026)",
  },
  {
    name: "Colombia", slug: "colombia", countryCode: "CO", fifaRanking: 13,
    coach: "Néstor Lorenzo",
    keyPlayers: ["Luis Díaz", "James Rodríguez", "Jhon Durán", "Davinson Sánchez"],
    description: "Riding a historic unbeaten run under Lorenzo. Luis Díaz is arguably the most in-form winger in world football, and James Rodríguez' tournament magic — Golden Boot winner in 2014 — is a proven commodity. Colombia enters 2026 with legitimate semifinal ambitions.",
    group: "K", flag: "🇨🇴", worldCupTitles: 0, bestResult: "Quarter-finals (2014)",
  },

  // ================================================================
  // Group L: England, Croatia, Ghana, Panama
  // ================================================================
  {
    name: "England", slug: "england", countryCode: "GB-ENG", fifaRanking: 4,
    coach: "Thomas Tuchel",
    keyPlayers: ["Jude Bellingham", "Harry Kane", "Bukayo Saka", "Declan Rice"],
    description: "Euro 2024 finalists with the world's best midfielder in Bellingham and the tournament's most consistent goalscorer in Kane. Tuchel's tactical acumen — a Champions League winner — gives England the elite knockout manager they've historically lacked.",
    group: "L", flag: "🏴", worldCupTitles: 1, bestResult: "Champion (1966)",
  },
  {
    name: "Croatia", slug: "croatia", countryCode: "HR", fifaRanking: 9,
    coach: "Zlatko Dalić",
    keyPlayers: ["Luka Modrić", "Joško Gvardiol", "Mateo Kovačić", "Josip Stanišić"],
    description: "A nation of 3.8 million people that finished second and third at the last two World Cups. Modrić at 40 remains one of football's great midfield artists in what is surely his final World Cup. Croatia's tournament mentality defies all population-based logic.",
    group: "L", flag: "🇭🇷", worldCupTitles: 0, bestResult: "Runner-up (2018)",
  },
  {
    name: "Ghana", slug: "ghana", countryCode: "GH", fifaRanking: 58,
    coach: "Chris Hughton",
    keyPlayers: ["Mohammed Kudus", "Thomas Partey", "Inaki Williams", "Tariq Lamptey"],
    description: "The Black Stars carry Africa's hopes with a squad rich in Premier League experience. Kudus is one of the world's most exciting young attackers, and Partey's midfield control gives Ghana a platform to compete against Group L's European powers.",
    group: "L", flag: "🇬🇭", worldCupTitles: 0, bestResult: "Quarter-finals (2010)",
  },
  {
    name: "Panama", slug: "panama", countryCode: "PA", fifaRanking: 67,
    coach: "Thomas Christiansen",
    keyPlayers: ["Michael Murillo", "Aníbal Godoy", "Édgar Bárcenas", "José Fajardo"],
    description: "Back for their second World Cup after debuting in 2018. Panama has matured significantly under Christiansen, adding tactical discipline to the physicality that defined their first appearance. Four years of growth in CONCACAF's improving competitive environment.",
    group: "L", flag: "🇵🇦", worldCupTitles: 0, bestResult: "Group Stage (2018)",
  },
]

export function getTeamBySlug(slug: string): Team | undefined {
  return teams.find((t) => t.slug === slug)
}

export function getTeamsByGroup(group: string): Team[] {
  return teams.filter((t) => t.group === group)
}

export function getAllGroups(): string[] {
  return [...new Set(teams.map(t => t.group))].sort()
}
