import { Shield, CheckCircle, Leaf } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrustBadgeProps {
  type: "verified" | "organic" | "blockchain"
  className?: string
}

export function TrustBadge({ type, className }: TrustBadgeProps) {
  const badges = {
    verified: {
      icon: CheckCircle,
      label: "Verified",
      color: "text-primary bg-primary/10",
    },
    organic: {
      icon: Leaf,
      label: "Organic",
      color: "text-accent bg-accent/10",
    },
    blockchain: {
      icon: Shield,
      label: "Blockchain Secured",
      color: "text-chart-3 bg-chart-3/10",
    },
  }

  const badge = badges[type]
  const Icon = badge.icon

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        badge.color,
        className,
      )}
    >
      <Icon className="w-3 h-3" />
      {badge.label}
    </div>
  )
}
