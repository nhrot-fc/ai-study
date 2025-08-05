import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "normal" | "intense"
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, intensity = "normal", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          intensity === "intense" ? "glass-intense" : "glass-card",
          "p-6",
          className
        )}
        {...props}
      />
    )
  }
)
GlassCard.displayName = "GlassCard"

export { GlassCard }