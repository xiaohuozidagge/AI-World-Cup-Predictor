import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { JsonLd, organizationJsonLd } from "@/lib/jsonld"
import { SITE_URL, SITE_NAME } from "@/lib/constants"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default:
      "AI World Cup Predictions 2026 — Match Forecasts & Winner Odds",
    template: "%s | AI World Cup Predictions 2026",
  },

  description:
    "AI-powered World Cup 2026 predictions. Get match forecasts, win probabilities, predicted scores, team analysis, and winner odds for every FIFA World Cup 2026 fixture.",

  keywords: [
    "World Cup Predictions 2026",
    "World Cup 2026",
    "FIFA World Cup predictions",
    "AI football predictions",
    "World Cup match forecast",
    "World Cup winner odds",
  ],

  authors: [
    {
      name: "AI World Cup Predictions",
    },
  ],

  creator: "AI World Cup Predictions",

  metadataBase: new URL(SITE_URL),

  verification: {
    google: "REPLACE_WITH_YOUR_GSC_VERIFICATION_CODE",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title:
      "AI World Cup Predictions 2026 — Match Forecasts & Winner Odds",
    description:
      "AI-powered World Cup 2026 predictions. Get match forecasts, win probabilities, predicted scores, team analysis, and winner odds.",
  },

  twitter: {
    card: "summary_large_image",
    title: "AI World Cup Predictions 2026",
    description:
      "AI-powered World Cup 2026 predictions. Match forecasts, win probabilities, predicted scores, and winner odds.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "AI-powered predictions and analysis for the 2026 FIFA World Cup.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/predictions?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WHJD1T3GDX"
          strategy="afterInteractive"
        />

        <Script id="ga4-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag() {
              window.dataLayer.push(arguments);
            }

            gtag("js", new Date());
            gtag("config", "G-WHJD1T3GDX");
          `}
        </Script>

        {/* Organization structured data */}
        <JsonLd data={organizationJsonLd()} />

        {/* Website structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
      </head>

      <body className="flex min-h-full flex-col">
        <Header />

        {/* Adsterra advertisement */}
        <div className="mx-auto w-full max-w-7xl px-4 py-4">
          <div id="container-bd622784d68115f3cb961983a0aa445c" />
        </div>

        <Script
          id="adsterra-native-ad"
          src="https://servicessitclaims.com/bd622784d68115f3cb961983a0aa445c/invoke.js"
          data-cfasync="false"
          strategy="afterInteractive"
        />

        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  )
}
