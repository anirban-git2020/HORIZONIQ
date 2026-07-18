import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/auth/middleware-session";

/**
 * Refreshes the Supabase auth session (rotating cookies) on each request.
 *
 * Onboarding phase-routing was retired (Landing Experience owns it client-side);
 * middleware now exists solely to keep the auth session fresh. No-op when auth
 * env vars are absent.
 */
export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * All paths except static assets and image optimization files. Auth cookies
     * must ride along with page/data requests, so the matcher stays broad.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
