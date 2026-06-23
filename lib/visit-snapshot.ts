const STORAGE_KEY = "horizoniq-visit-snapshot";

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

export function buildSignalSnapshot(
  signals: { id: string; momentum: number; confidence: number; change: { type: string } }[]
): Record<string, SignalSnapshot> {
  return Object.fromEntries(
    signals.map((s) => [
      s.id,
      {
        momentum: s.momentum,
        confidence: s.confidence,
        changeType: s.change.type,
      },
    ])
  );
}

export interface SignalVisitChange {
  signalId: string;
  type: "new_to_user" | "momentum_shift" | "confidence_shift" | "change_type_shift";
  momentumDelta: number;
  confidenceDelta: number;
  previousMomentum?: number;
  previousConfidence?: number;
}

export function diffAgainstSnapshot(
  current: { id: string; momentum: number; confidence: number; change: { type: string } }[],
  previous: Record<string, SignalSnapshot> | null
): SignalVisitChange[] {
  if (!previous) return [];

  const changes: SignalVisitChange[] = [];

  for (const signal of current) {
    const prev = previous[signal.id];
    if (!prev) {
      changes.push({
        signalId: signal.id,
        type: "new_to_user",
        momentumDelta: signal.momentum,
        confidenceDelta: signal.confidence,
      });
      continue;
    }

    const momentumDelta = signal.momentum - prev.momentum;
    const confidenceDelta = signal.confidence - prev.confidence;

    if (
      Math.abs(momentumDelta) >= 3 ||
      Math.abs(confidenceDelta) >= 3 ||
      prev.changeType !== signal.change.type
    ) {
      changes.push({
        signalId: signal.id,
        type:
          prev.changeType !== signal.change.type
            ? "change_type_shift"
            : Math.abs(momentumDelta) >= Math.abs(confidenceDelta)
              ? "momentum_shift"
              : "confidence_shift",
        momentumDelta,
        confidenceDelta,
        previousMomentum: prev.momentum,
        previousConfidence: prev.confidence,
      });
    }
  }

  return changes;
}
