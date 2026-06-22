"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { AnimatedCounter } from "@/components/motion/animated-counter";
import { MeterBar } from "@/components/ui/meter-bar";
import { cn } from "@/lib/utils";
import type { EvidenceDriver } from "@/lib/types";

interface SignalEvidenceProps {
  momentum: number;
  confidence: number;
  momentumDrivers: EvidenceDriver[];
  confidenceFactors: EvidenceDriver[];
}

export function SignalEvidence({
  momentum,
  confidence,
  momentumDrivers,
  confidenceFactors,
}: SignalEvidenceProps) {
  const [openMomentum, setOpenMomentum] = useState(false);
  const [openConfidence, setOpenConfidence] = useState(false);

  return (
    <div className="space-y-3">
      <EvidenceBlock
        label="Momentum"
        score={momentum}
        tone="success"
        drivers={momentumDrivers}
        open={openMomentum}
        onToggle={() => setOpenMomentum((v) => !v)}
        driverPrefix="+"
      />
      <EvidenceBlock
        label="Confidence"
        score={confidence}
        tone="primary"
        drivers={confidenceFactors}
        open={openConfidence}
        onToggle={() => setOpenConfidence((v) => !v)}
        driverPrefix=""
      />
    </div>
  );
}

function EvidenceBlock({
  label,
  score,
  tone,
  drivers,
  open,
  onToggle,
  driverPrefix,
}: {
  label: string;
  score: number;
  tone: "success" | "primary";
  drivers: EvidenceDriver[];
  open: boolean;
  onToggle: () => void;
  driverPrefix: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 p-3 text-left transition-colors hover:bg-secondary/40"
        aria-expanded={open}
      >
        <div className="flex-1">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">{label}</span>
            <span
              className={cn(
                "text-lg font-semibold tabular-nums",
                tone === "success" ? "text-success" : "text-primary"
              )}
            >
              <AnimatedCounter value={score} />
            </span>
          </div>
          <MeterBar value={score} tone={tone} animate={!open} />
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-3 pb-3 pt-2">
              <p className="label-caps mb-2">Based on</p>
              <ul className="space-y-2">
                {drivers.map((d) => (
                  <li
                    key={d.label}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-muted-foreground">{d.label}</span>
                    <span className="font-semibold tabular-nums text-foreground">
                      {driverPrefix}
                      {d.value}
                      {d.unit === "%" ? "%" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
