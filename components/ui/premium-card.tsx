import * as React from "react";

import { cn } from "@/lib/utils";

export interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
  flat?: boolean;
}

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ className, hover = true, glow = false, flat = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/70 bg-card",
        !flat && "shadow-premium",
        hover &&
          "transition-[border-color,box-shadow,transform] duration-300 ease-premium hover:border-primary/20 hover:-translate-y-px",
        hover && !flat && "hover:shadow-premium",
        glow && "ring-1 ring-primary/10",
        className
      )}
      {...props}
    />
  )
);
PremiumCard.displayName = "PremiumCard";

export { PremiumCard };
