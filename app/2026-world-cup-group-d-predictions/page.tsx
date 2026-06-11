import type { Metadata } from "next"
import Link from "next/link"
import { Trophy, Star, Shield, Calendar, ChevronRight, Percent } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FAQSection } from "@/components/FAQSection"
import { JsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/jsonld"
import { SITE_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "World Cup 2026 Group D Predictions: USA, Turkey, Paraguay, Australia",
  description: "AI predictions for World Cup 2026 Group D featuring United States, Turkey, Paraguay and Australia. Winner forecast, qualification odds and predicted standings.",
  openGraph: {
    title: "World Cup 2026 Group D Predictions — USA, Turkey & Qualification Forecast",
    description: "Group D preview: Co-hosts USA face a rising Turkey, resilient Paraguay, and Australia's physical challenge in a wide-open group.",
  },
  alternates: { canonical: "/2026-world-cup-group-d-predictions" },
}

const groupD = [
  { name: "United States", flag:"🇺🇸", rank:16, coach:"Mauricio Pochettino", strength:"The most talented USMNT generation ever — Pulisic, Reyna, McKennie, and Adams all play at Champions League-level clubs. Pochettino's tactical expertise, honed at Tottenham, PSG, and Chelsea, gives the USA an elite-level manager they've never had. Home advantage at SoFi Stadium in Los Angeles for two of their three group matches is a significant edge.", weakness:"Defensive chemistry under Pochettino is still developing — the USA has conceded in 4 of their last 5 competitive matches. Lack of a proven international goalscorer beyond Pulisic. The psychological weight of being co-hosts with the highest expectations in USMNT history." },
  { name: "Turkey", flag:"🇹🇷", rank:32, coach:"Vincenzo Montella", strength:"A golden generation led by teen sensation Arda Güler and Inter's Çalhanoğlu. Turkey finished third at the 2002 World Cup and Euro 2008 — they have tournament pedigree. Kenan Yıldız is one of Europe's most exciting young attackers. Technical quality in midfield matches any team in the group.", weakness:"Defensive inconsistency — capable of clean sheets against strong opponents and collapses against weaker ones in the same qualifying cycle. Young squad (average age 24.5) lacks tournament experience. The gap between their best and worst performances is too wide." },
  { name: "Paraguay", flag:"🇵🇾", rank:47, coach:"Gustavo Alfaro", strength:"CONMEBOL qualifying forged their resilience — no team from South America arrives at a World Cup soft. Miguel Almirón's Premier League pace and direct running is a genuine counter-attacking weapon. Julio Enciso's creative flair gives Paraguay an X-factor that Group D's other teams will struggle to contain.", weakness:"Goal-scoring has been a persistent issue — Paraguay averaged under 1.0 goals per match in CONMEBOL qualifying. Squad depth behind the starting XI is limited, particularly in attacking positions. Struggles against teams that control possession." },
  { name: "Australia", flag:"🇦🇺", rank:26, coach:"Tony Popovic", strength:"2022 Round of 16 participants with a clear identity: physical, organized, and difficult to break down. Harry Souttar's aerial dominance at both ends of the pitch is a genuine weapon. Set-piece efficiency is among the best in Asian football. Tournament experience from 2022 means Australia won't be intimidated.", weakness:"Technical limitation against elite pressing teams. Goal-scoring from open play is a persistent challenge — they relied heavily on set pieces and penalties in qualifying. The travel burden from Oceania/Asia to North America for match preparation adds logistical complexity." },
]

const groupDFAQs = [
  { question: "Who will win World Cup 2026 Group D?", answer: "The United States is projected to win Group D with a 38% probability, the narrowest favorite margin among the four co-host groups. Turkey (28%), Paraguay (20%), and Australia (14%) all have realistic paths to the top spot in what is the most evenly balanced group featuring a host nation." },
  { question: "Can the USA win all three group matches?", answer: "Our model gives the USA a 15% chance of a perfect group stage. Turkey's technical quality and Australia's physical organization make this unlikely, though Pochettino's tactical flexibility gives the USMNT the tools to adapt to each opponent's style." },
  { question: "What is the key match in Group D?", answer: "USA vs Turkey on June 24 at SoFi Stadium. This final group match is projected to determine the Group D winner, with Pochettino's tactical expertise facing Turkey's golden generation in front of a capacity Los Angeles crowd." },
  { question: "Is Turkey a genuine threat to win the group?", answer: "Yes — Turkey's 28% group-winning probability is the highest of any second-seeded team in Groups A-D. Arda Güler's creative talent and Çalhanoğlu's set-piece delivery give Turkey multiple paths to goal, and their technical ceiling is higher than any team in the group, including the USA." },
  { question: "Can Australia repeat their 2022 Round of 16 run?", answer: "Australia has a 38% qualification probability. Their physical organization, set-piece threat, and tournament experience from 2022 make them a difficult opponent for any team in Group D. A draw against Turkey or the USA could be the result that opens their knockout path." },
  { question: "Who is Group D's dark horse?", answer: "Paraguay is the group's most dangerous underdog. CONMEBOL qualifying is the world's most grueling — no easy matches, no minnows — and Paraguay emerged battle-hardened. Almirón and Enciso give them counter-attacking weapons that can trouble any defense, particularly if they score first." },
  { question: "What are the Group D fixtures?", answer: "June 12: USA vs Paraguay (SoFi Stadium). June 13: Australia vs Turkey (BC Place). June 18: USA vs Australia (SoFi Stadium) and Paraguay vs Turkey (NRG Stadium). June 24: USA vs Turkey (SoFi Stadium) and Paraguay vs Australia (NRG Stadium)." },
  { question: "Which player should I watch in Group D?", answer: "Christian Pulisic (USA) in career-best form for club and country. Arda Güler (Turkey) — a generational talent at 20 years old who scored on his Champions League debut for Real Madrid. Harry Souttar (Australia) — a 6'7\" center-back who dominates both penalty areas." },
]

export default function GroupDPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <JsonLd data={faqJsonLd(groupDFAQs)} />
      <JsonLd data={breadcrumbJsonLd([{name:"Home",url:"/"},{name:"Group Predictions",url:"/2026-world-cup-group-predictions"},{name:"Group D",url:"/2026-world-cup-group-d-predictions"}], SITE_URL)} />

      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-sports-green">Home</Link><ChevronRight className="h-3 w-3"/>
        <Link href="/2026-world-cup-group-predictions" className="hover:text-sports-green">Group Predictions</Link><ChevronRight className="h-3 w-3"/>
        <span className="text-foreground font-medium">Group D</span>
      </nav>

      <h1 className="text-4xl font-extrabold tracking-tight mb-4">World Cup 2026 Group D Predictions</h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
        Co-hosts USA face a rising Turkey, resilient Paraguay, and 2022 Round of 16 participants Australia in the most evenly balanced group featuring a host nation at World Cup 2026.
      </p>

      <Card className="mb-8"><CardHeader><CardTitle>Group Overview</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
        <p>Group D is the host nation group where the margins are thinnest. The United States enters as favorite — the most talented USMNT generation in history, guided by a Champions League-finalist manager, playing group matches at the spectacular SoFi Stadium — but Turkey, Paraguay, and Australia each present distinct challenges that make a comfortable group stage unlikely.</p>
        <p>Turkey brings the group's highest technical ceiling through Arda Güler and Hakan Çalhanoğlu — on their best day, they can outplay anyone. Paraguay arrives battle-hardened from CONMEBOL qualifying, where no match is easy and every point is earned through physical and mental endurance. Australia's 2022 Round of 16 run proved they belong in knockout conversations, and their set-piece efficiency and physical organization translate to any opponent.</p>
        <p>The group's defining characteristic is stylistic diversity: the USA's pressing intensity meets Turkey's technical possession, Paraguay's South American resilience, and Australia's physical directness. No team can impose a single approach — adaptability will determine who advances.</p>
      </CardContent></Card>

      <h2 className="text-2xl font-bold mb-4">Group D Teams</h2>
      <div className="space-y-4 mb-8">
        {groupD.map((t) => (
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

      <Card className="mb-8"><CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-sports-green" />Group D Fixtures</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground space-y-2">
        <div className="space-y-3">
          <div className="p-3 bg-muted/50 rounded-lg"><div className="font-semibold text-foreground">June 12 — Matchday 1</div><div className="mt-1">USA vs Paraguay — 7:00 PM, SoFi Stadium, Inglewood</div></div>
          <div className="p-3 bg-muted/50 rounded-lg"><div className="font-semibold text-foreground">June 13 — Matchday 1</div><div className="mt-1">Australia vs Turkey — 4:00 PM, BC Place, Vancouver</div></div>
          <div className="p-3 bg-muted/50 rounded-lg"><div className="font-semibold text-foreground">June 18 — Matchday 2</div><div className="mt-1">USA vs Australia — 7:00 PM, SoFi Stadium, Inglewood</div><div>Paraguay vs Turkey — 4:00 PM, NRG Stadium, Houston</div></div>
          <div className="p-3 bg-muted/50 rounded-lg"><div className="font-semibold text-foreground">June 24 — Matchday 3 <Badge variant="secondary" className="ml-2">Simultaneous Kickoff</Badge></div><div className="mt-1">USA vs Turkey — 3:00 PM, SoFi Stadium, Inglewood</div><div>Paraguay vs Australia — 3:00 PM, NRG Stadium, Houston</div></div>
        </div>
      </CardContent></Card>

      <Card className="mb-8"><CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-sports-gold" />AI Group Winner Prediction</CardTitle></CardHeader><CardContent>
        <div className="space-y-3">
          {[{team:"United States",pct:38,color:"bg-sports-green"},{team:"Turkey",pct:28,color:"bg-sports-blue"},{team:"Paraguay",pct:20,color:"bg-sports-gold"},{team:"Australia",pct:14,color:"bg-muted-foreground"}].map(t=>(<div key={t.team} className="flex items-center gap-3"><span className="font-medium text-sm w-28">{t.team}</span><div className="flex-1 h-3 bg-muted rounded-full overflow-hidden"><div className={`h-full ${t.color} rounded-full`} style={{width:`${t.pct*2.2}%`}}/></div><span className="font-bold text-sm w-12 text-right">{t.pct}%</span></div>))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">The narrowest host-nation group-winner probability of the tournament — a 24-point spread from first to fourth, confirming Group D as the most genuinely competitive group featuring a co-host.</p>
      </CardContent></Card>

      <Card className="mb-8"><CardHeader><CardTitle className="flex items-center gap-2"><Percent className="h-5 w-5 text-sports-blue" />Qualification Probability</CardTitle></CardHeader><CardContent>
        <div className="space-y-3">
          {[{team:"United States",top2:68,advance:78},{team:"Turkey",top2:52,advance:62},{team:"Paraguay",top2:42,advance:55},{team:"Australia",top2:38,advance:48}].map(t=>(<div key={t.team} className="flex items-center gap-3"><span className="font-medium text-sm w-28">{t.team}</span><div className="flex-1"><div className="flex justify-between text-xs mb-1"><span>Top 2: {t.top2}%</span><span>Advance: {t.advance}%</span></div><div className="h-2 bg-muted rounded-full overflow-hidden flex"><div className="h-full bg-sports-green" style={{width:`${t.top2}%`}}/><div className="h-full bg-sports-blue/30" style={{width:`${t.advance-t.top2}%`}}/></div></div></div>))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">All four teams have a &gt;35% chance of advancing — no other group has this level of competitive balance. The best-third-place path is realistic for whichever team finishes 3rd.</p>
      </CardContent></Card>

      <Card className="mb-8"><CardHeader><CardTitle className="flex items-center gap-2"><Star className="h-5 w-5 text-sports-gold" />Key Match: USA vs Turkey</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
        <p>The June 24 finale at SoFi Stadium between the USA and Turkey is projected as Group D's decisive match — and potentially the most consequential host nation group-stage match of the tournament. Pochettino's tactical system against Turkey's technical midfield: McKennie and Adams vs Çalhanoğlu and Güler in the center of the pitch is the battle that will define the match.</p>
        <p>The USA's home advantage is significant — SoFi Stadium will be a pro-American cauldron — but Turkey's young squad has shown they thrive in hostile environments. The draw probability is elevated at 28%, and a single moment of individual quality could decide not just the group winner but the trajectory of both nations' tournaments.</p>
      </CardContent></Card>

      <Card className="mb-8"><CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-sports-blue" />Dark Horse: Paraguay</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
        <p>Paraguay is the team nobody wants to draw in a must-win group match. CONMEBOL qualifying is football's most grueling tournament within a tournament — 18 matches across three years, from La Paz at 12,000 feet to Montevideo's relentless intensity. Paraguay emerged from that crucible with a defensive identity and counter-attacking purpose that translates directly to World Cup success.</p>
        <p>Miguel Almirón's Premier League pace gives Paraguay a transition weapon that can punish any team overcommitting in attack, and Julio Enciso's creative unpredictability makes them dangerous in the final third. Their 55% advancement probability — higher than their top-2 probability — reflects a team built to finish third but advance through the best-third-place route, where their defensive organization becomes a knockout-stage asset.</p>
      </CardContent></Card>

      <Card className="mb-8"><CardHeader><CardTitle>Predicted Final Standings</CardTitle></CardHeader><CardContent>
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left py-2">Pos</th><th className="text-left py-2">Team</th><th className="text-center py-2">Pts</th><th className="text-center py-2">GF</th><th className="text-center py-2">GA</th><th className="text-left py-2">Status</th></tr></thead><tbody>
          <tr className="border-b"><td className="py-2 font-bold">1</td><td className="py-2">United States</td><td className="text-center py-2">5</td><td className="text-center py-2">4</td><td className="text-center py-2">2</td><td className="py-2"><Badge variant="success">Round of 32</Badge></td></tr>
          <tr className="border-b"><td className="py-2 font-bold">2</td><td className="py-2">Turkey</td><td className="text-center py-2">5</td><td className="text-center py-2">4</td><td className="text-center py-2">3</td><td className="py-2"><Badge variant="info">Round of 32</Badge></td></tr>
          <tr className="border-b"><td className="py-2 font-bold">3</td><td className="py-2">Paraguay</td><td className="text-center py-2">3</td><td className="text-center py-2">2</td><td className="text-center py-2">3</td><td className="py-2"><Badge variant="warning">Best 3rd?</Badge></td></tr>
          <tr><td className="py-2 font-bold">4</td><td className="py-2">Australia</td><td className="text-center py-2">2</td><td className="text-center py-2">1</td><td className="text-center py-2">3</td><td className="py-2"><Badge variant="outline">Eliminated</Badge></td></tr>
        </tbody></table></div>
      </CardContent></Card>

      <div className="flex flex-wrap gap-3 mb-10">
        <Link href="/2026-world-cup-group-a-predictions"><Badge className="cursor-pointer">Group A →</Badge></Link>
        <Link href="/2026-world-cup-group-b-predictions"><Badge className="cursor-pointer">Group B →</Badge></Link>
        <Link href="/2026-world-cup-group-c-predictions"><Badge className="cursor-pointer">Group C →</Badge></Link>
        <Link href="/winner-predictions"><Badge variant="secondary" className="cursor-pointer">Winner Predictions →</Badge></Link>
      </div>

      <FAQSection faqs={groupDFAQs} />
    </div>
  )
}
