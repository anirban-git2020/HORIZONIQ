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
    <PremiumCard className="flex h-full flex-col p-5">
      <div className="mb-3 flex flex-wrap gap-2">
        <ChangeBadge type={skill.demandChange} />
        <Badge variant={demandVariant[skill.demand]} className="text-xs">
          {skill.demand}
        </Badge>
      </div>

      <h3 className="text-base font-semibold leading-snug">{skill.name}</h3>

      <p className="label-caps mb-1.5 mt-4 text-[10px] text-muted-foreground">
        What&apos;s rising?
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {skill.changeSummary}
      </p>
    </PremiumCard>
  );
}
