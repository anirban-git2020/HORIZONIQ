"use client";

import { memo, useCallback } from "react";

import { IntelligencePulseTileCard } from "@/components/exchange/intelligence-pulse-tile";
import { useMotionReveal } from "@/hooks/use-motion-reveal";
import { usePersonalizedPulse } from "@/hooks/use-personalized-pulse";
import type { IntelligencePulseTile } from "@/lib/exchange/pulse-mock-data";
import { MOTION_CLASS } from "@/lib/motion-language";
import { cn } from "@/lib/utils";

type WorldIntelligencePulseProps = {
  className?: string;
  onSignalSelected: (signal: IntelligencePulseTile) => void;
};

/**
 * World Intelligence Pulse — static signal grid.
 * Emits selection only; never renders expanded content.
 */
function WorldIntelligencePulseInner({
  className,
  onSignalSelected,
}: WorldIntelligencePulseProps) {
  const { hero, featured, compact } = usePersonalizedPulse();
  const { ref: signalsRef, revealed: signalsRevealed } = useMotionReveal();

  const orderedTiles: IntelligencePulseTile[] = [
    ...(hero ? [hero] : []),
    ...featured,
    ...compact,
  ];

  const staggerById = new Map(
    orderedTiles.map((tile, index) => [tile.id, index] as const)
  );

  const handleSelect = useCallback(
    (tile: IntelligencePulseTile) => {
      onSignalSelected(tile);
    },
    [onSignalSelected]
  );

  const renderTile = (tile: IntelligencePulseTile) => (
    <IntelligencePulseTileCard
      key={tile.id}
      tile={tile}
      onSelect={handleSelect}
      staggerIndex={staggerById.get(tile.id)}
    />
  );

  return (
    <section
      aria-labelledby="world-intelligence-pulse-heading"
      className={cn("mx-auto w-full max-w-[1500px] px-6 pb-24 md:pb-28", className)}
    >
      <header className="mb-12 md:mb-16">
        <h2
          id="world-intelligence-pulse-heading"
          className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary"
        >
          World Intelligence Pulse
        </h2>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground md:text-xl">
          Tomorrow&apos;s front page — twelve intelligence stories worth your
          attention now.
        </p>
      </header>

      <div
        ref={signalsRef}
        className={cn(
          "space-y-10 overflow-visible md:space-y-14",
          signalsRevealed && MOTION_CLASS.signalsRevealed
        )}
      >
        {hero && (
          <div className="overflow-visible lg:pr-[12%]">{renderTile(hero)}</div>
        )}

        {featured.length > 0 && (
          <div className="grid gap-8 overflow-visible md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {featured.map((tile, index) => (
              <div
                key={tile.id}
                className={cn(
                  "overflow-visible",
                  index === 1 && "md:mt-6 lg:mt-10"
                )}
              >
                {renderTile(tile)}
              </div>
            ))}
          </div>
        )}

        {compact.length > 0 && (
          <div className="grid gap-6 overflow-visible sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {compact.map((tile, index) => (
              <div
                key={tile.id}
                className={cn("overflow-visible", index % 3 === 1 && "lg:mt-4")}
              >
                {renderTile(tile)}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export const WorldIntelligencePulse = memo(WorldIntelligencePulseInner);
