"use client";

import { PremiumCard } from "@/components/ui/premium-card";
import type { ActionView } from "@/lib/types";

export function ActionCard({ action }: { action: ActionView }) {
  return (
    <PremiumCard flat className="p-6">
      <p className="label-caps mb-1.5 text-[10px] text-muted-foreground">
        What else to consider
      </p>
      <h3 className="text-base font-semibold leading-snug">{action.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {action.detail}
      </p>
    </PremiumCard>
  );
}
