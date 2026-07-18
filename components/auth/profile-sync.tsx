"use client";

import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import {
  fetchProfile,
  hasPreferences,
  saveProfile,
  type ProfileRecord,
} from "@/lib/auth/profiles";
import {
  readOnboardingRecord,
  readPreferencesFromStorage,
} from "@/lib/onboarding-state";
import { usePreferences } from "@/lib/preferences";

const SAVE_DEBOUNCE_MS = 800;

/** Stable comparison key so we never write an unchanged record. */
function serialize(record: ProfileRecord): string {
  return JSON.stringify({
    role: record.role,
    region: record.region,
    interests: [...record.interests].sort(),
    displayName: record.displayName,
  });
}

/**
 * Cross-device preference sync. Renders nothing.
 *
 * Signed out → untouched: localStorage remains the only store.
 * Signed in  → the profile is the source of truth. On sign-in we either hydrate
 * local state from the profile, or (first sign-in, empty profile) migrate the
 * existing local preferences up. Subsequent changes write through, debounced.
 *
 * A non-empty profile is never clobbered by empty local state — that would let
 * a fresh device wipe the user's real preferences.
 */
export function ProfileSync() {
  const { supabase, user, loading } = useAuth();
  const { preferences, hydrated, hydrate } = usePreferences();
  const [synced, setSynced] = useState(false);
  const lastSaved = useRef<string | null>(null);

  // Sign-in: reconcile the profile with local state, once per session.
  useEffect(() => {
    if (loading || !supabase || !user || !hydrated || synced) return;

    let active = true;

    void (async () => {
      const remote = await fetchProfile(supabase, user.id);
      if (!active) return;

      if (remote && hasPreferences(remote)) {
        // Profile wins — this device adopts the user's saved preferences.
        hydrate(remote);
        lastSaved.current = serialize(remote);
      } else {
        // First sign-in: lift whatever this device already knows into the profile.
        const local: ProfileRecord = {
          ...readPreferencesFromStorage(),
          displayName: readOnboardingRecord().displayName,
        };
        if (hasPreferences(local)) {
          await saveProfile(supabase, user.id, local);
          if (!active) return;
          lastSaved.current = serialize(local);
        }
      }

      if (active) setSynced(true);
    })();

    return () => {
      active = false;
    };
  }, [supabase, user, loading, hydrated, synced, hydrate]);

  // Write through on change, debounced, skipping no-op writes.
  useEffect(() => {
    if (!synced || !supabase || !user) return;

    const record: ProfileRecord = {
      ...preferences,
      displayName: readOnboardingRecord().displayName,
    };
    const next = serialize(record);
    if (next === lastSaved.current) return;

    const timer = setTimeout(() => {
      void saveProfile(supabase, user.id, record).then((ok) => {
        if (ok) lastSaved.current = next;
      });
    }, SAVE_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [preferences, synced, supabase, user]);

  // Signing out resets the handshake so the next sign-in re-syncs cleanly.
  useEffect(() => {
    if (!user) {
      setSynced(false);
      lastSaved.current = null;
    }
  }, [user]);

  return null;
}
