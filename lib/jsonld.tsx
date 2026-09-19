import React from "react"

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[], baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
    })),
  }
}

export function sportsEventJsonLd(match: {
  name: string
  teamA: string
  teamB: string
  date: string
  stadium: string
  city: string
}) {
  const eventDate = new Date(match.date)
  const endDate = new Date(eventDate.getTime() + 2.5 * 60 * 60 * 1000) // ~2.5h match duration
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: match.name,
    sport: "Soccer",
    startDate: eventDate.toISOString(),
    endDate: endDate.toISOString(),
    location: {
      "@type": "Place",
      name: match.stadium,
      address: {
        "@type": "PostalAddress",
        addressLocality: match.city,
      },
    },
    organizer: {
      "@type": "Organization",
      name: "FIFA",
    },
    homeTeam: {
      "@type": "SportsTeam",
      name: match.teamA,
    },
    awayTeam: {
      "@type": "SportsTeam",
      name: match.teamB,
    },
  }
}

export function footballMatchJsonLd(match: {
  name: string
  startDate: string
  eventStatus: string | null
  url: string
  homeTeam: { name: string; url?: string } | null
  awayTeam: { name: string; url?: string } | null
  venue?: { name: string; city: string } | null
}) {
  const homeTeam = match.homeTeam
    ? {
        "@type": "SportsTeam",
        name: match.homeTeam.name,
        ...(match.homeTeam.url ? { url: match.homeTeam.url } : {}),
      }
    : undefined
  const awayTeam = match.awayTeam
    ? {
        "@type": "SportsTeam",
        name: match.awayTeam.name,
        ...(match.awayTeam.url ? { url: match.awayTeam.url } : {}),
      }
    : undefined
  const location = match.venue
    ? {
        "@type": "Place",
        name: match.venue.name,
        address: { "@type": "PostalAddress", addressLocality: match.venue.city },
      }
    : undefined

  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: match.name,
    sport: "Soccer",
    startDate: match.startDate,
    ...(match.eventStatus ? { eventStatus: match.eventStatus } : {}),
    url: match.url,
    ...(homeTeam ? { homeTeam } : {}),
    ...(awayTeam ? { awayTeam } : {}),
    ...(location ? { location } : {}),
  }
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AI Predictor",
    url: "https://aipredictor.world",
    description: "AI-powered football predictions, match forecasts and data-driven analysis for major football competitions.",
    foundingDate: "2025",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English"],
    },
  }
}
