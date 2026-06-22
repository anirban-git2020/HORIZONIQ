"use client";

import { BookOpen } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { PremiumCard } from "@/components/ui/premium-card";

const STORY_BEATS = [
  { label: "Observe", desc: "What is changing" },
  { label: "Understand", desc: "Why it matters" },
  { label: "Act", desc: "What to do next" },
] as const;

export function StoryIntro({ lead }: { lead: string }) {
  return (
    <FadeIn>
      <PremiumCard className="p-6 md:p-8" hover={false}>
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <BookOpen className="h-4 w-4" />
              <span className="label-caps">Your briefing story</span>
            </div>
            <p className="text-base leading-relaxed text-foreground md:text-lg">
              {lead}
            </p>
          </div>

          <div className="flex shrink-0 gap-6 md:gap-8">
            {STORY_BEATS.map((beat, i) => (
              <div key={beat.label} className="relative text-center">
                {i < STORY_BEATS.length - 1 && (
                  <span className="absolute left-[calc(50%+20px)] top-3 hidden h-px w-8 bg-border md:block" />
                )}
                <div className="mx-auto mb-2 flex h-6 w-6 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-2xs font-semibold text-primary">
                  {i + 1}
                </div>
                <p className="text-xs font-medium text-foreground">{beat.label}</p>
                <p className="text-2xs text-muted-foreground">{beat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </PremiumCard>
    </FadeIn>
  );
}
