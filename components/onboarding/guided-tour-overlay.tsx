"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface TourStep {
  id: string;
  target: string;
  title: string;
  description: string;
  fallbackDescription: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "dashboard",
    target: "[data-tour='dashboard']",
    title: "Your Dashboard",
    description:
      "This is your personal intelligence briefing — refreshed weekly with changes that matter to you.",
    fallbackDescription:
      "This is your personal intelligence briefing — refreshed weekly with changes that matter to you.",
  },
  {
    id: "what-changed",
    target: "[data-tour='what-changed']",
    title: "What Changed",
    description:
      "Every visit starts here: what shifted, why it matters to you, and what to do next.",
    fallbackDescription:
      "Every visit starts here: what shifted, why it matters to you, and what to do next.",
  },
  {
    id: "signals",
    target: "[data-tour='signals']",
    title: "Signals",
    description:
      "Signals are the changes we're tracking for your role, region, and interests.",
    fallbackDescription:
      "Signals are the changes we track for you. Your watchlist shows what we're following this week.",
  },
  {
    id: "opportunities",
    target: "[data-tour='opportunities']",
    title: "Opportunities",
    description:
      "New This Week and Heating Up opportunities — matched to your profile.",
    fallbackDescription:
      "On your next visit, emerging opportunities tailored to you will appear in this section.",
  },
  {
    id: "recommended-actions",
    target: "[data-tour='recommended-actions']",
    title: "Recommended Actions",
    description:
      "One clear action per briefing — what to do differently this week.",
    fallbackDescription:
      "Your primary recommended action lives in the What Changed section on first visits. Full action cards unlock when you return.",
  },
];

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function measureTarget(selector: string): SpotlightRect | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return null;
  const pad = 8;
  return {
    top: Math.max(8, rect.top - pad),
    left: Math.max(8, rect.left - pad),
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
  };
}

export function GuidedTourOverlay({
  active,
  onComplete,
}: {
  active: boolean;
  onComplete: () => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);

  const step = TOUR_STEPS[stepIndex];
  const isLast = stepIndex === TOUR_STEPS.length - 1;

  const updateSpotlight = useCallback(() => {
    if (!step) return;
    const rect = measureTarget(step.target);
    setSpotlight(rect);
    if (rect) {
      document.querySelector(step.target)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [step]);

  useEffect(() => {
    if (!active) return;
    setStepIndex(0);
  }, [active]);

  useEffect(() => {
    if (!active || !step) return;
    updateSpotlight();
    window.addEventListener("resize", updateSpotlight);
    window.addEventListener("scroll", updateSpotlight, true);
    const timer = window.setTimeout(updateSpotlight, 120);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", updateSpotlight);
      window.removeEventListener("scroll", updateSpotlight, true);
    };
  }, [active, step, updateSpotlight]);

  const handleNext = () => {
    if (isLast) {
      onComplete();
      return;
    }
    setStepIndex((i) => i + 1);
  };

  const handleSkip = () => {
    onComplete();
  };

  if (!active || !step) return null;

  const body = spotlight ? step.description : step.fallbackDescription;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guided-tour-title"
      >
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-[2px]"
          onClick={handleSkip}
          aria-hidden
        />

        {spotlight && (
          <motion.div
            className="pointer-events-none absolute rounded-xl ring-2 ring-primary/60 ring-offset-2 ring-offset-background"
            initial={false}
            animate={{
              top: spotlight.top,
              left: spotlight.left,
              width: spotlight.width,
              height: spotlight.height,
            }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          />
        )}

        <motion.div
          key={step.id}
          className={
            spotlight
              ? "absolute left-1/2 w-[min(92vw,28rem)] -translate-x-1/2 rounded-2xl border border-border bg-card p-6 shadow-premium"
              : "absolute left-1/2 top-1/2 w-[min(92vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-premium"
          }
          style={
            spotlight
              ? {
                  top: Math.min(
                    spotlight.top + spotlight.height + 16,
                    window.innerHeight - 220
                  ),
                }
              : undefined
          }
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="label-caps mb-1 text-primary">
                Step {stepIndex + 1} of {TOUR_STEPS.length}
              </p>
              <h2 id="guided-tour-title" className="text-lg font-semibold">
                {step.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={handleSkip}
              className="rounded-md p-1 text-muted-foreground hover:text-foreground"
              aria-label="Close tour"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              Skip tour
            </Button>
            <Button size="sm" onClick={handleNext}>
              {isLast ? "Finish" : "Next"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
