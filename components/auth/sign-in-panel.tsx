"use client";

import { useId, useState } from "react";
import { Loader2, Mail } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { isAuthConfigured } from "@/lib/auth/supabase-browser";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Passwordless sign-in: email magic link + Google. Signing in is optional — it
 * turns on cross-device sync. Redirects route back through /auth/callback.
 */
type SignInPanelProps = {
  className?: string;
  /** Where to land after auth. Defaults to /account; the landing passes "/". */
  nextPath?: string;
};

export function SignInPanel({ className, nextPath }: SignInPanelProps) {
  const { supabase } = useAuth();
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback${
          nextPath ? `?next=${encodeURIComponent(nextPath)}` : ""
        }`
      : undefined;

  const configured = isAuthConfigured();

  const sendMagicLink = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setError(null);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { emailRedirectTo: redirectTo },
    });
    if (otpError) {
      setError(otpError.message);
      setStatus("error");
      return;
    }
    setStatus("sent");
  };

  const signInWithGoogle = async () => {
    if (!supabase) return;
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (oauthError) {
      setError(oauthError.message);
      setStatus("error");
    }
  };

  if (!configured || !supabase) {
    return (
      <div className={cn("rounded-xl border border-border/70 bg-secondary/20 p-5", className)}>
        <p className="text-sm text-muted-foreground">
          Sign-in isn&apos;t configured yet.
        </p>
      </div>
    );
  }

  if (status === "sent") {
    return (
      <div className={cn("rounded-xl border border-border/70 bg-secondary/20 p-6", className)}>
        <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
        <h3 className="mt-3 text-base font-semibold text-foreground">Check your inbox</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          We sent a sign-in link to <span className="text-foreground">{email.trim()}</span>.
          Open it on any device to sign in.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-5", className)}>
      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={signInWithGoogle}
      >
        <GoogleGlyph />
        Continue with Google
      </Button>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border/60" />
        or
        <span className="h-px flex-1 bg-border/60" />
      </div>

      <form className="space-y-3" onSubmit={sendMagicLink}>
        <label htmlFor={emailId} className="label-caps text-muted-foreground">
          Email
        </label>
        <input
          id={emailId}
          type="email"
          autoComplete="email"
          value={email}
          disabled={status === "sending"}
          placeholder="you@example.com"
          className="h-11 w-full rounded-lg border border-border/80 bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === "error") setError(null);
          }}
        />

        {error && (
          <p role="alert" className="text-sm text-warning">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={status === "sending"}>
          {status === "sending" ? (
            <>
              <Loader2 className="animate-spin" />
              Sending…
            </>
          ) : (
            "Email me a sign-in link"
          )}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground">
        No password needed. Signing in syncs your role, region, and interests
        across your devices.
      </p>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.82-.07-1.6-.2-2.36H12v4.47h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.74Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56v-3.1H1.29a12 12 0 0 0 0 10.76l3.98-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.29 6.62l3.98 3.1C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}
