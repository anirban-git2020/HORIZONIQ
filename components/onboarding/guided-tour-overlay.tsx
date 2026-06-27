"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface TourStep {
  id: string;
  target: string;
  title: string;
  description: string;
  fallbackDescription: string;
  scrollBlock?: ScrollLogicalPosition;
  /** Extra measure delays (ms) after scroll — used when the target is far from prior step. */
  measureDelays?: number[];
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "what-changed",
    target: "[data-tour='what-changed']",
    title: "Your Week 1 Briefing",
    description:
      "Every visit starts here: what shifted, why it matters to you, and your recommended action.",
    fallbackDescription:
      "Your briefing hero shows what changed, why it matters, and what to do next.",
  },
  {
    id: "watchlist",
    target: "[data-tour='watchlist']",
    title: "Signals We're Tracking",
    description:
      "Your watchlist — signals matched to your role, region, and focus areas. Open any for the full intelligence brief.",
    fallbackDescription:
      "We track signals aligned with your profile. Each links to a full intelligence brief.",
  },
  {
    id: "next-briefing",
    target: "[data-tour='next-briefing']",
    title: "What's Coming Next",
    description:
      "Your next weekly briefing will reveal accelerations, slowdowns, and emerging opportunities.",
    fallbackDescription:
      "Return next week to see what accelerated, slowed, and what opportunities emerged.",
  },
  {
    id: "recommended-actions",
    target: "[data-tour='recommended-actions']",
    title: "Recommended Action",
    description:
      "One clear action per briefing — what to do differently this week.",
    fallbackDescription:
      "Your primary recommended action lives in the briefing hero above.",
    scrollBlock: "start",
    measureDelays: [80, 250, 450, 700, 1000, 1400],
  },
];

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const SPOTLIGHT_PAD = 10;
const SPOTLIGHT_RADIUS = 12;
const TOUR_START_DELAY_MS = 600;
const CARD_HEIGHT_ESTIMATE = 240;
const CARD_GAP = 16;

/** Measure the target relative to the viewport. Never scrolls. */
function measureTarget(selector: string): SpotlightRect | null {
  if (typeof document === "undefined") return null;
  const el = document.querySelector(selector);
  if (!el) return null;

  const rect = el.getBoundingClientRect();
  if (rect.width < 8 || rect.height < 8) return null;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Clamp the spotlight to the visible viewport so a tall or partially
  // off-screen target still produces a usable highlight.
  const top = Math.max(8, rect.top - SPOTLIGHT_PAD);
  const left = Math.max(8, rect.left - SPOTLIGHT_PAD);
  const bottom = Math.min(vh - 8, rect.bottom + SPOTLIGHT_PAD);
  const right = Math.min(vw - 8, rect.right + SPOTLIGHT_PAD);

  const width = right - left;
  const height = bottom - top;
  if (width < 8 || height < 8) return null;

  return { top, left, width, height };
}

/** Place the card below the spotlight, else above, else centered — always in view. */
function cardTop(spotlight: SpotlightRect | null): number {
  const vh = typeof window === "undefined" ? 800 : window.innerHeight;
  if (!spotlight) {
    return Math.max(CARD_GAP, (vh - CARD_HEIGHT_ESTIMATE) / 2);
  }

  const below = spotlight.top + spotlight.height + CARD_GAP;
  if (below + CARD_HEIGHT_ESTIMATE <= vh - CARD_GAP) {
    return below;
  }

  const above = spotlight.top - CARD_HEIGHT_ESTIMATE - CARD_GAP;
  if (above >= CARD_GAP) {
    return above;
  }

  return Math.max(CARD_GAP, (vh - CARD_HEIGHT_ESTIMATE) / 2);
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
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  // The overlay must render through a portal to document.body. A transformed
  // ancestor (the page-transition wrapper) would otherwise trap our
  // position:fixed overlay, causing the spotlight and card to scroll away.
  useEffect(() => {
    setMounted(true);
  }, []);

  const step = TOUR_STEPS[stepIndex];
  const isLast = stepIndex === TOUR_STEPS.length - 1;

  const remeasure = useCallback(() => {
    if (!step) return;
    setSpotlight(measureTarget(step.target));
  }, [step]);

  // Reset and arm the tour when it becomes active.
  useEffect(() => {
    if (!active) {
      setReady(false);
      setStepIndex(0);
      setSpotlight(null);
      return;
    }
    const timer = window.setTimeout(() => setReady(true), TOUR_START_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [active]);

  // On step change: scroll the target into view ONCE, then settle-measure.
  // Scrolling is intentionally separated from measuring to avoid a
  // scroll → scrollIntoView → scroll feedback loop.
  useEffect(() => {
    if (!active || !ready || !step) return;

    let cancelled = false;
    const target = document.querySelector(step.target);
    target?.scrollIntoView({
      behavior: "smooth",
      block: step.scrollBlock ?? "center",
      inline: "nearest",
    });

    const measure = () => {
      if (!cancelled) setSpotlight(measureTarget(step.target));
    };

    // Measure across the smooth-scroll settle window.
    measure();
    const delays = step.measureDelays ?? [80, 250, 450, 700];
    const timers = delays.map((ms) => window.setTimeout(measure, ms));

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [active, ready, step]);

  // Re-measure (never re-scroll) on scroll/resize so the spotlight tracks
  // the target if the user scrolls manually.
  useEffect(() => {
    if (!active || !ready || !step) return;

    window.addEventListener("resize", remeasure);
    window.addEventListener("scroll", remeasure, true);

    return () => {
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("scroll", remeasure, true);
    };
  }, [active, ready, step, remeasure]);

  const finishTour = useCallback(
    (skipped: boolean) => {
      track("guided_tour_completed", {
        skipped,
        stepsCompleted: skipped ? stepIndex : TOUR_STEPS.length,
      });
      onComplete();
    },
    [stepIndex, onComplete]
  );

  const handleNext = useCallback(() => {
    if (isLast) {
      finishTour(false);
      return;
    }
    setStepIndex((i) => i + 1);
  }, [isLast, finishTour]);

  const handleSkip = useCallback(() => finishTour(true), [finishTour]);

  // Keyboard support: Esc skips, Enter/→ advances.
  useEffect(() => {
    if (!active || !ready) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleSkip();
      } else if (e.key === "Enter" || e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, ready, handleSkip, handleNext]);

  if (!active || !ready || !step || !mounted) return null;

  const body = spotlight ? step.description : step.fallbackDescription;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guided-tour-title"
      >
        {/* Dimmer + spotlight cutout. Sits at the base layer. */}
        {spotlight ? (
          <svg className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <mask id="guided-tour-mask">
                <rect width="100%" height="100%" fill="white" />
                <rect
                  x={spotlight.left}
                  y={spotlight.top}
                  width={spotlight.width}
                  height={spotlight.height}
                  rx={SPOTLIGHT_RADIUS}
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              className="fill-background/80"
              mask="url(#guided-tour-mask)"
            />
          </svg>
        ) : (
          <div
            className="absolute inset-0 bg-background/85 backdrop-blur-[2px]"
            aria-hidden
          />
        )}

        {/* Backdrop click target — explicitly below the highlight and card. */}
        <button
          type="button"
          className="absolute inset-0 z-[201] cursor-default"
          aria-label="Dismiss tour"
          onClick={handleSkip}
          tabIndex={-1}
        />

        {/* Highlight ring around the spotlight. */}
        {spotlight && (
          <motion.div
            className="pointer-events-none absolute z-[202] rounded-xl ring-2 ring-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.3)]"
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

        {/* Step card. Always on top and clickable. */}
        <motion.div
          key={step.id}
          className="pointer-events-auto absolute left-1/2 z-[210] w-[min(92vw,28rem)] -translate-x-1/2 rounded-2xl border border-border bg-card p-6 shadow-premium"
          style={{ top: cardTop(spotlight) }}
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
    </AnimatePresence>,
    document.body
  );
}
