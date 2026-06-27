"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { BetaBadge } from "@/components/brand/beta-badge";
import { TaglineLockup } from "@/components/brand/tagline-lockup";
import { Button } from "@/components/ui/button";
import { WELCOME_HEADLINE } from "@/lib/copy";
import { identityService } from "@/lib/identity";
import { DURATION_SLOW, EASE_PREMIUM } from "@/lib/motion";

export function WelcomeScreen() {
  const router = useRouter();

  const advance = (skipped: boolean) => {
    identityService.markWelcomeComplete({ skipped });
    router.push("/onboarding/name");
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="pointer-events-none absolute inset-0 bg-ambient" />

      <div className="relative z-10 flex justify-end p-6 md:p-8">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => advance(true)}
        >
          Skip
        </Button>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-28 text-center md:pb-32">
        <motion.div
          className="mb-8 flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION_SLOW, ease: EASE_PREMIUM }}
        >
          <p className="label-caps text-primary">HorizonIQ</p>
          <BetaBadge />
        </motion.div>

        <motion.h1
          className="display-title max-w-4xl text-balance text-4xl md:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION_SLOW, delay: 0.12, ease: EASE_PREMIUM }}
        >
          {WELCOME_HEADLINE}
        </motion.h1>

        <div className="mt-12 md:mt-16">
          <TaglineLockup size="lg" animated />
        </div>

        <motion.div
          className="mt-16 md:mt-20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.05, ease: EASE_PREMIUM }}
        >
          <Button size="lg" onClick={() => advance(false)} className="min-w-[220px]">
            Continue
            <ArrowRight />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
