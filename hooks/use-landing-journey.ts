"use client";

import { useCallback, useEffect, useState } from "react";

import type { InterestId, RegionId, RoleId } from "@/lib/types";

/**
 * Landing Experience state — the single source of truth for onboarding.
 *
 * Persistence is intentionally isolated in this hook. It is the ONLY place
 * that touches storage, so a future backend migration replaces the read()/
 * write() bodies below and nothing in the UI changes.
 *
 * Per spec: sessionStorage only (clears when the browser session ends).
 */
export type LandingJourney = {
  displayName: string;
  selectedRole: RoleId | null;
  selectedRegion: RegionId | null;
  selectedInterests: InterestId[];
  tourCompleted: boolean;
};

const STORAGE_KEY = "horizoniq.landing.v1";

const EMPTY: LandingJourney = {
  displayName: "",
  selectedRole: null,
  selectedRegion: null,
  selectedInterests: [],
  tourCompleted: false,
};

// —— Storage layer (the only swap point for a future backend) ——————————————
function read(): LandingJourney {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<LandingJourney>;
    return {
      ...EMPTY,
      ...parsed,
      selectedInterests: Array.isArray(parsed.selectedInterests)
        ? parsed.selectedInterests
        : [],
    };
  } catch {
    return EMPTY;
  }
}

function write(next: LandingJourney): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (private mode, quota) — degrade to in-memory only.
  }
}
// ———————————————————————————————————————————————————————————————————————————

/** Clears the persisted journey — used by the "Start over" control. */
export function clearLandingJourney(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Notifies mounted useLandingJourney() consumers that storage changed. */
const SYNC_EVENT = "horizoniq:landing-journey-sync";

/**
 * Apply a display name from an external source (the signed-in profile), then
 * notify mounted consumers so the UI updates without a reload. Storage access
 * still lives only in this module.
 */
export function applyExternalDisplayName(displayName: string): void {
  if (typeof window === "undefined") return;
  const name = displayName.trim();
  if (!name) return;
  const current = read();
  if (current.displayName === name) return;
  write({ ...current, displayName: name });
  window.dispatchEvent(new Event(SYNC_EVENT));
}

export function useLandingJourney() {
  const [hydrated, setHydrated] = useState(false);
  const [journey, setJourney] = useState<LandingJourney>(EMPTY);

  useEffect(() => {
    setJourney(read());
    setHydrated(true);
  }, []);

  // Re-read when an external source (profile sync) updates storage.
  useEffect(() => {
    const onSync = () => setJourney(read());
    window.addEventListener(SYNC_EVENT, onSync);
    return () => window.removeEventListener(SYNC_EVENT, onSync);
  }, []);

  const commit = useCallback((next: LandingJourney) => {
    write(next);
    setJourney(next);
  }, []);

  const setDisplayName = useCallback(
    (displayName: string) =>
      setJourney((prev) => {
        const next = { ...prev, displayName };
        write(next);
        return next;
      }),
    []
  );

  const setRole = useCallback(
    (selectedRole: RoleId) =>
      setJourney((prev) => {
        const next = { ...prev, selectedRole };
        write(next);
        return next;
      }),
    []
  );

  const setRegion = useCallback(
    (selectedRegion: RegionId) =>
      setJourney((prev) => {
        const next = { ...prev, selectedRegion };
        write(next);
        return next;
      }),
    []
  );

  const setInterests = useCallback(
    (selectedInterests: InterestId[]) =>
      setJourney((prev) => {
        const next = { ...prev, selectedInterests };
        write(next);
        return next;
      }),
    []
  );

  const toggleInterest = useCallback(
    (id: InterestId) =>
      setJourney((prev) => {
        const has = prev.selectedInterests.includes(id);
        const selectedInterests = has
          ? prev.selectedInterests.filter((x) => x !== id)
          : [...prev.selectedInterests, id];
        const next = { ...prev, selectedInterests };
        write(next);
        return next;
      }),
    []
  );

  const completeTour = useCallback(
    () =>
      setJourney((prev) => {
        const next = { ...prev, tourCompleted: true };
        write(next);
        return next;
      }),
    []
  );

  const reset = useCallback(() => commit(EMPTY), [commit]);

  return {
    hydrated,
    journey,
    setDisplayName,
    setRole,
    setRegion,
    setInterests,
    toggleInterest,
    completeTour,
    reset,
  };
}
