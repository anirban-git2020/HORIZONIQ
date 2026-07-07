"use client";

import { memo } from "react";
import { ArrowRight } from "lucide-react";

import { PulseSparkline } from "@/components/exchange/pulse-sparkline";
import type { IntelligencePulseTile } from "@/lib/exchange/pulse-mock-data";
import { MOTION_CLASS, motionStaggerDelay } from "@/lib/motion-language";
import { cn } from "@/lib/utils";

type IntelligencePulseTileProps = {
  tile: IntelligencePulseTile;
  onSelect: (tile: IntelligencePulseTile) => void;
  staggerIndex?: number;
};

function formatEvidence(tile: IntelligencePulseTile) {
  const { signals, newJobs, researchPapers, fundingEvents } = tile.evidence;
  return [
    `${signals.toLocaleString()} Signals`,
    `${newJobs} New Jobs`,
    `${researchPapers} Research Papers`,
    `${fundingEvents} Funding Events`,
  ].join(" · ");
}

function IntelligencePulseTileCardInner({
  tile,
  onSelect,
  staggerIndex,
}: IntelligencePulseTileProps) {
  const isHero = tile.tier === "hero";
  const isFeatured = tile.tier === "featured";
  const headingId = `pulse-heading-${tile.id}`;

  const handleActivate = () => {
    onSelect(tile);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleActivate();
    }
  };

  return (
    <article
      data-signal-id={tile.id}
      style={staggerIndex !== undefined ? motionStaggerDelay(staggerIndex) : undefined}
      className={cn(
        "pulse-editorial-tile group relative flex flex-col",
        "rounded-2xl bg-card/20 backdrop-blur-sm",
        MOTION_CLASS.signal,
        "hover:bg-card/30 motion-reduce:hover:translate-y-0",
        staggerIndex !== undefined && MOTION_CLASS.signalEnter,
        isHero && "min-h-[380px]",
        isFeatured && "min-h-[300px]",
        !isHero && !isFeatured && "min-h-[240px]",
        isHero ? "p-8 md:p-10 lg:p-12" : isFeatured ? "p-7 md:p-8" : "p-6"
      )}
    >
      <button
        type="button"
        className={cn(
          "flex w-full flex-1 flex-col text-left",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:rounded-xl"
        )}
        aria-haspopup="dialog"
        onClick={handleActivate}
        onKeyDown={handleKeyDown}
      >
        <PulseTileSummary
          tile={tile}
          isHero={isHero}
          isFeatured={isFeatured}
          headingId={headingId}
          interactive
        />
      </button>
    </article>
  );
}

export type PulseTileSummaryProps = {
  tile: IntelligencePulseTile;
  isHero: boolean;
  isFeatured: boolean;
  headingId: string;
  interactive: boolean;
  compact?: boolean;
};

export function PulseTileSummary({
  tile,
  isHero,
  isFeatured,
  headingId,
  interactive,
  compact = false,
}: PulseTileSummaryProps) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <p className="label-caps text-primary/80">{tile.technology}</p>
        <PulseSparkline
          points={tile.sparkline}
          width={compact ? 72 : isHero ? 96 : 80}
          height={compact ? 24 : isHero ? 32 : 28}
        />
      </div>

      <h3
        id={headingId}
        className={cn(
          "font-heading font-semibold leading-[1.12] tracking-[-0.02em] text-foreground/90",
          interactive && MOTION_CLASS.signalHeadline,
          compact ? "mt-3 text-xl md:text-2xl" : "mt-5",
          !compact &&
            (isHero
              ? "max-w-[16ch] text-3xl md:text-4xl lg:text-[2.75rem]"
              : isFeatured
                ? "max-w-[14ch] text-2xl md:text-[1.75rem]"
                : "max-w-[16ch] text-xl md:text-[1.35rem]")
        )}
      >
        {tile.headline}
      </h3>

      <p
        className={cn(
          "leading-relaxed text-muted-foreground",
          compact ? "mt-2 text-sm" : "mt-4",
          compact ? "max-w-none" : isHero ? "max-w-xl text-base md:text-lg" : "max-w-md text-sm"
        )}
      >
        {tile.supporting}
      </p>

      <div className={cn("flex flex-wrap items-baseline gap-x-3 gap-y-1", compact ? "mt-3" : "mt-6")}>
        <p
          className={cn(
            "pulse-momentum font-heading font-bold tabular-nums tracking-tight text-foreground",
            interactive && MOTION_CLASS.signalMomentum,
            compact ? "text-2xl" : isHero ? "text-4xl md:text-5xl" : "text-3xl"
          )}
          aria-label={`Momentum ${tile.momentum}, up ${tile.momentumChange}`}
        >
          {tile.momentum}
          <span className="ml-2 text-success">▲</span>
          <span className="ml-1 text-base font-semibold text-success md:text-lg">
            +{tile.momentumChange}
          </span>
        </p>
      </div>

      <p className={cn("text-sm italic text-muted-foreground/90", compact ? "mt-2" : "mt-4")}>
        {tile.forecastNarrative}
      </p>

      <p
        className={cn(
          "text-xs leading-relaxed text-muted-foreground md:text-sm",
          compact ? "mt-2" : "mt-3"
        )}
      >
        {formatEvidence(tile)}
      </p>

      {!compact && (
        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
          <time className="text-xs text-muted-foreground">{tile.updated}</time>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-sm font-medium text-foreground",
              MOTION_CLASS.signalCta
            )}
          >
            {tile.cta}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      )}
    </>
  );
}

export const IntelligencePulseTileCard = memo(IntelligencePulseTileCardInner);
