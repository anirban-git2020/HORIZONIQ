"use client";

import { MapPin, TrendingUp } from "lucide-react";

import { AnimatedCounter } from "@/components/motion/animated-counter";
import { PremiumCard } from "@/components/ui/premium-card";
import { Badge } from "@/components/ui/badge";
import { ChangeBadge } from "@/components/dashboard/change-badge";
import type { OpportunityView } from "@/lib/types";

export function OpportunityCard({
  opportunity,
}: {
  opportunity: OpportunityView;
}) {
  return (
    <PremiumCard className="group flex h-full flex-col p-6">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <ChangeBadge type={opportunity.growthChange} />
          <Badge variant="muted">{opportunity.sector}</Badge>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-success">
          <TrendingUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
          +<AnimatedCounter value={opportunity.growth} suffix="%" />
        </span>
      </div>

      <h3 className="text-base font-semibold leading-snug">{opportunity.title}</h3>

      <p className="mt-2 text-sm font-medium text-foreground/90">
        {opportunity.changeSummary}
      </p>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {opportunity.summary}
      </p>

      <p className="mt-3 text-sm leading-relaxed">
        <span className="font-medium text-foreground">For you: </span>
        <span className="text-muted-foreground">{opportunity.angle}</span>
      </p>

      {opportunity.hubs.length > 0 && (
        <div className="mt-auto flex items-start gap-1.5 border-t border-border/50 pt-4 text-xs text-muted-foreground">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <span>
            {opportunity.regionLabel}:{" "}
            <span className="text-foreground/90">
              {opportunity.hubs.join(" · ")}
            </span>
          </span>
        </div>
      )}
    </PremiumCard>
  );
}
