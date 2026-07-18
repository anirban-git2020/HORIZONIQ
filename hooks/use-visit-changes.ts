"use client";

import { useEffect, useRef, useState } from "react";

import {
  buildSignalSnapshot,
  classifyVisitChanges,
  isReturnVisitForPeriod,
  loadVisitSnapshot,
  saveVisitSnapshot,
} from "@/lib/visit-snapshot";

export type VisitSignalInput = {
  id: string;
  momentum: number;
  /** Net momentum change across the tracked window; sign drives the change type. */
  momentumChange: number;
};

function changeTypeOf(momentumChange: number): string {
  if (momentumChange > 0) return "rising";
  if (momentumChange < 0) return "falling";
  return "stable";
}

/**
 * Which signals have NOT changed since the user's last visit.
 *
 * Wires the (previously dormant) visit-snapshot store. A signal is "unchanged"
 * only when ALL of these hold, so the message is never shown speculatively:
 *   • it's a genuine return visit within the same briefing period, and
 *   • the signal existed in the prior snapshot, and
 *   • its momentum moved less than the store's threshold (classifyVisitChanges).
 * First visits, and visits after the pipeline period rolls over, return an empty
 * set. Each visit is persisted for the next comparison.
 *
 * Reuses lib/visit-snapshot.ts entirely — no new storage or comparison logic.
 */
export function useUnchangedSignals(
  signals: readonly VisitSignalInput[],
  briefingPeriod: string | null
): ReadonlySet<string> {
  const [unchanged, setUnchanged] = useState<ReadonlySet<string>>(
    () => new Set<string>()
  );
  const ranForPeriod = useRef<string | null>(null);

  useEffect(() => {
    if (!briefingPeriod || signals.length === 0) return;
    // Process a given period exactly once, even though `signals` is a fresh
    // array each render — otherwise we'd re-save the snapshot on every render.
    if (ranForPeriod.current === briefingPeriod) return;
    ranForPeriod.current = briefingPeriod;

    const prior = loadVisitSnapshot();
    const isReturn = isReturnVisitForPeriod(prior, briefingPeriod);

    const descriptors = signals.map((s) => ({
      id: s.id,
      momentum: s.momentum,
      confidence: 0, // not displayed; the store only needs it for confidenceDelta
      change: { type: changeTypeOf(s.momentumChange) },
    }));

    if (isReturn && prior) {
      const changed = new Set(
        classifyVisitChanges(descriptors, prior.signals, true).map(
          (c) => c.signalId
        )
      );
      setUnchanged(
        new Set(
          descriptors
            .filter((d) => prior.signals[d.id] && !changed.has(d.id))
            .map((d) => d.id)
        )
      );
    } else {
      setUnchanged(new Set<string>());
    }

    // Persist this visit as the baseline for next time.
    saveVisitSnapshot({
      lastVisitAt: new Date().toISOString(),
      briefingPeriod,
      signals: buildSignalSnapshot(
        signals.map((s) => ({
          id: s.id,
          momentum: s.momentum,
          confidence: 0,
          previousMomentum: s.momentum,
          previousConfidence: 0,
          change: { type: changeTypeOf(s.momentumChange) },
        })),
        prior
      ),
    });
  }, [briefingPeriod, signals]);

  return unchanged;
}
