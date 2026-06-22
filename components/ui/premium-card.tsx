import * as React from "react";

import { cn } from "@/lib/utils";

export interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ className, hover = true, glow = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card",
        "shadow-[0_1px_2px_hsl(222_47%_11%/0.04)] dark:shadow-[0_1px_2px_hsl(0_0%_0%/0.25)]",
        hover &&
          "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-border hover:shadow-premium",
        glow && "ring-1 ring-primary/15",
        className
      )}
      {...props}
    />
  )
);
PremiumCard.displayName = "PremiumCard";

export { PremiumCard };
