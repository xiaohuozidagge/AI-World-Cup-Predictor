"use client"

import Link from "next/link"
import { useEffect } from "react"
import { AlertTriangle, ArrowRight, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Page error:", error)
  }, [error])

  return (
    <div className="container mx-auto max-w-7xl px-4 py-24 text-center">
      <AlertTriangle className="h-16 w-16 text-sports-gold/50 mx-auto mb-6" />
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">Something Went Wrong</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
        An unexpected error occurred. Please try again or navigate to another page.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={reset} className="bg-sports-green hover:bg-sports-green/90">
          <RotateCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
        <Link href="/">
          <Button variant="outline">
            Go Home
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
