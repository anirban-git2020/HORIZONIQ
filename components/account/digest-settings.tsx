"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { fetchDigestSettings, saveDigestOptIn } from "@/lib/auth/profiles";
import { cn } from "@/lib/utils";

/**
 * Weekly digest opt-in. A signed-in user turns the "Since your last visit" email
 * on or off. Optimistic toggle with rollback on failure; no cadence control
 * while weekly is the only option.
 */
export function DigestSettings({ className }: { className?: string }) {
  const { supabase, user } = useAuth();
  const [optIn, setOptIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busyId = useRef(0);

  useEffect(() => {
    if (!supabase || !user) return;
    let active = true;
    void fetchDigestSettings(supabase, user.id).then((settings) => {
      if (!active) return;
      if (settings) setOptIn(settings.optIn);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [supabase, user]);

  const toggle = async () => {
    if (!supabase || !user || saving) return;
    const next = !optIn;
    const ticket = ++busyId.current;
    setOptIn(next); // optimistic
    setSaving(true);
    setError(null);

    const ok = await saveDigestOptIn(supabase, user.id, next);
    if (busyId.current !== ticket) return; // superseded by a newer toggle
    if (!ok) {
      setOptIn(!next); // rollback
      setError("Couldn't save that. Please try again.");
    }
    setSaving(false);
  };

  if (!user) return null;

  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-secondary/20 p-5",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-caps text-muted-foreground">Weekly digest</p>
          <p className="mt-1 text-sm text-muted-foreground">
            A short email when your fields move — what changed since you were last
            here. No email if nothing moved.
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={optIn}
          aria-label="Weekly digest email"
          disabled={loading || saving}
          onClick={toggle}
          className={cn(
            "relative mt-1 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50",
            optIn ? "bg-primary" : "bg-border"
          )}
        >
          <span
            className={cn(
              "inline-block h-5 w-5 transform rounded-full bg-background shadow transition-transform",
              optIn ? "translate-x-5" : "translate-x-0.5"
            )}
          />
        </button>
      </div>

      {saving ? (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          Saving…
        </p>
      ) : error ? (
        <p className="mt-3 text-xs text-warning" role="alert">
          {error}
        </p>
      ) : optIn ? (
        <p className="mt-3 border-t border-border/40 pt-3 text-xs leading-relaxed text-muted-foreground">
          You&apos;re subscribed. Digests go out{" "}
          <span className="text-foreground">Monday mornings</span> — your first
          one lands the next Monday your fields have moved. Quiet weeks stay quiet.
        </p>
      ) : null}
    </div>
  );
}
