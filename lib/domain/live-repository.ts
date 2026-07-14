import { createInMemorySignalRepository } from "@/lib/domain/in-memory-repository";
import { mockSignalRepository } from "@/lib/domain/mock-intelligence";
import type { SignalRepository } from "@/lib/domain/repositories";
import { GENERATED_SIGNALS } from "@/lib/intelligence/generated-signals";

const liveSignalRepository: SignalRepository =
  createInMemorySignalRepository(GENERATED_SIGNALS);

/**
 * The single swap point for Signal data. Returns the live pipeline repository
 * when it has produced Signals; otherwise the curated fallback. The Experience
 * Layer only ever calls this — it never knows which source answered, and it
 * never breaks when live data is absent (graceful degradation, honest state).
 */
export function getSignalRepository(): SignalRepository {
  return GENERATED_SIGNALS.length > 0 ? liveSignalRepository : mockSignalRepository;
}

/** True when the Exchange is showing live, evidence-backed intelligence. */
export function isLiveIntelligence(): boolean {
  return GENERATED_SIGNALS.length > 0;
}

/** ISO timestamp of the most recent observation across signals, or null. */
export function getIntelligenceUpdatedAt(): string | null {
  let latest: string | null = null;
  for (const s of getSignalRepository().getAll()) {
    const t = s.evidence.lastObserved;
    if (t && (!latest || t > latest)) latest = t;
  }
  return latest;
}
