"use client";

import { cn } from "@/lib/utils";

export function IntelligenceFieldFallback({
  className,
  variant = "ambient",
}: {
  className?: string;
  variant?: "welcome" | "hero" | "ambient";
}) {
  const isHero = variant === "hero" || variant === "welcome";

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      <div
        className={cn(
          "absolute animate-field-breathe rounded-full",
          isHero
            ? "left-[58%] top-[42%] h-[min(70vw,520px)] w-[min(70vw,520px)] -translate-x-1/2 -translate-y-1/2 opacity-50"
            : "left-1/2 top-[38%] h-[min(70vw,480px)] w-[min(70vw,480px)] -translate-x-1/2 -translate-y-1/2 opacity-35"
        )}
        style={{
          background: `
            radial-gradient(circle at 50% 50%, hsl(38 85% 58% / 0.12), transparent 58%),
            radial-gradient(circle at 50% 50%, hsl(196 58% 48% / 0.14), transparent 62%)
          `,
        }}
      />
      <div
        className="absolute inset-0 animate-field-drift"
        style={{
          opacity: isHero ? 0.45 : 0.28,
          background: `
            radial-gradient(ellipse 55% 45% at 58% 42%, hsl(196 58% 48% / 0.1), transparent 68%)
          `,
        }}
      />
    </div>
  );
}
