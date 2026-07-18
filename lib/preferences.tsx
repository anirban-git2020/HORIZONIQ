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
import { ROLE_INTEREST_IDS, isInterestAllowedForRole } from "@/lib/options";

const STORAGE_KEY = "horizoniq.preferences.v2";

const EMPTY: Preferences = { role: null, region: null, interests: [] };

const LEGACY_INTEREST_MAP: Record<string, InterestId> = {
  ai: "artificial-intelligence",
  biotech: "biotechnology",
  climate: "energy",
  fintech: "finance",
  space: "startups",
};

const LEGACY_REGION_MAP: Record<string, RegionId> = {
  "asia-pacific": "southeast-asia",
  "middle-east-africa": "middle-east",
  global: "north-america",
};

const VALID_INTERESTS = new Set<string>([
  "artificial-intelligence",
  "robotics",
  "quantum-computing",
  "cybersecurity",
  "cloud-computing",
  "manufacturing",
  "supply-chain",
  "healthcare",
  "finance",
  "energy",
  "biotechnology",
  "biochemistry",
  "life-sciences",
  "arts",
  "commerce",
  "entrepreneurship",
  "startups",
  "venture-capital",
  "product-management",
]);

const VALID_REGIONS = new Set<string>([
  "north-america",
  "europe",
  "india",
  "china",
  "southeast-asia",
  "middle-east",
  "africa",
  "latin-america",
]);

function migratePreferences(raw: Partial<Preferences>): Preferences {
  const regionRaw = raw.region as string | null | undefined;
  let region: RegionId | null = null;
  if (regionRaw) {
    if (VALID_REGIONS.has(regionRaw)) {
      region = regionRaw as RegionId;
    } else if (LEGACY_REGION_MAP[regionRaw]) {
      region = LEGACY_REGION_MAP[regionRaw];
    }
  }

  const interests = Array.isArray(raw.interests)
    ? [
        ...new Set(
          raw.interests
            .map((id) => {
              const key = id as string;
              if (VALID_INTERESTS.has(key)) return key as InterestId;
              return LEGACY_INTEREST_MAP[key] ?? null;
            })
            .filter((id): id is InterestId => id !== null)
        ),
      ]
    : [];

  return {
    role: raw.role ?? null,
    region,
    interests,
  };
}

interface PreferencesContextValue {
  preferences: Preferences;
  hydrated: boolean;
  setRole: (role: RoleId) => void;
  setRegion: (region: RegionId) => void;
  toggleInterest: (interest: InterestId) => void;
  setInterests: (interests: InterestId[]) => void;
  /**
   * Replace all preferences at once from an external source (the signed-in
   * user's profile). Runs the same migration/validation as local storage, so a
   * stale or malformed row can never poison state.
   */
  hydrate: (next: Partial<Preferences>) => void;
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
      const raw =
        window.localStorage.getItem(STORAGE_KEY) ??
        window.localStorage.getItem("horizoniq.preferences.v1");
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Preferences>;
        setPreferences(migratePreferences(parsed));
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
    setPreferences((prev) => {
      const allowed = new Set(ROLE_INTEREST_IDS[role]);
      const interests = prev.interests.filter((id) => allowed.has(id));
      return { ...prev, role, interests };
    });
  }, []);

  const setRegion = useCallback((region: RegionId) => {
    setPreferences((prev) => ({ ...prev, region }));
  }, []);

  const toggleInterest = useCallback((interest: InterestId) => {
    setPreferences((prev) => {
      if (!prev.role || !isInterestAllowedForRole(prev.role, interest)) {
        return prev;
      }
      const has = prev.interests.includes(interest);
      return {
        ...prev,
        interests: has
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      };
    });
  }, []);

  const setInterests = useCallback((interests: InterestId[]) => {
    setPreferences((prev) => ({ ...prev, interests }));
  }, []);

  const hydrate = useCallback((next: Partial<Preferences>) => {
    setPreferences(migratePreferences(next));
  }, []);

  const reset = useCallback(() => setPreferences(EMPTY), []);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      preferences,
      hydrated,
      setRole,
      setRegion,
      toggleInterest,
      setInterests,
      hydrate,
      reset,
      isComplete:
        preferences.role !== null &&
        preferences.region !== null &&
        preferences.interests.length > 0,
    }),
    [
      preferences,
      hydrated,
      setRole,
      setRegion,
      toggleInterest,
      setInterests,
      hydrate,
      reset,
    ]
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
