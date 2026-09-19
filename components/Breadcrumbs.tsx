import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface Crumb {
  name: string
  url?: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
            {item.url ? (
              <Link href={item.url} className="transition-colors hover:text-sports-green">
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-foreground">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
