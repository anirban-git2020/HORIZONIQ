"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Shown when the dashboard has no focus set — instead of silently rendering the
 * full catalog as if it were personalized, it says so and offers one tap to fix
 * it. Non-blocking (anonymous browsing continues below); dismissible. Adapts to
 * auth state: a signed-out user is invited to sign in and restore their saved
 * focus; a signed-in user (rare, empty profile) is sent to set one up.
 */
export function FocusPrompt({ className }: { className?: string }) {
  const { user, loading } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const signedIn = !loading && Boolean(user);

  return (
    <section
      aria-label="Personalize your intelligence"
      className={cn(
        "relative rounded-2xl border border-primary/20 bg-card/60 p-6 backdrop-blur-md md:p-7",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X className="h-4 w-4" />
      </button>

      <p className="label-caps text-primary">Every field</p>
      <p className="mt-2 max-w-xl text-lg text-foreground/90 md:text-xl">
        You&apos;re seeing the full front page. Load your focus and we&apos;ll
        show only your fields.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        {!signedIn && (
          <Link href="/account" className={cn(buttonVariants({ size: "sm" }))}>
            Sign in to restore
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: signedIn ? "primary" : "secondary", size: "sm" })
          )}
        >
          Set your focus
        </Link>
      </div>
    </section>
  );
}
