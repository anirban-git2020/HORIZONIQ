"use client";

import { PremiumCard } from "@/components/ui/premium-card";
import { Badge } from "@/components/ui/badge";
import { ChangeBadge } from "@/components/dashboard/change-badge";
import type { SkillView } from "@/lib/types";

const demandVariant = {
  Critical: "warning",
  High: "primary",
  Growing: "success",
} as const;

export function SkillCard({ skill }: { skill: SkillView }) {
  return (
    <PremiumCard className="group flex h-full flex-col p-6">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <ChangeBadge type={skill.demandChange} />
          <Badge variant={demandVariant[skill.demand]}>{skill.demand}</Badge>
        </div>
      </div>

      <h3 className="text-base font-semibold leading-snug transition-colors group-hover:text-foreground">
        {skill.name}
      </h3>

      <p className="mt-2 text-sm font-medium text-foreground/90">
        {skill.changeSummary}
      </p>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {skill.summary}
      </p>

      <p className="mt-4 border-t border-border/50 pt-3 text-2xs font-medium uppercase tracking-wider text-muted-foreground/70">
        {skill.interestLabel}
      </p>
    </PremiumCard>
  );
}
