"use client";

import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";

export function Section({
  title,
  question,
  children,
  className,
  step,
}: {
  title: string;
  question: string;
  children: React.ReactNode;
  className?: string;
  step?: number;
}) {
  return (
    <FadeIn className={cn(className)}>
      <section>
        <div className="mb-6 flex flex-col gap-1.5 md:mb-8">
          {step !== undefined && (
            <span className="label-caps text-primary/70">
              Part {step}
            </span>
          )}
          <h2 className="section-title">{title}</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {question}
          </p>
        </div>
        {children}
      </section>
    </FadeIn>
  );
}
