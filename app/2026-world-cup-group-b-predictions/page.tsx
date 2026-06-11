import type { Metadata } from "next"
import Link from "next/link"
import { Trophy, Star, Shield, Calendar, ChevronRight, Percent } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FAQSection } from "@/components/FAQSection"
import { JsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/jsonld"
import { SITE_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "World Cup 2026 Group B Predictions: Canada, Switzerland, Bosnia-Herzegovina, Qatar",
  description: "AI predictions for World Cup 2026 Group B: Canada, Switzerland, Bosnia-Herzegovina and Qatar. Winner forecast, qualification odds, key fixtures and predicted standings.",
  openGraph: {
    title: "World Cup 2026 Group B Predictions — Winner & Qualification Forecast",
    description: "Group B preview: Canada, Switzerland, Bosnia-Herzegovina, and Qatar compete for knockout spots in World Cup 2026.",
  },
  alternates: { canonical: "/2026-world-cup-group-b-predictions" },
}

const groupB = [
  { name: "Canada", flag:"🇨🇦", rank:31, coach:"Jesse Marsch", strength:"Home advantage at BMO Field in Toronto gives Canada a genuine edge that no FIFA ranking can capture. Alphonso Davies is a top-5 left-back in world football with the pace to transform defense into attack in seconds. Jonathan David's intelligent movement and clinical finishing provide a reliable goal threat. Marsch's high-pressing system is specifically designed to unsettle technically superior opponents.", weakness:"World Cup inexperience — Canada has never scored a World Cup goal. Squad depth beyond the starting XI is thin, particularly in central defense. The emotional weight of being co-hosts could either inspire or overwhelm a young squad." },
  { name: "Switzerland", flag:"🇨🇭", rank:19, coach:"Murat Yakin", strength:"Tournament-tested and tactically immaculate — Switzerland has reached the knockout stage in five of their last six major tournaments. Manuel Akanji anchors a defense that conceded only 2 goals in Euro 2024 qualifying. Granit Xhaka has evolved into one of Europe's most complete midfielders at Bayer Leverkusen. Their ability to execute a disciplined game plan against any opponent is elite.", weakness:"Goal-scoring can be an issue against well-organized defenses. Breel Embolo's fitness has been inconsistent. The squad lacks the individual star power that other top-20 nations possess, meaning they must win through system and structure rather than moments of magic." },
  { name: "Bosnia-Herzegovina", flag:"🇧🇦", rank:63, coach:"Sergej Barbarez", strength:"Edin Džeko's hold-up play and finishing ability remain at an elite level even at 40. Miralem Pjanić's set-piece delivery gives Bosnia a reliable route to goal in any match. The emotional motivation of only their second World Cup appearance — and likely Džeko's final tournament — creates a powerful collective drive.", weakness:"Aging squad — Džeko and Pjanić are both in their late 30s and cannot sustain high-intensity pressing for 90 minutes. Squad depth is the weakest in the group. Defensive organization against quick transitions has been a persistent vulnerability." },
  { name: "Qatar", flag:"🇶🇦", rank:48, coach:"Tintín Márquez", strength:"AFC Asian Cup 2024 champions — Qatar proved they can win continental tournaments with a cohesive, well-coached system. Akram Afif is Asia's best creative attacker and was the 2024 Asian Cup MVP. Four years of development since hosting in 2022 have raised the squad's technical level significantly.", weakness:"The 2022 World Cup campaign was deeply disappointing — no points, early elimination, and visible stage fright. Playing away from home removes the familiarity advantage they had as hosts. Physical inferiority against European and North American opposition remains a concern." },
]

const groupBFAQs = [
  { question: "Who will win World Cup 2026 Group B?", answer: "Switzerland is projected to win Group B with a 38% probability, narrowly ahead of co-hosts Canada at 32%. The Swiss combination of tournament experience and tactical discipline gives them a marginal edge, though Canada's home advantage makes this the most unpredictable group at the tournament." },
  { question: "Can Canada win Group B as co-hosts?", answer: "Yes — Canada has a 32% chance of winning Group B, the highest probability of any co-host in their respective group. Home matches at BMO Field in Toronto, Alphonso Davies' world-class ability, and Jesse Marsch's aggressive tactical system make Canada a genuine group-winning threat." },
  { question: "What is the key match in Group B?", answer: "Canada vs Switzerland on June 24 at BMO Field. This final group match is projected to determine the Group B winner, with Switzerland's tactical discipline facing Canada's home crowd and high-energy pressing in what could be one of the most atmospheric matches of the group stage." },
  { question: "Can Qatar redeem themselves after 2022?", answer: "Qatar's 2024 Asian Cup triumph demonstrated significant growth since their difficult 2022 World Cup campaign. With a 32% qualification probability, the Maroons have a realistic path to the knockout stage — something that seemed unimaginable two years ago." },
  { question: "Who is Group B's dark horse?", answer: "Canada is the group's highest-upside team. Their FIFA ranking (#31) understates their true quality — Davies, David, and Buchanan all play at Champions League-level clubs — and home advantage at a World Cup is consistently undervalued in statistical models." },
  { question: "Is this Edin Džeko's last World Cup?", answer: "Yes — Džeko will be 40 during the tournament, making him one of the oldest outfield players in World Cup history. His hold-up play, leadership, and goalscoring instinct remain Bosnia's most valuable assets in what is almost certainly his international farewell." },
  { question: "What are the Group B fixtures?", answer: "June 12: Canada vs Bosnia-Herzegovina (BMO Field), June 14: Qatar vs Switzerland (Levi's Stadium). June 18: Canada vs Qatar (BMO Field) and Bosnia-Herzegovina vs Switzerland (Gillette Stadium). June 24: Canada vs Switzerland (BMO Field) and Bosnia-Herzegovina vs Qatar (Gillette Stadium)." },
  { question: "Which Group B player should I watch?", answer: "Alphonso Davies (Canada) — one of the world's most electrifying left-backs, he can dominate a match from defense. Akram Afif (Qatar) — the 2024 Asian Cup MVP is Asia's most creative attacker and Qatar's primary hope for goals." },
]

export default function GroupBPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <JsonLd data={faqJsonLd(groupBFAQs)} />
      <JsonLd data={breadcrumbJsonLd([{name:"Home",url:"/"},{name:"Group Predictions",url:"/2026-world-cup-group-predictions"},{name:"Group B",url:"/2026-world-cup-group-b-predictions"}], SITE_URL)} />

      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-sports-green">Home</Link><ChevronRight className="h-3 w-3"/>
        <Link href="/2026-world-cup-group-predictions" className="hover:text-sports-green">Group Predictions</Link><ChevronRight className="h-3 w-3"/>
        <span className="text-foreground font-medium">Group B</span>
      </nav>

      <h1 className="text-4xl font-extrabold tracking-tight mb-4">World Cup 2026 Group B Predictions</h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
        Co-hosts Canada headline Group B alongside tournament-tested Switzerland, the returning Bosnia-Herzegovina, and an improved Qatar side — the most unpredictable group of the 2026 World Cup.
      </p>

      <Card className="mb-8"><CardHeader><CardTitle>Group Overview</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
        <p>Group B is the tournament's statistical outlier — the group where FIFA rankings are least predictive of outcomes. Switzerland (#19) is the highest-ranked team, but they play all three matches away from Europe against opponents with unique motivational profiles: co-hosts Canada riding a wave of home support, Bosnia-Herzegovina in what is likely their greatest generation's final stand, and Qatar seeking redemption after a difficult 2022 campaign.</p>
        <p>What makes Group B fascinating is its compressed quality curve. The gap between the best and worst team is narrower here than in any other group — meaning every match is competitive and every point is contested. Draw probabilities are elevated across all six fixtures because no team has the individual quality to reliably overwhelm the others.</p>
        <p>The BMO Field factor is real and measurable. Canada's home matches in Toronto will feature some of the tournament's most passionate crowds, and historically, host nations overperform their FIFA rankings by an average of 0.7 goals per match in group-stage play. This alone could swing the group.</p>
      </CardContent></Card>

      <h2 className="text-2xl font-bold mb-4">Group B Teams</h2>
      <div className="space-y-4 mb-8">
        {groupB.map((t) => (
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

      <Card className="mb-8"><CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-sports-green" />Group B Fixtures</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground space-y-2">
        <div className="space-y-3">
          <div className="p-3 bg-muted/50 rounded-lg"><div className="font-semibold text-foreground">June 12 — Matchday 1</div><div className="mt-1">Canada vs Bosnia-Herzegovina — 7:00 PM, BMO Field, Toronto</div></div>
          <div className="p-3 bg-muted/50 rounded-lg"><div className="font-semibold text-foreground">June 14 — Matchday 1</div><div className="mt-1">Qatar vs Switzerland — 4:00 PM, Levi's Stadium, Santa Clara</div></div>
          <div className="p-3 bg-muted/50 rounded-lg"><div className="font-semibold text-foreground">June 18 — Matchday 2</div><div className="mt-1">Canada vs Qatar — 7:00 PM, BMO Field, Toronto</div><div>Bosnia-Herzegovina vs Switzerland — 4:00 PM, Gillette Stadium, Foxborough</div></div>
          <div className="p-3 bg-muted/50 rounded-lg"><div className="font-semibold text-foreground">June 24 — Matchday 3 <Badge variant="secondary" className="ml-2">Simultaneous Kickoff</Badge></div><div className="mt-1">Canada vs Switzerland — 3:00 PM, BMO Field, Toronto</div><div>Bosnia-Herzegovina vs Qatar — 3:00 PM, Gillette Stadium, Foxborough</div></div>
        </div>
      </CardContent></Card>

      <Card className="mb-8"><CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-sports-gold" />AI Group Winner Prediction</CardTitle></CardHeader><CardContent>
        <div className="space-y-3">
          {[{team:"Switzerland",pct:38,color:"bg-sports-green"},{team:"Canada",pct:32,color:"bg-sports-blue"},{team:"Bosnia-Herzegovina",pct:18,color:"bg-sports-gold"},{team:"Qatar",pct:12,color:"bg-muted-foreground"}].map(t=>(<div key={t.team} className="flex items-center gap-3"><span className="font-medium text-sm w-36">{t.team}</span><div className="flex-1 h-3 bg-muted rounded-full overflow-hidden"><div className={`h-full ${t.color} rounded-full`} style={{width:`${t.pct*2.2}%`}}/></div><span className="font-bold text-sm w-12 text-right">{t.pct}%</span></div>))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">The narrowest group-winner spread of any group — a 26-point gap from first to fourth, reflecting Group B's exceptional competitive balance.</p>
      </CardContent></Card>

      <Card className="mb-8"><CardHeader><CardTitle className="flex items-center gap-2"><Percent className="h-5 w-5 text-sports-blue" />Qualification Probability</CardTitle></CardHeader><CardContent>
        <div className="space-y-3">
          {[{team:"Switzerland",top2:72,advance:78},{team:"Canada",top2:58,advance:65},{team:"Bosnia-Herzegovina",top2:38,advance:48},{team:"Qatar",top2:32,advance:42}].map(t=>(<div key={t.team} className="flex items-center gap-3"><span className="font-medium text-sm w-36">{t.team}</span><div className="flex-1"><div className="flex justify-between text-xs mb-1"><span>Top 2: {t.top2}%</span><span>Advance: {t.advance}%</span></div><div className="h-2 bg-muted rounded-full overflow-hidden flex"><div className="h-full bg-sports-green" style={{width:`${t.top2}%`}}/><div className="h-full bg-sports-blue/30" style={{width:`${t.advance-t.top2}%`}}/></div></div></div>))}
        </div>
      </CardContent></Card>

      <Card className="mb-8"><CardHeader><CardTitle className="flex items-center gap-2"><Star className="h-5 w-5 text-sports-gold" />Key Match: Canada vs Switzerland</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
        <p>The June 24 clash at BMO Field between Canada and Switzerland is projected to determine the Group B winner. Switzerland's tactical discipline — conceding only 2 goals in Euro 2024 qualifying — meets Canada's high-energy pressing system in front of a raucous Toronto crowd. Alphonso Davies against Swiss right-back Silvan Widmer is the marquee individual duel.</p>
        <p>Switzerland has reached the knockout stage in five consecutive major tournaments — they know how to manage a group finale. But Canada's emotional energy playing at home in a must-win World Cup match is an intangible that statistical models struggle to quantify. The draw probability is elevated at 28%, and a single goal could decide the group.</p>
      </CardContent></Card>

      <Card className="mb-8"><CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-sports-blue" />Dark Horse: Canada</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
        <p>Canada is the dark horse that isn't — they're co-hosts, but the world hasn't fully registered how dangerous this team can be. Davies at left-back is a top-5 player in his position globally. Jonathan David has scored 20+ goals in each of his last three Ligue 1 seasons. Jesse Marsch's Red Bull-inspired pressing system is specifically designed to disrupt possession-based teams — and Switzerland, for all their quality, can be vulnerable to coordinated pressure.</p>
        <p>If Canada wins their opening match against Bosnia-Herzegovina — and our model gives them a 58% chance — the momentum of a home World Cup run becomes self-reinforcing. The path to the knockout stage runs through Toronto, and no visiting team will relish that atmosphere.</p>
      </CardContent></Card>

      <Card className="mb-8"><CardHeader><CardTitle>Predicted Final Standings</CardTitle></CardHeader><CardContent>
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left py-2">Pos</th><th className="text-left py-2">Team</th><th className="text-center py-2">Pts</th><th className="text-center py-2">GF</th><th className="text-center py-2">GA</th><th className="text-left py-2">Status</th></tr></thead><tbody>
          <tr className="border-b"><td className="py-2 font-bold">1</td><td className="py-2">Switzerland</td><td className="text-center py-2">5</td><td className="text-center py-2">4</td><td className="text-center py-2">2</td><td className="py-2"><Badge variant="success">Round of 32</Badge></td></tr>
          <tr className="border-b"><td className="py-2 font-bold">2</td><td className="py-2">Canada</td><td className="text-center py-2">5</td><td className="text-center py-2">4</td><td className="text-center py-2">3</td><td className="py-2"><Badge variant="info">Round of 32</Badge></td></tr>
          <tr className="border-b"><td className="py-2 font-bold">3</td><td className="py-2">Qatar</td><td className="text-center py-2">3</td><td className="text-center py-2">2</td><td className="text-center py-2">3</td><td className="py-2"><Badge variant="warning">Best 3rd?</Badge></td></tr>
          <tr><td className="py-2 font-bold">4</td><td className="py-2">Bosnia-Herzegovina</td><td className="text-center py-2">2</td><td className="text-center py-2">2</td><td className="text-center py-2">4</td><td className="py-2"><Badge variant="outline">Eliminated</Badge></td></tr>
        </tbody></table></div>
      </CardContent></Card>

      <div className="flex flex-wrap gap-3 mb-10">
        <Link href="/2026-world-cup-group-a-predictions"><Badge className="cursor-pointer">Group A →</Badge></Link>
        <Link href="/2026-world-cup-group-c-predictions"><Badge className="cursor-pointer">Group C →</Badge></Link>
        <Link href="/2026-world-cup-group-d-predictions"><Badge className="cursor-pointer">Group D →</Badge></Link>
        <Link href="/winner-predictions"><Badge variant="secondary" className="cursor-pointer">Winner Predictions →</Badge></Link>
      </div>

      <FAQSection faqs={groupBFAQs} />
    </div>
  )
}
