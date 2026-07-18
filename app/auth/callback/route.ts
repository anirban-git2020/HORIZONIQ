import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/auth/supabase-server";

export const runtime = "nodejs";

/**
 * Completes sign-in. Google OAuth returns a `code`; email magic links return a
 * `token_hash` + `type`. Either way we establish the session cookie, then
 * redirect to the app. On failure we bounce to /account with an error flag.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next") ?? "/account";
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // The provider (Google/Supabase) can hand back its own error on the URL.
  const providerError =
    searchParams.get("error_description") ?? searchParams.get("error");

  const fail = (message: string) =>
    NextResponse.redirect(`${origin}/account?error=${encodeURIComponent(message)}`);

  if (providerError) return fail(providerError);

  const supabase = await createSupabaseServerClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
    return fail(error.message);
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
    return fail(error.message);
  }

  return fail("No authorization code returned from the provider.");
}
