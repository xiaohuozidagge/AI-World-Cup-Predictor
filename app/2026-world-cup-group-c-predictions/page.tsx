import type { Metadata } from "next"
import Link from "next/link"
import { Trophy, Star, Shield, Calendar, ChevronRight, Percent } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FAQSection } from "@/components/FAQSection"
import { JsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/jsonld"
import { SITE_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "World Cup 2026 Group C Predictions: Brazil, Morocco, Haiti, Scotland",
  description: "AI predictions for World Cup 2026 Group C featuring Brazil, Morocco, Scotland and Haiti. Winner forecast, qualification odds and predicted group standings.",
  openGraph: {
    title: "World Cup 2026 Group C Predictions — Brazil, Morocco & Qualification Forecast",
    description: "Group C preview: Five-time champions Brazil face 2022 semifinalists Morocco, plus Scotland and tournament debutants Haiti.",
  },
  alternates: { canonical: "/2026-world-cup-group-c-predictions" },
}

const groupC = [
  { name: "Brazil", flag:"🇧🇷", rank:5, coach:"Dorival Júnior", strength:"The deepest attacking talent pool in international football — Vinicius Jr., Rodrygo, Endrick, and Raphinha form a front four no defense can fully contain. Brazil's World Cup pedigree (5 titles, most in history) brings an institutional confidence that lesser nations cannot replicate. Midfield creativity through Bruno Guimarães and Lucas Paquetá provides multiple avenues to goal.", weakness:"Defensive organization under Dorival Júnior remains a work in progress. The weight of a 24-year title drought creates psychological pressure that has undone previous Brazilian generations. Vulnerability to quick transitions has been exposed in recent competitive matches against European opposition." },
  { name: "Morocco", flag:"🇲🇦", rank:12, coach:"Walid Regragui", strength:"2022 semifinalists with the most disciplined defensive structure in African football. Achraf Hakimi is a top-3 right-back globally, and Brahim Díaz adds a creative spark Morocco lacked in Qatar. Regragui's system conceded only one opposition goal in the entire 2022 knockout stage before the semifinals. Counter-attacking efficiency is elite.", weakness:"Scoring against deep defensive blocks — Morocco dominated possession against lower-ranked opponents but struggled to convert. Squad depth in attacking positions behind En-Nesyri is limited. The expectations created by their 2022 run add pressure that didn't exist in Qatar." },
  { name: "Scotland", flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", rank:28, coach:"Steve Clarke", strength:"Andy Robertson captains a physically imposing, tactically organized side that ended a 28-year World Cup qualification drought. Scott McTominay's goal-scoring from midfield — 7 goals in Euro 2024 qualifying — is Scotland's most reliable attacking weapon. Set-piece threat is among the best in the group. The Tartan Army's traveling support provides a genuine emotional advantage.", weakness:"Creating chances from open play against top-tier defenses has been a persistent challenge. The squad lacks a proven international goalscorer — their top scorer in qualifying was a midfielder. Scotland's tournament history (never advanced beyond the first round in 8 attempts) creates a psychological barrier they must overcome." },
  { name: "Haiti", flag:"🇭🇹", rank:73, coach:"Sébastien Migné", strength:"One of 2026's most inspiring stories — Haiti returns to the World Cup for the first time since 1974. Duckens Nazon's physical presence and finishing ability give them a credible goalscoring threat. The emotional momentum of ending a 52-year World Cup absence creates a team playing with freedom and nothing to lose.", weakness:"Lack of top-level experience — most players compete outside Europe's top divisions. Defensive organization against elite attacking talent (particularly Brazil and Morocco) will be severely tested. FIFA ranking (#73) reflects the significant talent gap to Group C's other teams." },
]

const groupCFAQs = [
  { question: "Will Brazil win Group C?", answer: "Brazil is projected to win Group C with a 62% probability — the highest of any team in Groups A-D. However, Morocco's defensive organization and Scotland's set-piece threat mean Brazil cannot afford an off-day, particularly in their opening match." },
  { question: "Can Morocco challenge Brazil for first place?", answer: "Morocco has an 18% chance of winning Group C. Their 2022 semifinal run proved they can compete with elite opposition, and the addition of Brahim Díaz gives them a creative dimension that was missing in Qatar." },
  { question: "Can Scotland advance from Group C?", answer: "Scotland has a 28% probability of finishing in the top two. Their best route is through a victory against Haiti and a result against Morocco or Brazil — a tall order, but Scotland's set-piece threat and physical organization make them dangerous in knockout-style group matches." },
  { question: "What is the key match in Group C?", answer: "Brazil vs Morocco on June 14 at MetLife Stadium. This opening-round clash between the five-time champions and the 2022 semifinalists will set the tone for the entire group and could determine who wins Group C." },
  { question: "Is Haiti just making up the numbers?", answer: "No — Haiti's qualification is a genuine achievement that required navigating a competitive CONCACAF qualifying path. While their advancement probability is low (12%), their emotional narrative and physical style make them capable of causing a shock result, particularly against Scotland." },
  { question: "Which Group C player should I watch?", answer: "Vinicius Jr. (Brazil) is a Ballon d'Or contender and the face of the post-Neymar Seleção. Achraf Hakimi (Morocco) is among the world's best right-backs and Morocco's primary creative outlet. Scott McTominay (Scotland) scored 7 goals from midfield in qualifying — an extraordinary return for a central midfielder." },
  { question: "What are the Group C fixtures?", answer: "June 13: Haiti vs Scotland (Gillette Stadium). June 14: Brazil vs Morocco (MetLife Stadium). June 19: Brazil vs Haiti (MetLife Stadium) and Morocco vs Scotland (Lincoln Financial Field). June 25: Brazil vs Scotland (MetLife Stadium) and Morocco vs Haiti (Lincoln Financial Field)." },
  { question: "Could three teams from Group C advance?", answer: "Yes — Brazil is virtually certain to qualify, Morocco is strongly favored, and Scotland's third-place scenario includes a path to the knockout stage as one of the 8 best third-place teams. The expanded format makes this a realistic outcome." },
]

export default function GroupCPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <JsonLd data={faqJsonLd(groupCFAQs)} />
      <JsonLd data={breadcrumbJsonLd([{name:"Home",url:"/"},{name:"Group Predictions",url:"/2026-world-cup-group-predictions"},{name:"Group C",url:"/2026-world-cup-group-c-predictions"}], SITE_URL)} />

      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-sports-green">Home</Link><ChevronRight className="h-3 w-3"/>
        <Link href="/2026-world-cup-group-predictions" className="hover:text-sports-green">Group Predictions</Link><ChevronRight className="h-3 w-3"/>
        <span className="text-foreground font-medium">Group C</span>
      </nav>

      <h1 className="text-4xl font-extrabold tracking-tight mb-4">World Cup 2026 Group C Predictions</h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
        Five-time champions Brazil face 2022 semifinalists Morocco, a resurgent Scotland, and tournament debutants Haiti — a group defined by the clash between football royalty and the sport's most inspiring underdogs.
      </p>

      <Card className="mb-8"><CardHeader><CardTitle>Group Overview</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
        <p>Group C is the tournament's most narratively rich group — a collision of Brazil's institutional greatness, Morocco's historic 2022 semifinal run, Scotland's 28-year return to the World Cup, and Haiti's 52-year journey back to football's biggest stage. The talent spread is the group's defining characteristic: Brazil at #5 and Morocco at #12 are two of the world's best teams, while Scotland (#28) is Europe's most improved side, and Haiti (#73) is a genuine Cinderella.</p>
        <p>The group is likely to be decided in the opening round. Brazil vs Morocco at MetLife Stadium on June 14 is the earliest meeting of top-12 ranked teams at this World Cup. A draw would blow the group wide open; a Brazil victory would allow the Seleção to manage the remaining fixtures. Scotland's match against Haiti on June 13 carries enormous pressure — a must-win if they harbor knockout-stage ambitions.</p>
      </CardContent></Card>

      <h2 className="text-2xl font-bold mb-4">Group C Teams</h2>
      <div className="space-y-4 mb-8">
        {groupC.map((t) => (
          <Card key={t.name}><CardContent className="p-5">
            <div className="flex items-start gap-3 mb-3"><span className="text-3xl">{t.flag}</span><div><h3 className="font-bold text-lg">{t.name}</h3><Badge variant="secondary" className="mr-1">#{t.rank} FIFA</Badge><Badge variant="outline">Coach: {t.coach}</Badge></div></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div><strong className="text-sports-green">Strengths:</strong> {t.strength}</div>
              <div><strong className="text-red-500">Weaknesses:</strong> {t.weakness}</div>
            </div>
            <div className="mt-3"><Link href={`/team/${t.name.toLowerCase().replace(/\s+/g,"-")}`} className="text-xs text-sports-green hover:underline">Full team profile →</Link></div>
          </CardContent></Card>
        ))}
      </div>

      <Card className="mb-8"><CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-sports-green" />Group C Fixtures</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground space-y-2">
        <div className="space-y-3">
          <div className="p-3 bg-muted/50 rounded-lg"><div className="font-semibold text-foreground">June 13 — Matchday 1</div><div className="mt-1">Haiti vs Scotland — 1:00 PM, Gillette Stadium, Foxborough</div></div>
          <div className="p-3 bg-muted/50 rounded-lg"><div className="font-semibold text-foreground">June 14 — Matchday 1</div><div className="mt-1">Brazil vs Morocco — 4:00 PM, MetLife Stadium, East Rutherford</div></div>
          <div className="p-3 bg-muted/50 rounded-lg"><div className="font-semibold text-foreground">June 19 — Matchday 2</div><div className="mt-1">Brazil vs Haiti — 4:00 PM, MetLife Stadium, East Rutherford</div><div>Morocco vs Scotland — 7:00 PM, Lincoln Financial Field, Philadelphia</div></div>
          <div className="p-3 bg-muted/50 rounded-lg"><div className="font-semibold text-foreground">June 25 — Matchday 3 <Badge variant="secondary" className="ml-2">Simultaneous Kickoff</Badge></div><div className="mt-1">Brazil vs Scotland — 3:00 PM, MetLife Stadium, East Rutherford</div><div>Morocco vs Haiti — 3:00 PM, Lincoln Financial Field, Philadelphia</div></div>
        </div>
      </CardContent></Card>

      <Card className="mb-8"><CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-sports-gold" />AI Group Winner Prediction</CardTitle></CardHeader><CardContent>
        <div className="space-y-3">
          {[{team:"Brazil",pct:62,color:"bg-sports-green"},{team:"Morocco",pct:18,color:"bg-sports-blue"},{team:"Scotland",pct:14,color:"bg-sports-gold"},{team:"Haiti",pct:6,color:"bg-muted-foreground"}].map(t=>(<div key={t.team} className="flex items-center gap-3"><span className="font-medium text-sm w-24">{t.team}</span><div className="flex-1 h-3 bg-muted rounded-full overflow-hidden"><div className={`h-full ${t.color} rounded-full`} style={{width:`${t.pct*1.5}%`}}/></div><span className="font-bold text-sm w-12 text-right">{t.pct}%</span></div>))}
        </div>
      </CardContent></Card>

      <Card className="mb-8"><CardHeader><CardTitle className="flex items-center gap-2"><Percent className="h-5 w-5 text-sports-blue" />Qualification Probability</CardTitle></CardHeader><CardContent>
        <div className="space-y-3">
          {[{team:"Brazil",top2:95,advance:97},{team:"Morocco",top2:65,advance:78},{team:"Scotland",top2:28,advance:42},{team:"Haiti",top2:12,advance:18}].map(t=>(<div key={t.team} className="flex items-center gap-3"><span className="font-medium text-sm w-24">{t.team}</span><div className="flex-1"><div className="flex justify-between text-xs mb-1"><span>Top 2: {t.top2}%</span><span>Advance: {t.advance}%</span></div><div className="h-2 bg-muted rounded-full overflow-hidden flex"><div className="h-full bg-sports-green" style={{width:`${t.top2}%`}}/><div className="h-full bg-sports-blue/30" style={{width:`${t.advance-t.top2}%`}}/></div></div></div>))}
        </div>
      </CardContent></Card>

      <Card className="mb-8"><CardHeader><CardTitle className="flex items-center gap-2"><Star className="h-5 w-5 text-sports-gold" />Key Match: Brazil vs Morocco</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
        <p>The June 14 meeting at MetLife Stadium is not just the key match in Group C — it's one of the most anticipated group-stage fixtures of the entire tournament. Brazil's relentless attacking depth against Morocco's fortress defense: Vinicius Jr. vs Achraf Hakimi on the flank, Rodrygo testing Regragui's compact defensive block, Morocco's counter-attacks targeting Brazil's defensive transition vulnerabilities.</p>
        <p>A Morocco victory or draw would be one of the tournament's defining early results and would open the door for Morocco to win the group — something no African team has done ahead of Brazil or Argentina in World Cup history. A Brazil victory would restore the expected order and allow the Seleção to manage their remaining fixtures with less pressure.</p>
      </CardContent></Card>

      <Card className="mb-8"><CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-sports-blue" />Dark Horse: Scotland</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
        <p>Scotland's 28-year World Cup absence masks a team that has been quietly improving for four years under Steve Clarke. They qualified by finishing ahead of a strong Norway side led by Erling Haaland — no small achievement. Scott McTominay's goal-scoring from midfield (7 goals in qualifying) is not a fluke: it's a designed tactical feature that exploits the space between opposition midfield and defensive lines.</p>
        <p>Scotland's path to the knockout stage runs through their opener against Haiti — a must-win — and then a result against Morocco or Brazil. Their set-piece threat, physical organization, and the emotional energy of the Tartan Army make them the group's most dangerous underdog. If McTominay scores early against Haiti, Scotland's confidence could carry them further than the rankings suggest.</p>
      </CardContent></Card>

      <Card className="mb-8"><CardHeader><CardTitle>Predicted Final Standings</CardTitle></CardHeader><CardContent>
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left py-2">Pos</th><th className="text-left py-2">Team</th><th className="text-center py-2">Pts</th><th className="text-center py-2">GF</th><th className="text-center py-2">GA</th><th className="text-left py-2">Status</th></tr></thead><tbody>
          <tr className="border-b"><td className="py-2 font-bold">1</td><td className="py-2">Brazil</td><td className="text-center py-2">9</td><td className="text-center py-2">7</td><td className="text-center py-2">1</td><td className="py-2"><Badge variant="success">Round of 32</Badge></td></tr>
          <tr className="border-b"><td className="py-2 font-bold">2</td><td className="py-2">Morocco</td><td className="text-center py-2">6</td><td className="text-center py-2">4</td><td className="text-center py-2">2</td><td className="py-2"><Badge variant="info">Round of 32</Badge></td></tr>
          <tr className="border-b"><td className="py-2 font-bold">3</td><td className="py-2">Scotland</td><td className="text-center py-2">3</td><td className="text-center py-2">2</td><td className="text-center py-2">4</td><td className="py-2"><Badge variant="warning">Best 3rd?</Badge></td></tr>
          <tr><td className="py-2 font-bold">4</td><td className="py-2">Haiti</td><td className="text-center py-2">0</td><td className="text-center py-2">0</td><td className="text-center py-2">6</td><td className="py-2"><Badge variant="outline">Eliminated</Badge></td></tr>
        </tbody></table></div>
      </CardContent></Card>

      <div className="flex flex-wrap gap-3 mb-10">
        <Link href="/2026-world-cup-group-a-predictions"><Badge className="cursor-pointer">Group A →</Badge></Link>
        <Link href="/2026-world-cup-group-b-predictions"><Badge className="cursor-pointer">Group B →</Badge></Link>
        <Link href="/2026-world-cup-group-d-predictions"><Badge className="cursor-pointer">Group D →</Badge></Link>
        <Link href="/winner-predictions"><Badge variant="secondary" className="cursor-pointer">Winner Predictions →</Badge></Link>
      </div>

      <FAQSection faqs={groupCFAQs} />
    </div>
  )
}
