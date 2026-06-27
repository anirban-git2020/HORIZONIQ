import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface IntelligenceCardSectionProps {
  step?: number;
  label: string;
  children: ReactNode;
  emphasis?: boolean;
  className?: string;
}

export function IntelligenceCardSection({
  step,
  label,
  children,
  emphasis = false,
  className,
}: IntelligenceCardSectionProps) {
  return (
    <div
      className={cn(
        emphasis &&
          "rounded-xl border border-primary/20 bg-primary/[0.04] p-4 md:p-5",
        className
      )}
    >
      <p className="label-caps mb-2 text-primary">
        {step !== undefined ? `${step}. ` : ""}
        {label}
      </p>
      <div className="text-sm leading-relaxed text-muted-foreground md:text-base">
        {children}
      </div>
    </div>
  );
}
