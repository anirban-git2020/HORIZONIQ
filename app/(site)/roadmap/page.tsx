import type { Metadata } from "next";
import { Check, Circle, Clock, Sparkles } from "lucide-react";

import { ContentPage } from "@/components/layout/content-page";
import {
  ROADMAP_NORTH_STAR,
  ROADMAP_PHASES,
  type RoadmapMilestone,
} from "@/lib/site-content/roadmap";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Roadmap",
  description:
    "HorizonIQ product roadmap — current phase, upcoming milestones, and future vision.",
  path: "/roadmap",
});

const STATUS_CONFIG: Record<
  RoadmapMilestone["status"],
  { label: string; icon: typeof Check; className: string }
> = {
  complete: {
    label: "Complete",
    icon: Check,
    className: "border-primary/40 bg-primary/10 text-primary",
  },
  current: {
    label: "Current",
    icon: Circle,
    className: "border-foreground/30 bg-foreground/5 text-foreground",
  },
  upcoming: {
    label: "Upcoming",
    icon: Clock,
    className: "border-border bg-muted/30 text-muted-foreground",
  },
  future: {
    label: "Future",
    icon: Sparkles,
    className: "border-border/60 bg-transparent text-muted-foreground",
  },
};

export default function RoadmapPage() {
  return (
    <ContentPage
      title="Roadmap"
      description={ROADMAP_NORTH_STAR}
    >
      <div className="relative space-y-0">
        {ROADMAP_PHASES.map((phase, index) => {
          const config = STATUS_CONFIG[phase.status];
          const Icon = config.icon;
          const isLast = index === ROADMAP_PHASES.length - 1;

          return (
            <article
              key={phase.id}
              className="relative flex gap-5 pb-10 last:pb-0"
              aria-labelledby={`phase-${phase.id}`}
            >
              {!isLast && (
                <div
                  className="absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px bg-border/70"
                  aria-hidden="true"
                />
              )}

              <div
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                  config.className
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">{config.label}</span>
              </div>

              <div className="min-w-0 flex-1 space-y-3 pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2
                    id={`phase-${phase.id}`}
                    className="section-title text-lg font-semibold"
                  >
                    {phase.title}
                  </h2>
                  <span
                    className={cn(
                      "label-caps rounded-md border px-2 py-0.5 text-[9px]",
                      config.className
                    )}
                  >
                    {config.label}
                  </span>
                </div>

                <ul className="space-y-2 text-sm text-muted-foreground">
                  {phase.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </ContentPage>
  );
}
