"use client";

import Link from "next/link";

import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";

/**
 * Top-bar auth entry point. Signed out → a quiet "Sign in" link; signed in → an
 * avatar chip. Both route to /account. Renders a fixed-size placeholder while the
 * session resolves, so there's no layout shift or hydration mismatch.
 */
export function AccountMenu({ className }: { className?: string }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <span aria-hidden className={cn("inline-block h-9 w-9", className)} />;
  }

  if (user) {
    const label = user.email ?? "Account";
    const initial = label.charAt(0).toUpperCase();
    return (
      <Link
        href="/account"
        aria-label={`Account: ${label}`}
        title={label}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-secondary/40 text-sm font-medium text-foreground transition-colors hover:bg-secondary",
          className
        )}
      >
        {initial}
      </Link>
    );
  }

  return (
    <Link
      href="/account"
      className={cn(
        "px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
        className
      )}
    >
      Sign in
    </Link>
  );
}
