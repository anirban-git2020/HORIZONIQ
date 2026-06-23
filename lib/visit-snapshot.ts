const STORAGE_KEY = "horizoniq-visit-snapshot";

export type SignalBucket = "new" | "rising" | "falling";

export interface SignalSnapshot {
  momentum: number;
  confidence: number;
  changeType: string;
}

export interface VisitSnapshot {
  lastVisitAt: string;
  briefingPeriod: string;
  signals: Record<string, SignalSnapshot>;
}

export function loadVisitSnapshot(): VisitSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as VisitSnapshot;
  } catch {
    return null;
  }
}

export function saveVisitSnapshot(snapshot: VisitSnapshot): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export function hasVisitSnapshot(): boolean {
  const snapshot = loadVisitSnapshot();
  return snapshot !== null && Object.keys(snapshot.signals).length > 0;
}

/** Return visits compare against snapshot only within the same briefing period. */
export function isReturnVisitForPeriod(
  snapshot: VisitSnapshot | null,
  briefingPeriod: string
): boolean {
  return (
    snapshot !== null &&
    Object.keys(snapshot.signals).length > 0 &&
    snapshot.briefingPeriod === briefingPeriod
  );
}

/**
 * First visit stores baseline (previousMomentum) so return visits can show movement.
 * Subsequent saves store current values for the next comparison.
 */
export function buildSignalSnapshot(
  signals: {
    id: string;
    momentum: number;
    confidence: number;
    previousMomentum: number;
    previousConfidence: number;
    change: { type: string };
  }[],
  previousSnapshot: VisitSnapshot | null
): Record<string, SignalSnapshot> {
  const isFirstVisit = !previousSnapshot;
  const result: Record<string, SignalSnapshot> = {
    ...(previousSnapshot?.signals ?? {}),
  };

  for (const signal of signals) {
    const existing = previousSnapshot?.signals[signal.id];

    if (isFirstVisit) {
      result[signal.id] = {
        momentum: signal.previousMomentum,
        confidence: signal.previousConfidence,
        changeType: "stable",
      };
      continue;
    }

    if (!existing) {
      result[signal.id] = {
        momentum: signal.momentum,
        confidence: signal.confidence,
        changeType: signal.change.type,
      };
      continue;
    }

    result[signal.id] = {
      momentum: signal.momentum,
      confidence: signal.confidence,
      changeType: signal.change.type,
    };
  }

  return result;
}

export interface SignalVisitChange {
  signalId: string;
  bucket: SignalBucket;
  momentumDelta: number;
  confidenceDelta: number;
  previousMomentum?: number;
  previousConfidence?: number;
}

const MOMENTUM_THRESHOLD = 3;

export function classifyVisitChanges(
  signals: {
    id: string;
    momentum: number;
    confidence: number;
    change: { type: string };
  }[],
  previous: Record<string, SignalSnapshot> | null,
  isReturnVisit: boolean
): SignalVisitChange[] {
  if (!isReturnVisit || !previous) return [];

  const changes: SignalVisitChange[] = [];

  for (const signal of signals) {
    const prev = previous[signal.id];

    if (!prev) {
      changes.push({
        signalId: signal.id,
        bucket: "new",
        momentumDelta: signal.momentum,
        confidenceDelta: signal.confidence,
      });
      continue;
    }

    const momentumDelta = signal.momentum - prev.momentum;
    const confidenceDelta = signal.confidence - prev.confidence;

    let bucket: SignalBucket | null = null;

    if (momentumDelta >= MOMENTUM_THRESHOLD) {
      bucket = "rising";
    } else if (momentumDelta <= -MOMENTUM_THRESHOLD) {
      bucket = "falling";
    } else if (prev.changeType !== signal.change.type) {
      if (signal.change.type === "new") bucket = "new";
      else if (signal.change.type === "rising") bucket = "rising";
      else if (signal.change.type === "falling") bucket = "falling";
    }

    if (bucket) {
      changes.push({
        signalId: signal.id,
        bucket,
        momentumDelta,
        confidenceDelta,
        previousMomentum: prev.momentum,
        previousConfidence: prev.confidence,
      });
    }
  }

  return changes;
}

export function classifyBriefingPeriodChanges(
  signals: {
    id: string;
    change: { type: string };
    momentum: number;
    confidence: number;
    previousMomentum: number;
    previousConfidence: number;
  }[]
): SignalVisitChange[] {
  return signals
    .filter((s) => s.change.type !== "stable")
    .map((signal) => ({
      signalId: signal.id,
      bucket:
        signal.change.type === "new"
          ? "new"
          : signal.change.type === "rising"
            ? "rising"
            : "falling",
      momentumDelta: signal.momentum - signal.previousMomentum,
      confidenceDelta: signal.confidence - signal.previousConfidence,
      previousMomentum: signal.previousMomentum,
      previousConfidence: signal.previousConfidence,
    }));
}

export function clearVisitSnapshot(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
