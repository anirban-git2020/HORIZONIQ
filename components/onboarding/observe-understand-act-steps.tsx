"use client";

import { FadeIn } from "@/components/motion/fade-in";

const STEPS = [
  { label: "Observe", question: "What is changing?" },
  { label: "Understand", question: "Why does it matter?" },
  { label: "Act", question: "What should I do next?" },
] as const;

export function ObserveUnderstandActSteps() {
  return (
    <FadeIn delay={0.12}>
      <div className="mb-10 md:mb-12">
        <ol className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.label}
              className="rounded-xl border border-border bg-card/60 px-5 py-4 text-center"
            >
              <p className="label-caps text-primary">{step.label}</p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {step.question}
              </p>
              {index < STEPS.length - 1 && (
                <span className="sr-only">Then</span>
              )}
            </li>
          ))}
        </ol>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Get your personalized intelligence briefing in under 60 seconds.
        </p>
      </div>
    </FadeIn>
  );
}
