import { cn } from "@/lib/utils"

interface ProbabilityBarProps {
  a: number
  draw: number
  b: number
  showLabels?: boolean
  size?: "sm" | "md" | "lg"
}

export function ProbabilityBar({ a, draw, b, showLabels = true, size = "sm" }: ProbabilityBarProps) {
  const heightClass = size === "lg" ? "h-6" : size === "md" ? "h-4" : "h-2"

  return (
    <div className="space-y-1">
      <div className={cn("flex rounded-full overflow-hidden bg-muted", heightClass)}>
        <div
          className="bg-sports-green transition-all duration-500"
          style={{ width: `${a}%` }}
          title={`${a}%`}
        />
        <div
          className="bg-sports-gold/50 transition-all duration-500"
          style={{ width: `${draw}%` }}
          title={`Draw: ${draw}%`}
        />
        <div
          className="bg-sports-blue transition-all duration-500"
          style={{ width: `${b}%` }}
          title={`${b}%`}
        />
      </div>
      {showLabels && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="text-sports-green font-medium">{a}%</span>
          <span>Draw {draw}%</span>
          <span className="text-sports-blue font-medium">{b}%</span>
        </div>
      )}
    </div>
  )
}
