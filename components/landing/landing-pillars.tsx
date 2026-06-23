"use client";

import { Compass, Lightbulb, TrendingUp } from "lucide-react";

import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in";
import { PremiumCard } from "@/components/ui/premium-card";

const PILLARS = [
  {
    icon: TrendingUp,
    title: "What is changing",
    body: "Track the highest-momentum trends across technology, industries, and markets.",
  },
  {
    icon: Compass,
    title: "Why it matters",
    body: "Understand the impact of each shift with clear, confidence-scored context.",
  },
  {
    icon: Lightbulb,
    title: "What to do next",
    body: "Leave with specific, prioritized actions tailored to your goals.",
  },
];

export function LandingPillars() {
  return (
    <section className="container pb-16 md:pb-20">
      <FadeIn>
        <p className="label-caps mb-8 text-center">How it works</p>
      </FadeIn>
      <Stagger className="grid gap-5 md:grid-cols-3">
        {PILLARS.map((pillar) => (
          <StaggerItem key={pillar.title}>
            <PremiumCard className="h-full p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/15">
                <pillar.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{pillar.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {pillar.body}
              </p>
            </PremiumCard>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
