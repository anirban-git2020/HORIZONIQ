import type { SupabaseClient } from "@supabase/supabase-js";

import type { Preferences } from "@/lib/types";

/**
 * Profile persistence — the cross-device source of truth for a signed-in user's
 * preferences. Every call is RLS-scoped: Postgres only returns/accepts the row
 * whose id matches auth.uid(), so a user can never read or write another's.
 */

export type ProfileRecord = Preferences & {
  displayName: string | null;
};

const COLUMNS = "display_name, role, region, interests";

type ProfileRow = {
  display_name: string | null;
  role: string | null;
  region: string | null;
  interests: unknown;
};

/** True when a record carries actual personalization (not an empty shell). */
export function hasPreferences(record: ProfileRecord | null): boolean {
  return Boolean(
    record && (record.role || record.region || record.interests.length > 0)
  );
}

/** Read the signed-in user's profile. Returns null if absent or on error. */
export async function fetchProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<ProfileRecord | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(COLUMNS)
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as ProfileRow;
  return {
    displayName: row.display_name,
    // Values are validated by PreferencesProvider.hydrate() before use.
    role: (row.role ?? null) as Preferences["role"],
    region: (row.region ?? null) as Preferences["region"],
    interests: Array.isArray(row.interests)
      ? (row.interests as Preferences["interests"])
      : [],
  };
}

export type DigestSettings = {
  optIn: boolean;
  cadence: string;
};

/**
 * Read the user's digest settings. Independent of preference sync — this touches
 * only the digest columns, so the two never clobber each other.
 */
export async function fetchDigestSettings(
  supabase: SupabaseClient,
  userId: string
): Promise<DigestSettings | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("digest_opt_in, digest_cadence")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as { digest_opt_in: boolean | null; digest_cadence: string | null };
  return {
    optIn: Boolean(row.digest_opt_in),
    cadence: row.digest_cadence ?? "weekly",
  };
}

/**
 * Toggle the weekly digest. Upserts only `digest_opt_in`, leaving preference and
 * other digest columns untouched (Postgres upserts update only supplied columns).
 */
export async function saveDigestOptIn(
  supabase: SupabaseClient,
  userId: string,
  optIn: boolean
): Promise<boolean> {
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: userId, digest_opt_in: optIn }, { onConflict: "id" });

  if (error) {
    console.error("[profiles] digest opt-in save failed", error.message);
    return false;
  }
  return true;
}

/** Upsert the signed-in user's preferences. Returns false on failure. */
export async function saveProfile(
  supabase: SupabaseClient,
  userId: string,
  record: ProfileRecord
): Promise<boolean> {
  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      display_name: record.displayName,
      role: record.role,
      region: record.region,
      interests: record.interests,
    },
    { onConflict: "id" }
  );

  if (error) {
    console.error("[profiles] save failed", error.message);
    return false;
  }
  return true;
}
