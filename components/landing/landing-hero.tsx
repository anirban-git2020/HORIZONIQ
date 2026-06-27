"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { ProvenanceBadge } from "@/components/trust/provenance-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  getLandingCtaNote,
  getLandingSubheadline,
  type DataProvenance,
} from "@/lib/trust";
import { cn } from "@/lib/utils";

interface LandingHeroProps {
  provenance: DataProvenance;
}

export function LandingHero({ provenance }: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="container relative flex flex-col items-center py-28 text-center md:py-36 lg:py-40">
        <FadeIn>
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
              Observe. Predict. Lead.
            </span>
            <ProvenanceBadge provenance={provenance} />
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <h1 className="display-title max-w-4xl text-balance">
            See what is changing before everyone else does.
          </h1>
        </FadeIn>

        <FadeIn delay={0.16}>
          <p className="body-lg mt-6 max-w-2xl text-balance">
            {getLandingSubheadline(provenance)}
          </p>
        </FadeIn>

        <FadeIn delay={0.24}>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/onboarding/role"
              className={cn(buttonVariants({ size: "lg" }), "group min-w-[220px]")}
            >
              Build my dashboard
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground sm:text-left">
              {getLandingCtaNote(provenance)}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
