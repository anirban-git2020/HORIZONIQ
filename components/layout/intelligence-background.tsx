"use client";

import { NeuralBackground } from "@/components/layout/neural-background";
import { cn } from "@/lib/utils";

interface IntelligenceBackgroundProps {
  variant?: "default" | "subtle" | "hero";
  className?: string;
}

export function IntelligenceBackground({
  variant = "default",
  className,
}: IntelligenceBackgroundProps) {
  const gridOpacity =
    variant === "hero" ? 0.28 : variant === "subtle" ? 0.18 : 0.22;

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      <NeuralBackground variant={variant} />

      {/* Fine reference grid — keeps Bloomberg clarity on light surfaces */}
      <div
        className="absolute inset-0 bg-grid"
        style={{ opacity: gridOpacity }}
      />
    </div>
  );
}
