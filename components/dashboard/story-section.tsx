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
        <header className="mb-6 md:mb-8">
          <p className="label-caps text-primary">{STORY_ACTS[act]}</p>
          <h2 className="mt-1.5 text-xl font-semibold tracking-tight md:text-2xl">
            {title}
          </h2>
          {question && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {question}
            </p>
          )}
        </header>
        {children}
      </section>
    </FadeIn>
  );
}
