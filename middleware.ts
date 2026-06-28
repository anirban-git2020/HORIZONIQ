import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  getPathForPhase,
  isPathAllowedForPhase,
  ONBOARDING_COOKIE_NAME,
  parsePhaseCookie,
} from "@/lib/onboarding-phase";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const phase = parsePhaseCookie(
    request.cookies.get(ONBOARDING_COOKIE_NAME)?.value
  );

  if (isPathAllowedForPhase(pathname, phase)) {
    return NextResponse.next();
  }

  const target = getPathForPhase(phase);
  return NextResponse.redirect(new URL(target, request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
