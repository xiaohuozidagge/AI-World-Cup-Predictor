import type { Metadata } from "next"
import Link from "next/link"
import { Trophy, Users, Globe, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "About AI World Cup Predictions — Our Story",
  description: "About AI World Cup Predictions 2026. Learn about our team, our mission, and why we built the most comprehensive AI-powered World Cup prediction platform.",
  openGraph: {
    title: "About AI World Cup Predictions",
    description: "Learn about the team behind AI World Cup Predictions 2026 and our mission to deliver data-driven match analysis.",
  },
}

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">About Us</h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
        We&apos;re a team of football analysts, data scientists, and software engineers who believe that AI can make football analysis more accessible and data-driven.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-sports-gold" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            <p>We built AI World Cup Predictions to bring transparency and data-driven analysis to World Cup forecasting. Traditional punditry relies on narrative and reputation — we wanted to build something that grounds predictions in measurable data: team form, FIFA rankings, player availability, and historical tournament patterns.</p>
            <p className="mt-3">Every prediction on this site is backed by a documented methodology. We don&apos;t claim to predict the future — we provide probabilistic estimates that help fans understand the likely outcomes of every match.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-sports-blue" />
              Our Team
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            <p>Our team combines:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li><strong>Football Analysts</strong> with experience covering World Cups, Premier League, La Liga, and international tournaments.</li>
              <li><strong>Data Scientists</strong> specializing in probabilistic modeling, Monte Carlo simulation, and sports analytics.</li>
              <li><strong>Software Engineers</strong> building fast, accessible, and SEO-friendly web experiences.</li>
            </ul>
            <p className="mt-3">We&apos;re football fans first. Every team page, every match analysis, every probability bar is built by people who genuinely love the sport.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5 text-sports-green" />
              Editorial Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            <p>All match analysis and predictions are created by our football analysis team. We commit to:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>Hand-written analysis for every match, not templated or auto-generated content.</li>
              <li>Transparent methodology — our model factors and weights are publicly documented.</li>
              <li>Regular updates — predictions are reviewed monthly during the competitive season and weekly during the tournament.</li>
              <li>Corrections — if we publish incorrect information, we correct it promptly and note the update date.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-sports-gold" />
              Content Integrity
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            <p>We do not:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>Use AI to auto-generate match analysis or prediction content.</li>
              <li>Accept payment to adjust prediction probabilities.</li>
              <li>Operate any betting or gambling services.</li>
            </ul>
            <p className="mt-3">This site is an independent fan project. We are not affiliated with FIFA, any national football association, or any sports betting organization. Our predictions are for informational and entertainment purposes only.</p>
          </CardContent>
        </Card>
      </div>

      <div className="border-t pt-8 text-sm text-muted-foreground space-y-3">
        <p><strong>Contact:</strong> Have questions about our methodology or want to report an error? Reach out via our GitHub repository or social channels.</p>
        <p><strong>Last updated:</strong> June 11, 2026</p>
        <p className="mt-4">
          <Link href="/methodology" className="text-sports-green hover:underline font-medium">Read our full methodology →</Link>
        </p>
      </div>
    </div>
  )
}
