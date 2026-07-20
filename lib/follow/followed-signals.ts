import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Followed-signals persistence — server-backed, cross-device, RLS-scoped.
 * Every call runs as the signed-in user; Postgres only returns/accepts that
 * user's own rows, so a user can never read or change another's follows.
 */

export type FollowRecord = {
  signalId: string;
  followedAt: string;
  momentumAtFollow: number;
};

type Row = {
  signal_id: string;
  followed_at: string;
  momentum_at_follow: number;
};

/** All signals the user follows. Returns [] on error (never throws). */
export async function fetchFollowed(
  supabase: SupabaseClient,
  userId: string
): Promise<FollowRecord[]> {
  const { data, error } = await supabase
    .from("followed_signals")
    .select("signal_id, followed_at, momentum_at_follow")
    .eq("user_id", userId);

  if (error || !data) return [];
  return (data as Row[]).map((r) => ({
    signalId: r.signal_id,
    followedAt: r.followed_at,
    momentumAtFollow: r.momentum_at_follow,
  }));
}

/**
 * Follow a signal, capturing its current momentum as the baseline. Idempotent:
 * re-following an already-followed signal keeps the original baseline/date.
 */
export async function addFollow(
  supabase: SupabaseClient,
  userId: string,
  signalId: string,
  momentum: number
): Promise<boolean> {
  const { error } = await supabase.from("followed_signals").upsert(
    {
      user_id: userId,
      signal_id: signalId,
      momentum_at_follow: Math.round(momentum),
    },
    { onConflict: "user_id,signal_id", ignoreDuplicates: true }
  );

  if (error) {
    console.error("[follow] add failed", error.message);
    return false;
  }
  return true;
}

export async function removeFollow(
  supabase: SupabaseClient,
  userId: string,
  signalId: string
): Promise<boolean> {
  const { error } = await supabase
    .from("followed_signals")
    .delete()
    .eq("user_id", userId)
    .eq("signal_id", signalId);

  if (error) {
    console.error("[follow] remove failed", error.message);
    return false;
  }
  return true;
}
