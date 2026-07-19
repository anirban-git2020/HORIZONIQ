"use client";

import { useEffect, useRef, useState } from "react";

import {
  buildSignalSnapshot,
  classifyVisitChanges,
  loadVisitSnapshot,
  saveVisitSnapshot,
  type SignalBucket,
} from "@/lib/visit-snapshot";

export type VisitSignalInput = {
  id: string;
  title: string;
  momentum: number;
  /** Net momentum change across the tracked window; sign drives the change type. */
  momentumChange: number;
};

export type DigestMover = {
  id: string;
  title: string;
  bucket: SignalBucket; // "new" | "rising" | "falling"
  delta: number;
};

export type VisitChanges = {
  /** Signals that moved (or are new) since the last visit, biggest first. */
  movers: DigestMover[];
  /** How many previously-seen signals held steady. */
  steadyCount: number;
  /** Ids of signals unchanged since the last visit (drives the tile message). */
  unchanged: ReadonlySet<string>;
  /** When the user was last here, or null on a first visit. */
  lastVisitAt: string | null;
  /** True only when a prior snapshot existed to compare against. */
  isReturn: boolean;
};

const EMPTY: VisitChanges = {
  movers: [],
  steadyCount: 0,
  unchanged: new Set<string>(),
  lastVisitAt: null,
  isReturn: false,
};

function changeTypeOf(momentumChange: number): string {
  if (momentumChange > 0) return "rising";
  if (momentumChange < 0) return "falling";
  return "stable";
}

/**
 * What changed in the user's signals since their last visit.
 *
 * Wires the (previously dormant) visit-snapshot store and compares the current
 * momentum of each signal against the snapshot taken on the last visit —
 * across data periods, so a digest reflects "since you were last here," not just
 * within one day. Reuses lib/visit-snapshot.ts entirely: no new comparison
 * logic. First visits return an empty result and simply record the baseline.
 *
 * Runs once per mount (data is stable within a session), computing the result
 * from the prior snapshot *before* overwriting it with this visit.
 */
export function useVisitChanges(
  signals: readonly VisitSignalInput[],
  briefingPeriod: string | null
): VisitChanges {
  const [changes, setChanges] = useState<VisitChanges>(EMPTY);
  const hasRun = useRef(false);

  useEffect(() => {
    if (signals.length === 0 || hasRun.current) return;
    hasRun.current = true;

    const prior = loadVisitSnapshot();
    const isReturn = Boolean(prior && Object.keys(prior.signals).length > 0);

    const titleById = new Map(signals.map((s) => [s.id, s.title] as const));
    const descriptors = signals.map((s) => ({
      id: s.id,
      momentum: s.momentum,
      confidence: 0, // not displayed; the store only needs it for confidenceDelta
      change: { type: changeTypeOf(s.momentumChange) },
    }));

    if (isReturn && prior) {
      const raw = classifyVisitChanges(descriptors, prior.signals, true);
      const movers: DigestMover[] = raw
        .map((c) => ({
          id: c.signalId,
          title: titleById.get(c.signalId) ?? c.signalId,
          bucket: c.bucket,
          delta: c.momentumDelta,
        }))
        .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

      const moverIds = new Set(movers.map((m) => m.id));
      const unchanged = new Set(
        descriptors
          .filter((d) => prior.signals[d.id] && !moverIds.has(d.id))
          .map((d) => d.id)
      );

      setChanges({
        movers,
        steadyCount: unchanged.size,
        unchanged,
        lastVisitAt: prior.lastVisitAt ?? null,
        isReturn: true,
      });
    } else {
      setChanges(EMPTY);
    }

    // Record this visit as the baseline for next time.
    saveVisitSnapshot({
      lastVisitAt: new Date().toISOString(),
      briefingPeriod: briefingPeriod ?? "",
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
  }, [signals, briefingPeriod]);

  return changes;
}
