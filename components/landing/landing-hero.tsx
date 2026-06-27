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
    <section className="relative min-h-[min(92vh,880px)]">
      <div className="container relative grid min-h-[min(92vh,880px)] items-center gap-12 py-24 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] md:py-28 lg:py-32">
        <div className="relative z-10 max-w-xl text-left">
          <FadeIn immediate>
            <div className="mb-8 flex flex-col items-start gap-4">
              <BetaBadge />
              <TaglineLockup size="sm" />
              <ProvenanceBadge provenance={provenance} />
            </div>
          </FadeIn>

          <FadeIn delay={0.08} immediate>
            <h1 className="display-title max-w-[14ch] text-balance text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
              See what is changing before everyone else does.
            </h1>
          </FadeIn>

          <FadeIn delay={0.16} immediate>
            <p className="prose-lead mt-6 max-w-lg text-pretty">
              {getLandingSubheadline(provenance)}
            </p>
          </FadeIn>

          <FadeIn delay={0.24} immediate>
            <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
              <Link
                href="/onboarding/welcome"
                className={cn(buttonVariants({ size: "lg" }), "group min-w-[240px]")}
              >
                Build my dashboard
                <ArrowRight className="transition-transform duration-300 ease-premium group-hover:translate-x-0.5" />
              </Link>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                {getLandingCtaNote(provenance)}
              </p>
            </div>
          </FadeIn>
        </div>

        <div className="pointer-events-none relative hidden min-h-[420px] md:block" aria-hidden="true">
          <p className="label-caps absolute bottom-8 left-0 max-w-[16rem] text-muted-foreground/80">
            Personalized intelligence — what changed, why it matters, what to do.
          </p>
        </div>
      </div>
    </section>
  );
}
