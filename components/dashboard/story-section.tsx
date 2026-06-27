"use client";

import { FadeIn } from "@/components/motion/fade-in";
import { STORY_ACTS, type StoryAct } from "@/lib/copy";
import { cn } from "@/lib/utils";

export function StorySection({
  act,
  title,
  question,
  children,
  className,
}: {
  act: StoryAct;
  title: string;
  question?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <FadeIn className={cn(className)}>
      <section>
        <header className="mb-8 md:mb-10">
          <p className="label-caps text-primary">{STORY_ACTS[act]}</p>
          <h2 className="section-title mt-2">{title}</h2>
          {question && (
            <p className="prose-lead mt-3 max-w-2xl text-sm md:text-base">
              {question}
            </p>
          )}
        </header>
        {children}
      </section>
    </FadeIn>
  );
}
