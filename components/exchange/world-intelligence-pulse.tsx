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
 * World Intelligence Pulse — Signals matched to the professional's focus.
 * Main grid = exact interest matches; a separate "Related fields" strip holds
 * adjacent Signals. Emits selection only; never renders expanded content.
 */
function WorldIntelligencePulseInner({
  className,
  onSignalSelected,
}: WorldIntelligencePulseProps) {
  const { hero, featured, compact, related } = usePersonalizedPulse();
  const { ref: signalsRef, revealed: signalsRevealed } = useMotionReveal();

  const orderedTiles: IntelligencePulseTile[] = [
    ...(hero ? [hero] : []),
    ...featured,
    ...compact,
    ...related,
  ];

  const staggerById = new Map(
    orderedTiles.map((tile, index) => [tile.id, index] as const)
  );

  const handleSelect = useCallback(
    (tile: IntelligencePulseTile) => onSignalSelected(tile),
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

  const hasMain = Boolean(hero) || featured.length > 0 || compact.length > 0;
  const isEmpty = !hasMain && related.length === 0;

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
          The Signals matching your focus, in order of momentum.
        </p>
      </header>

      {isEmpty ? (
        <div className="rounded-2xl border border-border/40 bg-card/20 p-10 text-center md:p-14">
          <p className="text-lg text-foreground/90">
            No Signals match your current focus yet.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            We&apos;re expanding coverage for your areas. Use Start over to adjust
            your focus.
          </p>
        </div>
      ) : (
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

          {related.length > 0 && (
            <div className="space-y-6 border-t border-border/25 pt-12 md:pt-14">
              <div>
                <h3 className="label-caps text-primary">Related fields</h3>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                  Adjacent to your focus — not selected, shown for context.
                </p>
              </div>
              <div className="grid gap-6 overflow-visible sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                {related.map((tile) => (
                  <div key={tile.id} className="overflow-visible">
                    {renderTile(tile)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export const WorldIntelligencePulse = memo(WorldIntelligencePulseInner);
