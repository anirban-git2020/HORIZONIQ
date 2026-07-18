import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/** True when the public auth env vars are present. */
export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Browser-side Supabase client for user auth. Uses the public anon key — safe to
 * ship to the client, because Row Level Security is what actually protects data.
 * The service-role key is never used here.
 *
 * Returns `null` when the auth env vars are absent, so a misconfigured
 * environment degrades to "sign-in unavailable" instead of crashing the app.
 */
export function createSupabaseBrowserClient(): SupabaseClient | null {
  if (!isAuthConfigured()) return null;
  // Trim any trailing slash — a stray "/" makes the request path invalid.
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");
  return createBrowserClient(
    url,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
}
