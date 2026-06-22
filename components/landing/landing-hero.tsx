"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container relative flex flex-col items-center py-28 text-center md:py-36 lg:py-40">
        <FadeIn>
          <span className="mb-8 inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
            Observe. Predict. Lead.
          </span>
        </FadeIn>

        <FadeIn delay={0.08}>
          <h1 className="display-title max-w-4xl text-balance">
            See what&apos;s changing before everyone else
          </h1>
        </FadeIn>

        <FadeIn delay={0.16}>
          <p className="body-lg mt-6 max-w-2xl text-balance">
            HorizonIQ turns emerging signals into clear, personalized
            intelligence — so you know what matters and what to do next.
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
            <p className="text-sm text-muted-foreground">
              Under 60 seconds · No sign-up
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
