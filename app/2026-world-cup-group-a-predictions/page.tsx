import type { Metadata } from "next"
import Link from "next/link"
import { Trophy, Star, Shield, Calendar, ChevronRight, Percent } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FAQSection } from "@/components/FAQSection"
import { JsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/jsonld"
import { SITE_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "World Cup 2026 Group A Predictions: Mexico, South Korea, South Africa, Czech Republic",
  description: "AI predictions for World Cup 2026 Group A featuring Mexico, South Korea, South Africa and Czech Republic. Winner forecast, qualification odds, key fixtures and predicted standings.",
  openGraph: {
    title: "World Cup 2026 Group A Predictions — Winner & Qualification Forecast",
    description: "Group A preview: Mexico, South Korea, South Africa, and Czech Republic battle for Round of 32 spots in the 2026 World Cup opening group.",
  },
  alternates: { canonical: "/2026-world-cup-group-a-predictions" },
}

const groupA = [
  { name: "Mexico", flag:"🇲🇽", rank:15, coach:"Javier Aguirre", strength:"Tournament experience, home advantage at Estadio Azteca, seven consecutive Round of 16 appearances. Santiago Giménez's clinical finishing provides a reliable goal threat. The midfield pairing of Edson Álvarez and Luis Chávez offers both defensive cover and progressive passing.", weakness:"Aging core — Ochoa is 40 and several starters are on the wrong side of 30. Defensive transitions can be vulnerable against quick counter-attacks, and the pressure of opening the tournament as co-hosts creates unique psychological weight." },
  { name: "South Korea", flag:"🇰🇷", rank:22, coach:"Hong Myung-bo", strength:"Son Heung-min remains one of the world's elite forwards. Kim Min-jae anchors a disciplined defense that conceded only 5 goals in Asian qualifying. Lee Kang-in's creativity from midfield adds a dimension Korea lacked in previous tournaments. Exceptional fitness levels allow them to press effectively for 90 minutes.", weakness:"Over-reliance on Son for goals — when he's marked out of games, Korea struggles to create from other sources. Squad depth behind the starting XI is thin by World Cup standards." },
  { name: "South Africa", flag:"🇿🇦", rank:57, coach:"Hugo Broos", strength:"Momentum from exceeding expectations at AFCON 2024. Lyle Foster's pace on the counter-attack can trouble higher-ranked defenses. Ronwen Williams is among Africa's best goalkeepers and a penalty-saving specialist. Team chemistry and collective spirit are genuine assets.", weakness:"Lack of top-level experience — most players compete outside Europe's major leagues. FIFA ranking (#57) reflects the talent gap to Group A's other teams. Creating chances against organized defenses has been a persistent issue." },
  { name: "Czech Republic", flag:"🇨🇿", rank:36, coach:"Ivan Hašek", strength:"Patrik Schick's goalscoring pedigree — joint-top scorer at Euro 2020 — gives them a reliable finisher. Tomáš Souček's aerial threat from set pieces is among the best in world football. Physical, well-organized defensive structure that's difficult to break down.", weakness:"First World Cup appearance as the Czech Republic — lack of recent tournament experience at this level. Creative reliance on set pieces rather than open-play chance creation. Squad depth is limited in wide positions." },
]

const groupAFAQs = [
  { question: "Who will win World Cup 2026 Group A?", answer: "Mexico is projected to win Group A with a 42% probability. Their combination of tournament experience, home advantage as co-hosts, and individual quality through Giménez and Álvarez gives them the edge over a competitive field." },
  { question: "Who is most likely to qualify from Group A?", answer: "Our AI model projects Mexico (82% qualification probability) and South Korea (58%) as the two most likely teams to advance from Group A. The Czech Republic (32%) and South Africa (28%) both have realistic paths to qualification as potential best-third-place teams." },
  { question: "What is the key match in Group A?", answer: "Mexico vs South Korea on June 17 at Estadio Azteca. This second-round group match will likely determine the group winner and set the tone for the knockout bracket." },
  { question: "Can South Africa advance from Group A?", answer: "South Africa has a 28% chance of finishing in the top two — their best route is through a compact defensive performance against Mexico and a victory over the Czech Republic, combined with favorable results elsewhere in the group." },
  { question: "Who is the dark horse in Group A?", answer: "The Czech Republic is Group A's most dangerous underdog. Patrik Schick's finishing ability and Tomáš Souček's set-piece threat give them a puncher's chance in every match, and their 32% qualification probability reflects genuine knockout-stage potential." },
  { question: "Which Group A player should I watch?", answer: "Santiago Giménez (Mexico) is the group's most in-form striker, with 20+ goals for Feyenoord this season. Son Heung-min (South Korea) remains the group's biggest star and can decide matches single-handedly." },
  { question: "What are the Group A fixtures?", answer: "June 11: Mexico vs South Africa (Estadio Azteca) and South Korea vs Czech Republic (Estadio Akron). June 17: Mexico vs South Korea (Estadio Azteca) and South Africa vs Czech Republic (Estadio Akron). June 24: Mexico vs Czech Republic (Estadio Azteca) and South Africa vs South Korea (Estadio Akron)." },
  { question: "Could all four Group A teams advance?", answer: "Yes — with the new 48-team format, the 8 best third-place teams across all 12 groups advance. Group A's competitive balance means the third-place team could earn one of those spots, particularly if the matches produce draws rather than decisive results." },
]

export default function GroupAPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <JsonLd data={faqJsonLd(groupAFAQs)} />
      <JsonLd data={breadcrumbJsonLd([{name:"Home",url:"/"},{name:"Group Predictions",url:"/2026-world-cup-group-predictions"},{name:"Group A",url:"/2026-world-cup-group-a-predictions"}], SITE_URL)} />

      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-sports-green">Home</Link><ChevronRight className="h-3 w-3"/>
        <Link href="/2026-world-cup-group-predictions" className="hover:text-sports-green">Group Predictions</Link><ChevronRight className="h-3 w-3"/>
        <span className="text-foreground font-medium">Group A</span>
      </nav>

      <h1 className="text-4xl font-extrabold tracking-tight mb-4">World Cup 2026 Group A Predictions</h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
        The opening group of the 2026 FIFA World Cup features co-hosts Mexico alongside South Korea, South Africa, and the Czech Republic. Estadio Azteca hosts the tournament opener — and Mexico carries the weight of a nation.
      </p>

      {/* Group Overview */}
      <Card className="mb-8"><CardHeader><CardTitle>Group Overview</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
        <p>Group A occupies a unique place in World Cup 2026. It features the opening match at the legendary Estadio Azteca — the first stadium to host three World Cup opening ceremonies — and includes co-hosts Mexico, who carry the hopes of a football-mad nation of 130 million people. The group is not the tournament's strongest on paper, but the combination of home pressure, tournament debutants, and Asian and African contenders creates a volatile mix where upsets are plausible.</p>
        <p>Mexico enters as the clear favorite on paper, backed by seven consecutive Round of 16 appearances — a consistency matched only by Brazil. South Korea arrives with Asia's best player in Son Heung-min and the confidence of reaching the knockout stage in 2022. The Czech Republic makes its first World Cup appearance as an independent nation with a physically imposing squad. South Africa, returning for the first time since hosting in 2010, plays with the freedom of underdogs with nothing to lose.</p>
        <p>The group's competitive balance is above average: three of the four teams are ranked in the global top 40, and the fourth (South Africa at #57) arrives with momentum from exceeding expectations at AFCON 2024. The Azteca atmosphere will be extraordinary — and the pressure it creates cuts both ways for El Tri.</p>
      </CardContent></Card>

      {/* Teams */}
      <h2 className="text-2xl font-bold mb-4">Group A Teams</h2>
      <div className="space-y-4 mb-8">
        {groupA.map((t) => (
          <Card key={t.name}><CardContent className="p-5">
            <div className="flex items-start gap-3 mb-3"><span className="text-3xl">{t.flag}</span><div><h3 className="font-bold text-lg">{t.name}</h3><div className="flex gap-2 mt-1"><Badge variant="secondary">#{t.rank} FIFA</Badge><Badge variant="outline">Coach: {t.coach}</Badge></div></div></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div><strong className="text-sports-green">Strengths:</strong> {t.strength}</div>
              <div><strong className="text-red-500">Weaknesses:</strong> {t.weakness}</div>
            </div>
            <div className="mt-3"><Link href={`/team/${t.name.toLowerCase().replace(/\s+/g,"-")}`} className="text-xs text-sports-green hover:underline">Full {t.name} team profile →</Link></div>
          </CardContent></Card>
        ))}
      </div>

      {/* Fixtures */}
      <Card className="mb-8"><CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-sports-green" />Group A Fixtures</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-muted/50 rounded-lg"><div className="font-semibold text-foreground">June 11 — Matchday 1</div><div className="mt-1">Mexico vs South Africa — 3:00 PM, Estadio Azteca</div><div>South Korea vs Czech Republic — 6:00 PM, Estadio Akron</div></div>
          <div className="p-3 bg-muted/50 rounded-lg"><div className="font-semibold text-foreground">June 17 — Matchday 2</div><div className="mt-1">Mexico vs South Korea — 3:00 PM, Estadio Azteca</div><div>South Africa vs Czech Republic — 6:00 PM, Estadio Akron</div></div>
          <div className="p-3 bg-muted/50 rounded-lg sm:col-span-2"><div className="font-semibold text-foreground">June 24 — Matchday 3 <Badge variant="secondary" className="ml-2">Simultaneous Kickoff</Badge></div><div className="mt-1">Mexico vs Czech Republic — 3:00 PM, Estadio Azteca</div><div>South Africa vs South Korea — 3:00 PM, Estadio Akron</div></div>
        </div>
        <p className="mt-3">For full match predictions, visit: <Link href="/predictions" className="text-sports-green hover:underline">All Match Predictions →</Link></p>
      </CardContent></Card>

      {/* Winner Prediction */}
      <Card className="mb-8"><CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-sports-gold" />AI Group Winner Prediction</CardTitle></CardHeader><CardContent>
        <div className="space-y-3">
          {[{team:"Mexico",pct:42,color:"bg-sports-green"},{team:"South Korea",pct:28,color:"bg-sports-blue"},{team:"South Africa",pct:18,color:"bg-sports-gold"},{team:"Czech Republic",pct:12,color:"bg-muted-foreground"}].map(t=>(<div key={t.team} className="flex items-center gap-3"><span className="font-medium text-sm w-28">{t.team}</span><div className="flex-1 h-3 bg-muted rounded-full overflow-hidden"><div className={`h-full ${t.color} rounded-full`} style={{width:`${t.pct*2.2}%`}}/></div><span className="font-bold text-sm w-12 text-right">{t.pct}%</span></div>))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">Mexico at 42% is the narrowest favorite of any host nation group in the tournament — a reflection of the group's genuine competitive balance rather than any weakness in El Tri.</p>
      </CardContent></Card>

      {/* Qualification */}
      <Card className="mb-8"><CardHeader><CardTitle className="flex items-center gap-2"><Percent className="h-5 w-5 text-sports-blue" />Qualification Probability</CardTitle></CardHeader><CardContent>
        <div className="space-y-3">
          {[{team:"Mexico",top2:82,advance:88},{team:"South Korea",top2:58,advance:65},{team:"Czech Republic",top2:32,advance:42},{team:"South Africa",top2:28,advance:38}].map(t=>(<div key={t.team} className="flex items-center gap-3"><span className="font-medium text-sm w-28">{t.team}</span><div className="flex-1"><div className="flex justify-between text-xs mb-1"><span>Top 2: {t.top2}%</span><span>Advance: {t.advance}%</span></div><div className="h-2 bg-muted rounded-full overflow-hidden flex"><div className="h-full bg-sports-green" style={{width:`${t.top2}%`}}/><div className="h-full bg-sports-blue/30" style={{width:`${t.advance-t.top2}%`}}/></div></div></div>))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">Advance probability includes scenarios where the team finishes 3rd but qualifies as one of the 8 best third-place teams.</p>
      </CardContent></Card>

      {/* Key Match */}
      <Card className="mb-8"><CardHeader><CardTitle className="flex items-center gap-2"><Star className="h-5 w-5 text-sports-gold" />Key Match: Mexico vs South Korea</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
        <p>The June 17 clash between Mexico and South Korea at Estadio Azteca is projected to determine the Group A winner. Both teams enter with three points from their openers (per our projections), making this a battle for control of the group.</p>
        <p>Tactically, the match pits Mexico's possession-based approach against Korea's transition game. Son Heung-min's pace on the counter will test Mexico's aging defense, while Santiago Giménez's movement in the box will probe Korea's organized back line anchored by Kim Min-jae. The midfield duel between Edson Álvarez and Lee Kang-in could determine which team controls the tempo.</p>
        <p>Mexico's home advantage at Azteca — 7,200 feet of altitude and 87,000 passionate supporters — gives them a measurable edge, but Korea's fitness levels are among the best at the tournament.</p>
      </CardContent></Card>

      {/* Dark Horse */}
      <Card className="mb-8"><CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-sports-blue" />Dark Horse: Czech Republic</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
        <p>The Czech Republic enters Group A as the lowest-profile team but carries genuine upset potential. Patrik Schick's Euro 2020 campaign — where he finished as joint-top scorer with 5 goals, including a goal-of-the-tournament strike from the halfway line — demonstrated his ability to produce moments of individual brilliance on the biggest stage.</p>
        <p>Tomáš Souček gives the Czechs a set-piece weapon that Mexico and Korea will struggle to defend: his aerial ability from corners and free kicks is among the most dangerous in European football. In a group where margins may be thin, a single set-piece goal could be worth two points in the standings. If the Czech Republic can take points from their opener against South Korea, their path to the knockout stage opens significantly.</p>
      </CardContent></Card>

      {/* Predicted Standings */}
      <Card className="mb-8"><CardHeader><CardTitle>Predicted Final Standings</CardTitle></CardHeader><CardContent>
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left py-2 pr-4">Pos</th><th className="text-left py-2 pr-4">Team</th><th className="text-center py-2 pr-4">Pts</th><th className="text-center py-2 pr-4">GF</th><th className="text-center py-2 pr-4">GA</th><th className="text-left py-2">Status</th></tr></thead><tbody>
          <tr className="border-b"><td className="py-2 font-bold">1</td><td className="py-2">Mexico</td><td className="text-center py-2">7</td><td className="text-center py-2">5</td><td className="text-center py-2">2</td><td className="py-2"><Badge variant="success">Round of 32</Badge></td></tr>
          <tr className="border-b"><td className="py-2 font-bold">2</td><td className="py-2">South Korea</td><td className="text-center py-2">5</td><td className="text-center py-2">4</td><td className="text-center py-2">3</td><td className="py-2"><Badge variant="info">Round of 32</Badge></td></tr>
          <tr className="border-b"><td className="py-2 font-bold">3</td><td className="py-2">Czech Republic</td><td className="text-center py-2">3</td><td className="text-center py-2">2</td><td className="text-center py-2">3</td><td className="py-2"><Badge variant="warning">Best 3rd?</Badge></td></tr>
          <tr><td className="py-2 font-bold">4</td><td className="py-2">South Africa</td><td className="text-center py-2">1</td><td className="text-center py-2">1</td><td className="text-center py-2">4</td><td className="py-2"><Badge variant="outline">Eliminated</Badge></td></tr>
        </tbody></table></div>
      </CardContent></Card>

      {/* Related Links */}
      <div className="flex flex-wrap gap-3 mb-10">
        <Link href="/2026-world-cup-group-b-predictions"><Badge className="cursor-pointer hover:bg-sports-green/80">Group B Predictions →</Badge></Link>
        <Link href="/2026-world-cup-group-c-predictions"><Badge className="cursor-pointer hover:bg-sports-green/80">Group C Predictions →</Badge></Link>
        <Link href="/2026-world-cup-group-d-predictions"><Badge className="cursor-pointer hover:bg-sports-green/80">Group D Predictions →</Badge></Link>
        <Link href="/winner-predictions"><Badge variant="secondary" className="cursor-pointer">Winner Predictions →</Badge></Link>
      </div>

      <FAQSection faqs={groupAFAQs} />
    </div>
  )
}
