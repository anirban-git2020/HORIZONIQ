"use client";

import { memo, useCallback, useMemo } from "react";

import { DigestPanel } from "@/components/exchange/digest-panel";
import { IntelligencePulseTileCard } from "@/components/exchange/intelligence-pulse-tile";
import { useMotionReveal } from "@/hooks/use-motion-reveal";
import { usePersonalizedPulse } from "@/hooks/use-personalized-pulse";
import { useVisitChanges } from "@/hooks/use-visit-changes";
import { getIntelligenceUpdatedAt } from "@/lib/domain/live-repository";
import type { IntelligencePulseTile } from "@/lib/exchange/pulse-mock-data";
import { MOTION_CLASS } from "@/lib/motion-language";
import { cn } from "@/lib/utils";

/** Deterministic UTC date+time — same on server and client (no hydration drift). */
function formatUpdated(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(d);
}

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
  const updatedAt = getIntelligenceUpdatedAt();
  const updatedLabel = updatedAt ? formatUpdated(updatedAt) : "";

  const orderedTiles: IntelligencePulseTile[] = [
    ...(hero ? [hero] : []),
    ...featured,
    ...compact,
    ...related,
  ];

  const staggerById = new Map(
    orderedTiles.map((tile, index) => [tile.id, index] as const)
  );

  // What changed since the user's last visit — drives both the digest panel and
  // the per-tile "no change" message. The period key is stored for later use.
  const briefingPeriod = updatedAt ? updatedAt.slice(0, 10) : null;
  const visitInputs = useMemo(
    () =>
      orderedTiles.map((tile) => ({
        id: tile.id,
        title: tile.technology,
        momentum: tile.momentum,
        momentumChange: tile.momentumChange,
      })),
    [orderedTiles]
  );
  const visit = useVisitChanges(visitInputs, briefingPeriod);
  const unchangedSignals = visit.unchanged;

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
      unchangedSinceLastVisit={unchangedSignals.has(tile.id)}
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
        {updatedLabel && (
          <p className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground/80">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
            Data updated {updatedLabel}
          </p>
        )}
      </header>

      <DigestPanel changes={visit} className="mb-12 md:mb-16" />

      {isEmpty ? (
        <div className="hq-motion-hero-enter rounded-2xl border border-border/40 bg-card/20 p-10 text-center md:p-14">
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
