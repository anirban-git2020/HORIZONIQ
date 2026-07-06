"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PremiumCard } from "@/components/ui/premium-card";
import { ChangeBadge } from "@/components/dashboard/change-badge";
import { rememberSignalSource, track } from "@/lib/analytics";
import type { SignalSource } from "@/lib/analytics";
import type { SignalView } from "@/lib/types";
import { cn } from "@/lib/utils";

export type SignalCardFocus = "change" | "why" | "action";

interface SignalCardProps {
  signal: SignalView;
  focus?: SignalCardFocus;
  source?: SignalSource;
  className?: string;
}

function trackSignalCardClick(signal: SignalView, source: SignalSource) {
  rememberSignalSource(source);
  track("signal_opened", {
    signalId: signal.id,
    source,
    changeType: signal.change.type,
    surface: "card",
  });
}

export function SignalCard({
  signal,
  focus = "why",
  source = "dashboard-signals",
  className,
}: SignalCardProps) {
  const question =
    focus === "change"
      ? "What happened?"
      : focus === "action"
        ? "What to do next"
        : "Why it matters to you";

  const answer =
    focus === "change"
      ? signal.intelligence.whatHappened
      : focus === "action"
        ? signal.intelligence.whatToDoNext
        : signal.intelligence.whyYouShouldCare;

  return (
    <Link
      href={`/signals/${signal.id}`}
      onClick={() => trackSignalCardClick(signal, source)}
      className={cn("block h-full", className)}
    >
      <PremiumCard flat hover className="flex h-full flex-col p-6 md:p-7">
        <div className="mb-3 flex flex-wrap gap-2">
          <ChangeBadge type={signal.change.type} />
          <Badge variant="muted" className="text-xs">
            {signal.category}
          </Badge>
        </div>

        <h3 className="text-base font-semibold leading-snug tracking-[-0.01em]">
          {signal.name}
        </h3>

        <div className="mt-4 flex-1">
          <p className="label-caps mb-1.5 text-[10px] text-muted-foreground">
            {question}
          </p>
          <p
            className={cn(
              "text-sm leading-relaxed",
              focus === "action"
                ? "font-medium text-foreground"
                : "text-muted-foreground"
            )}
          >
            {answer}
          </p>
        </div>

        <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
          Full intelligence
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </PremiumCard>
    </Link>
  );
}
