"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { BetaBadge } from "@/components/brand/beta-badge";
import { TaglineLockup } from "@/components/brand/tagline-lockup";
import { IntelligenceFieldCanvas } from "@/components/intelligence-field/intelligence-field-canvas";
import { Button } from "@/components/ui/button";
import { WELCOME_HEADLINE } from "@/lib/copy";
import { identityService } from "@/lib/identity";
import { NEUTRAL_FIELD_PARAMS } from "@/lib/intelligence-field/params";
import { DURATION_SLOW, EASE_PREMIUM } from "@/lib/motion";

type WelcomePhase = "greeting" | "core" | "ready";

const CORE_REVEAL_MS = 2800;

export function WelcomeScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<WelcomePhase>("greeting");
  const [fieldIntensity, setFieldIntensity] = useState(0.12);

  useEffect(() => {
    const revealTimer = window.setTimeout(() => {
      setPhase("core");
      setFieldIntensity(0.72);
    }, CORE_REVEAL_MS);

    const readyTimer = window.setTimeout(() => {
      setPhase("ready");
    }, CORE_REVEAL_MS + 1400);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(readyTimer);
    };
  }, []);

  const advance = (skipped: boolean) => {
    identityService.markWelcomeComplete({ skipped });
    router.push("/onboarding/name");
  };

  const showCopy = phase === "greeting";
  const coreDominant = phase === "core" || phase === "ready";

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <IntelligenceFieldCanvas
        params={NEUTRAL_FIELD_PARAMS}
        variant="welcome"
        mode="webgl"
        intensity={fieldIntensity}
        className="z-0"
      />

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
        <AnimatePresence mode="wait">
          {showCopy && (
            <motion.div
              key="greeting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.9, ease: EASE_PREMIUM }}
              className="flex flex-col items-center"
            >
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
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {coreDominant && (
            <motion.div
              key="core-prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.1, ease: EASE_PREMIUM }}
              className="absolute inset-x-6 bottom-28 flex flex-col items-center md:bottom-32"
            >
              {phase === "core" && (
                <motion.p
                  className="label-caps text-primary/90"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  Intelligence awakening
                </motion.p>
              )}

              {phase === "ready" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: EASE_PREMIUM }}
                  className="flex flex-col items-center gap-6"
                >
                  <TaglineLockup size="sm" className="opacity-80" />
                  <Button
                    size="lg"
                    onClick={() => advance(false)}
                    className="min-w-[240px]"
                  >
                    Enter HorizonIQ
                    <ArrowRight />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
