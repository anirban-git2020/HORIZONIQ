"use client";

import { useState } from "react";

import { IntelligenceCardEvidence } from "@/components/intelligence/intelligence-card-evidence";
import { IntelligenceCardSection } from "@/components/intelligence/intelligence-card-section";
import { Badge } from "@/components/ui/badge";
import { getConfidenceLevelLabel } from "@/lib/intelligence";
import type { SignalIntelligence } from "@/lib/types";
import { cn } from "@/lib/utils";

export type IntelligenceCardVariant = "full" | "summary" | "compact";

interface IntelligenceCardProps {
  intelligence: SignalIntelligence;
  variant?: IntelligenceCardVariant;
  className?: string;
}

const TIER_BADGE: Record<
  SignalIntelligence["confidenceTier"],
  "success" | "primary" | "muted"
> = {
  high: "success",
  medium: "primary",
  low: "muted",
};

function ConfidenceBlock({
  intelligence,
  step,
}: {
  intelligence: SignalIntelligence;
  step?: number;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-secondary/20 p-4 md:p-5">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <p className="label-caps text-primary">
          {step !== undefined ? `${step}. ` : ""}
          How confident are we?
        </p>
        <Badge variant={TIER_BADGE[intelligence.confidenceTier]}>
          {getConfidenceLevelLabel(intelligence.confidenceTier)}
        </Badge>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
        {intelligence.confidenceExplanation}
      </p>
    </div>
  );
}

export function IntelligenceCard({
  intelligence,
  variant = "full",
  className,
}: IntelligenceCardProps) {
  const [showEvidence, setShowEvidence] = useState(variant === "full");

  if (variant === "compact") {
    return (
      <div className={cn("space-y-3", className)}>
        <IntelligenceCardSection label="What happened?">
          <p className="font-medium text-foreground">
            {intelligence.whatHappened}
          </p>
        </IntelligenceCardSection>
        <IntelligenceCardSection label="Why should you care?">
          {intelligence.whyYouShouldCare}
        </IntelligenceCardSection>
        <div className="rounded-lg border border-primary/15 bg-primary/[0.04] px-3 py-2.5">
          <p className="label-caps mb-1 text-[10px] text-primary">
            What to do next
          </p>
          <p className="text-sm font-medium leading-relaxed text-foreground">
            {intelligence.whatToDoNext}
          </p>
        </div>
        <ConfidenceBlock intelligence={intelligence} />
      </div>
    );
  }

  const showDrivers = variant === "full";
  const showOutlook = variant === "full";
  let step = 0;

  return (
    <div className={cn("space-y-5", className)}>
      <IntelligenceCardSection step={++step} label="What happened?">
        <p className="font-medium text-foreground">
          {intelligence.whatHappened}
        </p>
      </IntelligenceCardSection>

      {showDrivers && (
        <IntelligenceCardSection step={++step} label="Why is it happening?">
          {intelligence.whyItIsHappening}
        </IntelligenceCardSection>
      )}

      <IntelligenceCardSection step={++step} label="Why should you care?">
        {intelligence.whyYouShouldCare}
      </IntelligenceCardSection>

      <IntelligenceCardSection
        step={++step}
        label="What should you do next?"
        emphasis
      >
        <p className="font-medium text-foreground">
          {intelligence.whatToDoNext}
        </p>
      </IntelligenceCardSection>

      {showOutlook && (
        <IntelligenceCardSection step={++step} label="Outlook (projection)">
          <p>{intelligence.outlook}</p>
          <p className="mt-2 text-xs text-muted-foreground/80">
            Directional projection — not a forecast or certainty.
          </p>
        </IntelligenceCardSection>
      )}

      <ConfidenceBlock intelligence={intelligence} step={++step} />

      {variant === "full" ? (
        <IntelligenceCardEvidence evidence={intelligence.evidence} />
      ) : (
        <div className="border-t border-border/60 pt-3">
          <button
            type="button"
            onClick={() => setShowEvidence((v) => !v)}
            className="label-caps text-xs text-muted-foreground hover:text-foreground"
            aria-expanded={showEvidence}
          >
            {showEvidence ? "Hide" : "Show"} evidence (
            {intelligence.evidence.sources.length} sources)
          </button>
          {showEvidence && (
            <IntelligenceCardEvidence
              evidence={intelligence.evidence}
              className="mt-3 border-t-0 pt-0"
            />
          )}
        </div>
      )}
    </div>
  );
}
