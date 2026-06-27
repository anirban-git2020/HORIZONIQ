"use client";

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
    <PremiumCard className="flex h-full flex-col p-5">
      <div className="mb-3 flex flex-wrap gap-2">
        <ChangeBadge type={opportunity.growthChange} />
        <Badge variant="muted" className="text-xs">
          {opportunity.sector}
        </Badge>
      </div>

      <h3 className="text-base font-semibold leading-snug">
        {opportunity.title}
      </h3>

      <p className="label-caps mb-1.5 mt-4 text-[10px] text-muted-foreground">
        What&apos;s emerging?
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {opportunity.angle}
      </p>
    </PremiumCard>
  );
}
