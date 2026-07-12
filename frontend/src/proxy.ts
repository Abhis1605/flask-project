import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Edge-level gate: redirects when there's no sign the user has an active
// session, so a signed-out user never even gets the protected page's
// HTML/JS. It cannot validate the token's signature/expiry (that secret
// lives only on the Flask backend) - real validation still happens
// client-side via AuthProvider refreshing and then calling /auth/me, and on
// every API call via the backend's @jwt_required checks.

// We check `csrf_refresh_token` rather than the actual `refresh_token`:
// the refresh token cookie is intentionally scoped to Path=/api/v1/auth
// (so the browser never sends it to random backend endpoints), which
// also means it's invisible to requests hitting the Next.js server on
// :3000. The CSRF cookie is deliberately Path=/ and non-secret (it's a
// public double-submit token, not a credential), so its presence is a
// safe, path-independent proxy for "a refresh token was issued".
const SESSION_HINT_COOKIE_NAME = "csrf_refresh_token";

// `csrf_refresh_token` shares the refresh token's short lifetime, so the
// browser deletes it the instant the refresh token expires - by itself it
// can't tell "session just expired" apart from "never logged in". This
// marker cookie is set at login with a much longer lifetime and only
// cleared on explicit logout, so its presence after the hint above is
// gone means the session existed and expired, not that the user is new.
const HAD_SESSION_COOKIE_NAME = "had_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasSessionHint = Boolean(
    request.cookies.get(SESSION_HINT_COOKIE_NAME)?.value
  );

  if (!hasSessionHint) {
    const hadSession = Boolean(
      request.cookies.get(HAD_SESSION_COOKIE_NAME)?.value
    );

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    loginUrl.searchParams.set(
      "reason",
      hadSession ? "session_expired" : "login_required"
    );

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/inventory-manager/:path*",
    "/employee/:path*",
  ],
};
