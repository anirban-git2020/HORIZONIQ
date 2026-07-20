"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useAuth } from "@/components/auth/auth-provider";
import {
  addFollow,
  fetchFollowed,
  removeFollow,
  type FollowRecord,
} from "@/lib/follow/followed-signals";

type FollowedContextValue = {
  /** signalId → follow record, for O(1) lookups and the panel. */
  followed: ReadonlyMap<string, FollowRecord>;
  isFollowing: (signalId: string) => boolean;
  follow: (signalId: string, momentum: number) => Promise<void>;
  unfollow: (signalId: string) => Promise<void>;
  loading: boolean;
  signedIn: boolean;
};

const FollowedContext = createContext<FollowedContextValue | null>(null);

/**
 * Single source of truth for the signed-in user's followed signals. One fetch,
 * shared by the Follow button and the "You're following" panel so they never
 * disagree. Optimistic writes with rollback. Signed-out users hold an empty set.
 */
export function FollowedSignalsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { supabase, user, loading: authLoading } = useAuth();
  const [followed, setFollowed] = useState<Map<string, FollowRecord>>(
    () => new Map()
  );
  const [loading, setLoading] = useState(true);
  const loadedFor = useRef<string | null>(null);

  const signedIn = Boolean(user);

  useEffect(() => {
    if (authLoading) return;
    if (!supabase || !user) {
      setFollowed(new Map());
      setLoading(false);
      loadedFor.current = null;
      return;
    }
    if (loadedFor.current === user.id) return;
    loadedFor.current = user.id;

    let active = true;
    setLoading(true);
    void fetchFollowed(supabase, user.id).then((rows) => {
      if (!active) return;
      setFollowed(new Map(rows.map((r) => [r.signalId, r])));
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [supabase, user, authLoading]);

  const follow = useCallback(
    async (signalId: string, momentum: number) => {
      if (!supabase || !user) return;
      const record: FollowRecord = {
        signalId,
        followedAt: new Date().toISOString(),
        momentumAtFollow: Math.round(momentum),
      };
      setFollowed((prev) => new Map(prev).set(signalId, record)); // optimistic
      const ok = await addFollow(supabase, user.id, signalId, momentum);
      if (!ok) {
        setFollowed((prev) => {
          const next = new Map(prev);
          next.delete(signalId);
          return next;
        });
      }
    },
    [supabase, user]
  );

  const unfollow = useCallback(
    async (signalId: string) => {
      if (!supabase || !user) return;
      const previous = followed.get(signalId);
      setFollowed((prev) => {
        const next = new Map(prev);
        next.delete(signalId);
        return next;
      });
      const ok = await removeFollow(supabase, user.id, signalId);
      if (!ok && previous) {
        setFollowed((prev) => new Map(prev).set(signalId, previous)); // rollback
      }
    },
    [supabase, user, followed]
  );

  const value = useMemo<FollowedContextValue>(
    () => ({
      followed,
      isFollowing: (id) => followed.has(id),
      follow,
      unfollow,
      loading,
      signedIn,
    }),
    [followed, follow, unfollow, loading, signedIn]
  );

  return (
    <FollowedContext.Provider value={value}>
      {children}
    </FollowedContext.Provider>
  );
}

export function useFollowedSignals(): FollowedContextValue {
  const ctx = useContext(FollowedContext);
  if (!ctx) {
    throw new Error(
      "useFollowedSignals must be used within a FollowedSignalsProvider"
    );
  }
  return ctx;
}
