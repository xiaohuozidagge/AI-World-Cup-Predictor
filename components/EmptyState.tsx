import React from "react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon: React.ElementType
  title: string
  description: string
  note?: string
  className?: string
}

/**
 * Neutral empty state — deliberately styled as a calm placeholder, not an error.
 */
export function EmptyState({ icon: Icon, title, description, note, className }: EmptyStateProps) {
  return (
    <div className={cn("rounded-xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center", className)}>
      <Icon className="mx-auto mb-3 h-8 w-8 text-muted-foreground/60" aria-hidden />
      <p className="font-medium text-foreground">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      {note && <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground/80">{note}</p>}
    </div>
  )
}
