"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { InterestId, Preferences, RegionId, RoleId } from "@/lib/types";

const STORAGE_KEY = "horizoniq.preferences.v1";

const EMPTY: Preferences = { role: null, region: null, interests: [] };

interface PreferencesContextValue {
  preferences: Preferences;
  hydrated: boolean;
  setRole: (role: RoleId) => void;
  setRegion: (region: RegionId) => void;
  toggleInterest: (interest: InterestId) => void;
  reset: () => void;
  isComplete: boolean;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preferences, setPreferences] = useState<Preferences>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Preferences>;
        setPreferences({
          role: parsed.role ?? null,
          region: parsed.region ?? null,
          interests: Array.isArray(parsed.interests) ? parsed.interests : [],
        });
      }
    } catch {
      // Ignore corrupt storage and start fresh.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences, hydrated]);

  const setRole = useCallback((role: RoleId) => {
    setPreferences((prev) => ({ ...prev, role }));
  }, []);

  const setRegion = useCallback((region: RegionId) => {
    setPreferences((prev) => ({ ...prev, region }));
  }, []);

  const toggleInterest = useCallback((interest: InterestId) => {
    setPreferences((prev) => {
      const has = prev.interests.includes(interest);
      return {
        ...prev,
        interests: has
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      };
    });
  }, []);

  const reset = useCallback(() => setPreferences(EMPTY), []);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      preferences,
      hydrated,
      setRole,
      setRegion,
      toggleInterest,
      reset,
      isComplete:
        preferences.role !== null &&
        preferences.region !== null &&
        preferences.interests.length > 0,
    }),
    [preferences, hydrated, setRole, setRegion, toggleInterest, reset]
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return ctx;
}
