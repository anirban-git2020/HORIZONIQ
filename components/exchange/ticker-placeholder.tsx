"use client";

import { cn } from "@/lib/utils";

const DEFAULT_ITEMS = [
  "AI Agents",
  "Quantum Computing",
  "Cybersecurity",
  "Cloud Infrastructure",
  "Robotics",
  "Biotechnology",
  "Clean Energy",
  "Semiconductor Supply Chain",
];

/**
 * Full-width live intelligence ticker — static placeholder, no marquee.
 */
export function TickerPlaceholder({
  items = DEFAULT_ITEMS,
  className,
}: {
  items?: string[];
  className?: string;
}) {
  return (
    <div
      id="exchange-ticker"
      className={cn("border-b border-border/60 bg-secondary/20", className)}
      role="status"
      aria-label="Live intelligence ticker"
    >
      <div className="container flex items-center gap-2 overflow-x-auto py-2.5 text-sm">
        <span className="label-caps mr-2 shrink-0 text-primary">Live</span>
        {items.map((item, index) => (
          <span key={item} className="flex shrink-0 items-center gap-2">
            <span className="whitespace-nowrap text-foreground/90">
              {item}
              <span className="ml-1.5 text-muted-foreground">—</span>
            </span>
            {index < items.length - 1 && (
              <span className="h-3 w-px shrink-0 bg-border" aria-hidden="true" />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
