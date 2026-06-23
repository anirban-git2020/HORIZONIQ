"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";

import { PremiumCard } from "@/components/ui/premium-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ActionView } from "@/lib/types";

export function ActionCard({
  action,
  index,
}: {
  action: ActionView;
  index: number;
}) {
  const isPrimary = action.isPrimary;
  const isHigh = action.priority === "High";

  return (
    <PremiumCard
      hover
      glow={isPrimary}
      className={cn(
        "group",
        isPrimary && "border-primary/30 bg-primary/[0.05]"
      )}
    >
      <div className="flex items-start gap-4 p-6">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-transform duration-300 group-hover:scale-105",
            isPrimary || isHigh
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-foreground"
          )}
        >
          {isPrimary ? <Sparkles className="h-4 w-4" /> : index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-base font-semibold leading-snug">{action.title}</h3>
            <div className="flex items-center gap-2">
              {isPrimary && <Badge variant="primary">Primary</Badge>}
              {action.interestLabel && (
                <Badge variant="muted">{action.interestLabel}</Badge>
              )}
            </div>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {action.detail}
          </p>
          {action.changeReason && (
            <p className="mt-2 text-xs text-muted-foreground/80">
              <span className="font-medium text-foreground/70">Why now: </span>
              {action.changeReason}
            </p>
          )}
        </div>
        <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
      </div>
    </PremiumCard>
  );
}
