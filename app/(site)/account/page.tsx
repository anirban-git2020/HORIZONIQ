"use client";

import { useEffect, useState } from "react";

import { DigestSettings } from "@/components/account/digest-settings";
import { useAuth } from "@/components/auth/auth-provider";
import { SignInPanel } from "@/components/auth/sign-in-panel";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    setAuthError(new URLSearchParams(window.location.search).get("error"));
  }, []);

  return (
    <div className="container mx-auto max-w-md px-4 py-16 md:py-24">
      <h1 className="section-title text-2xl">Account</h1>

      {loading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
      ) : user ? (
        <div className="mt-6 space-y-5">
          <div className="rounded-xl border border-border/70 bg-secondary/20 p-5">
            <p className="label-caps text-muted-foreground">Signed in as</p>
            <p className="mt-1 break-all text-base font-medium text-foreground">
              {user.email}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Your role, region, and interests sync across every device you sign
              in on.
            </p>
          </div>

          <DigestSettings />

          <Button type="button" variant="secondary" onClick={() => signOut()}>
            Sign out
          </Button>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {authError && (
            <p
              role="alert"
              className="rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-warning"
            >
              Sign-in failed: {authError}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Sign in to sync your preferences across devices. It&apos;s optional —
            HorizonIQ works fully without an account.
          </p>
          <SignInPanel />
        </div>
      )}
    </div>
  );
}
