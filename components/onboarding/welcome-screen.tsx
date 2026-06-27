"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { identityService } from "@/lib/identity";

const TAGLINE_LINES = ["Observe.", "Predict.", "Lead."] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export function WelcomeScreen() {
  const router = useRouter();

  const advance = (skipped: boolean) => {
    identityService.markWelcomeComplete({ skipped });
    router.push("/onboarding/name");
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,hsl(var(--primary)/0.08),transparent)]" />

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

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
        <motion.p
          className="label-caps mb-6 text-primary"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          HorizonIQ
        </motion.p>

        <motion.h1
          className="display-title max-w-3xl text-4xl md:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
        >
          Welcome to HorizonIQ.
        </motion.h1>

        <div className="mt-10 space-y-2 md:mt-12 md:space-y-3">
          {TAGLINE_LINES.map((line, index) => (
            <motion.p
              key={line}
              className="text-xl font-medium tracking-tight text-foreground/90 md:text-2xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.45 + index * 0.18, ease }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div
          className="mt-14 md:mt-16"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1, ease }}
        >
          <Button size="lg" onClick={() => advance(false)} className="min-w-[200px]">
            Continue
            <ArrowRight />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
