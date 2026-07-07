"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Beat = {
  eyebrow: string;
  line: string;
};

const BEATS: Beat[] = [
  { eyebrow: "Observe", line: "The world changes every second." },
  {
    eyebrow: "Predict",
    line: "Signals become trends before they become headlines.",
  },
  {
    eyebrow: "Lead",
    line: "HorizonIQ helps you understand change before it becomes obvious.",
  },
];

const CLOSING = "Let's personalize your Intelligence Brief.";

/**
 * Guided Tour — three narrative scenes then a closing beat.
 * Calm fade only. No numbered steps, no progress bar.
 */
export function GuidedTourScenes({
  name,
  onComplete,
}: {
  name?: string;
  onComplete: () => void;
}) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  const isClosing = index >= BEATS.length;
  const beat = BEATS[index];
  const closingLine = name
    ? `${name}, let's personalize your Intelligence Brief.`
    : CLOSING;

  const advance = () => setIndex((i) => i + 1);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex min-h-[16rem] w-full max-w-3xl flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={isClosing ? "closing" : `beat-${index}`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: reduced ? 0.16 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            {isClosing ? (
              <>
                <p className="label-caps text-primary">Ready</p>
                <h2 className="display-title mt-5 text-balance text-3xl md:text-4xl lg:text-5xl">
                  {closingLine}
                </h2>
              </>
            ) : (
              <>
                <p className="font-heading text-4xl font-bold tracking-tight text-primary md:text-6xl">
                  {beat.eyebrow}
                </p>
                <h2 className="mt-5 max-w-2xl text-balance text-xl font-medium leading-snug text-foreground/90 md:text-2xl">
                  {beat.line}
                </h2>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-14">
        {isClosing ? (
          <Button size="lg" className="min-w-[240px] font-bold" onClick={onComplete}>
            Enter HorizonIQ
            <ArrowRight />
          </Button>
        ) : (
          <Button size="lg" className="min-w-[200px]" onClick={advance}>
            Continue
            <ArrowRight />
          </Button>
        )}
      </div>
    </div>
  );
}
