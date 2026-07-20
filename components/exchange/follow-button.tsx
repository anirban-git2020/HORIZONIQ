"use client";

import Link from "next/link";
import { Check, Plus } from "lucide-react";

import { useFollowedSignals } from "@/components/exchange/followed-signals-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FollowButtonProps = {
  signalId: string;
  /** Current momentum, captured as the baseline when the user follows. */
  momentum: number;
  className?: string;
};

/**
 * Follow / Following toggle for a signal's brief. Following requires an account
 * (follows sync across devices), so a signed-out user is invited to sign in
 * rather than shown a control that can't persist.
 */
export function FollowButton({ signalId, momentum, className }: FollowButtonProps) {
  const { isFollowing, follow, unfollow, signedIn, loading } =
    useFollowedSignals();

  if (!signedIn) {
    return (
      <Link
        href="/account"
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-lg border border-border/70 px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground",
          className
        )}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Sign in to follow
      </Link>
    );
  }

  const following = isFollowing(signalId);

  return (
    <Button
      type="button"
      variant={following ? "secondary" : "primary"}
      size="sm"
      disabled={loading}
      aria-pressed={following}
      onClick={() => (following ? unfollow(signalId) : follow(signalId, momentum))}
      className={cn("group", className)}
    >
      {following ? (
        <>
          <Check className="h-4 w-4" aria-hidden="true" />
          Following
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Follow this signal
        </>
      )}
    </Button>
  );
}
