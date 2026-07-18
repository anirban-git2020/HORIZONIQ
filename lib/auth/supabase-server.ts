import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Server-side Supabase client for user auth in Server Components and Route
 * Handlers. Reads/writes the session via httpOnly cookies (secure — not exposed
 * to page JavaScript). Uses the public anon key; RLS enforces per-user access.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");

  return createServerClient(
    url,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component that can't mutate cookies — the
            // middleware refresh handles token rotation, so this is safe to skip.
          }
        },
      },
    }
  );
}
