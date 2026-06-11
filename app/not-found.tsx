import Link from "next/link"
import { Trophy, Search, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-24 text-center">
      <Trophy className="h-16 w-16 text-muted-foreground/30 mx-auto mb-6" />
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">Page Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
        The page you&apos;re looking for doesn&apos;t exist. It may have moved, or the match or team you&apos;re searching for isn&apos;t available yet.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/">
          <Button className="bg-sports-green hover:bg-sports-green/90">
            Go Home
          </Button>
        </Link>
        <Link href="/predictions">
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Browse Predictions
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
