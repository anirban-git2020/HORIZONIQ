"use client";

import { cn } from "@/lib/utils";

import type { IntelligenceFieldVariant } from "@/components/intelligence-field/types";

/** Readability scrims — keep animation visible in the hero center. */
export function IntelligenceFieldOverlay({
  variant = "ambient",
  className,
}: {
  variant?: IntelligenceFieldVariant;
  className?: string;
}) {
  if (variant === "welcome") {
    return (
      <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 50% 42% at 58% 46%, transparent 0%, hsl(var(--background) / 0.35) 58%, hsl(var(--background) / 0.82) 100%),
              linear-gradient(to bottom, hsl(var(--background) / 0.55) 0%, transparent 24%, transparent 76%, hsl(var(--background) / 0.75) 100%)
            `,
          }}
        />
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to right, hsl(var(--background) / 0.92) 0%, hsl(var(--background) / 0.55) 28%, transparent 52%),
              linear-gradient(to top, hsl(var(--background) / 0.88) 0%, hsl(var(--background) / 0.25) 22%, transparent 42%),
              radial-gradient(ellipse 48% 42% at 62% 44%, transparent 0%, hsl(var(--background) / 0.18) 62%, hsl(var(--background) / 0.55) 100%)
            `,
          }}
        />
        <FieldRings className="left-[58%] opacity-[0.28]" />
        <HeroBokeh />
      </div>
    );
  }

  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 85% 70% at 50% 38%, transparent 0%, hsl(var(--background) / 0.55) 48%, hsl(var(--background) / 0.9) 100%),
            linear-gradient(to bottom, hsl(var(--background) / 0.82) 0%, hsl(var(--background) / 0.42) 18%, hsl(var(--background) / 0.38) 82%, hsl(var(--background) / 0.88) 100%)
          `,
        }}
      />
      <FieldRings className="opacity-[0.12]" />
    </div>
  );
}

function FieldRings({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute top-[42%] h-[min(78vw,560px)] w-[min(78vw,560px)] -translate-x-1/2 -translate-y-1/2",
        className
      )}
    >
      {[1, 0.82, 0.64, 0.46].map((scale, i) => (
        <div
          key={scale}
          className="absolute inset-0 rounded-full border border-primary/30 animate-field-drift"
          style={{
            transform: `scale(${scale})`,
            animationDuration: `${22 + i * 5}s`,
            animationDelay: `${i * 1.5}s`,
          }}
        />
      ))}
    </div>
  );
}

function HeroBokeh() {
  return (
    <>
      <div className="absolute left-[8%] top-[28%] h-32 w-32 animate-field-breathe rounded-full bg-primary/[0.06] blur-3xl" />
      <div
        className="absolute left-[18%] top-[52%] h-24 w-24 animate-field-drift rounded-full bg-primary/[0.04] blur-2xl"
        style={{ animationDelay: "3s" }}
      />
      <div
        className="absolute right-[12%] top-[36%] h-40 w-40 animate-field-breathe rounded-full bg-primary/[0.05] blur-3xl"
        style={{ animationDelay: "1.5s" }}
      />
    </>
  );
}
