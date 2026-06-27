"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BetaBadge } from "@/components/brand/beta-badge";
import { TaglineLockup } from "@/components/brand/tagline-lockup";
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
      <div className="container relative flex flex-col items-center py-32 text-center md:py-40 lg:py-44">
        <FadeIn>
          <div className="mb-10 flex flex-col items-center gap-4">
            <BetaBadge />
            <TaglineLockup size="sm" className="text-center" />
            <ProvenanceBadge provenance={provenance} />
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <h1 className="display-title max-w-4xl text-balance">
            See what is changing before everyone else does.
          </h1>
        </FadeIn>

        <FadeIn delay={0.16}>
          <p className="prose-lead mx-auto mt-8 max-w-2xl text-balance">
            {getLandingSubheadline(provenance)}
          </p>
        </FadeIn>

        <FadeIn delay={0.24}>
          <div className="mt-14 flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
            <Link
              href="/onboarding/welcome"
              className={cn(buttonVariants({ size: "lg" }), "group min-w-[240px]")}
            >
              Build my dashboard
              <ArrowRight className="transition-transform duration-300 ease-premium group-hover:translate-x-0.5" />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground sm:text-left">
              {getLandingCtaNote(provenance)}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
