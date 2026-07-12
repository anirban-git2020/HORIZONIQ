import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Onboarding phase-routing retired (Sprint: Landing Experience Restoration).
 *
 * The Landing Experience now owns the onboarding flow client-side via
 * sessionStorage (see hooks/use-landing-journey.ts), so server-side cookie
 * redirects are no longer used. Middleware is a pass-through.
 *
 * The legacy /onboarding/* pages and lib/onboarding-phase remain in the repo
 * but are no longer reachable through routing; a dedicated cleanup sprint will
 * remove them.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
