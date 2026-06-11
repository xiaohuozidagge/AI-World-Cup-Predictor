import type { Metadata } from "next"
import Link from "next/link"
import { Mail, Globe, MessageCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Contact — AI World Cup Predictions 2026",
  description: "Contact AI World Cup Predictions. Report errors, ask about our methodology, or get in touch with our team.",
  openGraph: {
    title: "Contact — AI World Cup Predictions 2026",
    description: "Get in touch with the AI World Cup Predictions team.",
  },
}

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">Contact</h1>
      <p className="text-lg text-muted-foreground mb-10">
        Have questions about our predictions? Found an error? Want to discuss football data? We would love to hear from you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Mail className="h-5 w-5 text-sports-green" />Email</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>contact@aipredictor.world</p>
            <p className="mt-1 text-xs">We respond within 48 hours.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Globe className="h-5 w-5 text-sports-blue" />GitHub</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Report issues or contribute:</p>
            <p className="mt-1 text-xs font-mono">github.com/ai-world-cup-predictions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><MessageCircle className="h-5 w-5 text-sports-gold" />Social</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Follow us for updates during the tournament.</p>
            <p className="mt-1 text-xs">@AIWorldCupPred on X, Bluesky</p>
          </CardContent>
        </Card>
      </div>

      <div className="border-t pt-8 text-sm text-muted-foreground space-y-3">
        <h3 className="font-semibold text-foreground">Common Reasons to Contact Us</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Report an error</strong> — incorrect team data, broken links, or factual mistakes.</li>
          <li><strong>Methodology questions</strong> — want to understand how a specific prediction was generated.</li>
          <li><strong>Press & media</strong> — interested in covering or referencing our predictions.</li>
          <li><strong>Partnership inquiries</strong> — interested in collaborating.</li>
        </ul>

        <div className="mt-6 space-x-4">
          <Link href="/how-we-predict" className="text-sports-green hover:underline font-medium">How we predict →</Link>
          <Link href="/about" className="text-sports-green hover:underline font-medium">About us →</Link>
        </div>
      </div>
    </div>
  )
}
