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
  applyExternalDisplayName,
  applyExternalJourney,
  useLandingJourney,
} from "@/hooks/use-landing-journey";
import {
  readOnboardingRecord,
  readPreferencesFromStorage,
  writeOnboardingRecord,
} from "@/lib/onboarding-state";
import { usePreferences } from "@/lib/preferences";

const SAVE_DEBOUNCE_MS = 800;

/** The name this device knows: the live journey first, then the durable record. */
function resolveLocalName(journeyName: string): string | null {
  const fromJourney = journeyName.trim();
  if (fromJourney) return fromJourney;
  return readOnboardingRecord().displayName;
}

/** Push a name from the profile into both local stores. */
function applyRemoteName(name: string | null): void {
  if (!name) return;
  applyExternalDisplayName(name);
  const record = readOnboardingRecord();
  if (record.displayName !== name) {
    writeOnboardingRecord({ ...record, displayName: name });
  }
}

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
  const { journey } = useLandingJourney();
  const [synced, setSynced] = useState(false);
  const lastSaved = useRef<string | null>(null);

  const localName = resolveLocalName(journey.displayName);

  // Sign-in: reconcile the profile with local state, once per session.
  useEffect(() => {
    if (loading || !supabase || !user || !hydrated || synced) return;

    let active = true;

    void (async () => {
      const remote = await fetchProfile(supabase, user.id);
      if (!active) return;

      // A saved name always comes across, even if the profile has no prefs yet.
      if (remote?.displayName) applyRemoteName(remote.displayName);

      if (remote && hasPreferences(remote)) {
        // Profile wins — this device adopts the user's saved preferences.
        hydrate(remote);
        // Mirror the selections into the onboarding journey so a returning user
        // isn't walked through setup again. Only a complete profile skips it.
        applyExternalJourney({
          role: remote.role,
          region: remote.region,
          interests: [...remote.interests],
          complete: Boolean(
            remote.role && remote.region && remote.interests.length > 0
          ),
        });
        lastSaved.current = serialize(remote);
      } else {
        // First sign-in: lift whatever this device already knows into the profile.
        const local: ProfileRecord = {
          ...readPreferencesFromStorage(),
          displayName: localName,
        };
        if (hasPreferences(local) || local.displayName) {
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
  }, [supabase, user, loading, hydrated, synced, hydrate, localName]);

  // Write through on change, debounced, skipping no-op writes.
  useEffect(() => {
    if (!synced || !supabase || !user) return;

    const record: ProfileRecord = {
      ...preferences,
      displayName: localName,
    };
    const next = serialize(record);
    if (next === lastSaved.current) return;

    const timer = setTimeout(() => {
      void saveProfile(supabase, user.id, record).then((ok) => {
        if (ok) lastSaved.current = next;
      });
    }, SAVE_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [preferences, localName, synced, supabase, user]);

  // Signing out resets the handshake so the next sign-in re-syncs cleanly.
  useEffect(() => {
    if (!user) {
      setSynced(false);
      lastSaved.current = null;
    }
  }, [user]);

  return null;
}
