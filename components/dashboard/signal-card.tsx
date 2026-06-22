"use client";

import { ArrowRight } from "lucide-react";

import { AnimatedCounter } from "@/components/motion/animated-counter";
import { Badge } from "@/components/ui/badge";
import { PremiumCard } from "@/components/ui/premium-card";
import { SignalRelationshipFlow } from "@/components/dashboard/signal-relationship-flow";
import { SignalEvidence } from "@/components/dashboard/signal-evidence";
import type { SignalView } from "@/lib/types";

interface SignalCardProps {
  signal: SignalView;
  featured?: boolean;
}

export function SignalCard({ signal, featured = false }: SignalCardProps) {
  if (featured) {
    return <FeaturedSignalCard signal={signal} />;
  }

  return (
    <PremiumCard className="flex h-full flex-col p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="muted">{signal.category}</Badge>
          <Badge variant="primary">{signal.interestLabel}</Badge>
        </div>
        <span className="label-caps text-primary/80">#{signal.rank}</span>
      </div>

      <h3 className="text-lg font-semibold leading-snug">{signal.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {signal.summary}
      </p>

      <div className="mt-4">
        <SignalRelationshipFlow
          causedBy={signal.causedBy}
          impacts={signal.impacts}
          benefits={signal.benefits}
          actions={signal.actions}
          compact
        />
      </div>

      <div className="mt-auto pt-5">
        <SignalEvidence
          momentum={signal.momentum}
          confidence={signal.confidence}
          momentumDrivers={signal.momentumDrivers}
          confidenceFactors={signal.confidenceFactors}
        />
      </div>
    </PremiumCard>
  );
}

function FeaturedSignalCard({ signal }: { signal: SignalView }) {
  return (
    <PremiumCard glow className="p-7 md:p-8 lg:p-10">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Badge variant="primary">Lead signal</Badge>
        <Badge variant="muted">{signal.category}</Badge>
        <Badge variant="muted">{signal.interestLabel}</Badge>
      </div>

      <h2 className="section-title text-2xl md:text-3xl">{signal.name}</h2>
      <p className="body-lg mt-3 max-w-3xl">{signal.summary}</p>

      <div className="mt-3 flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/[0.05] p-3 text-sm">
        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span className="text-foreground">{signal.impact}</span>
      </div>

      <div className="mt-8">
        <p className="label-caps mb-3">Relationship system</p>
        <SignalRelationshipFlow
          causedBy={signal.causedBy}
          impacts={signal.impacts}
          benefits={signal.benefits}
          actions={signal.actions}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <SignalEvidence
          momentum={signal.momentum}
          confidence={signal.confidence}
          momentumDrivers={signal.momentumDrivers}
          confidenceFactors={signal.confidenceFactors}
        />
        <div className="rounded-xl border border-border bg-secondary/50 p-5">
          <p className="label-caps mb-4">Signal strength</p>
          <div className="flex items-baseline gap-6">
            <div>
              <p className="text-xs text-muted-foreground">Momentum</p>
              <p className="text-3xl font-semibold tabular-nums text-success">
                <AnimatedCounter value={signal.momentum} />
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Confidence</p>
              <p className="text-3xl font-semibold tabular-nums text-primary">
                <AnimatedCounter value={signal.confidence} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </PremiumCard>
  );
}
