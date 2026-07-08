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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasSessionHint = Boolean(
    request.cookies.get(SESSION_HINT_COOKIE_NAME)?.value
  );

  if (!hasSessionHint) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/products/:path*", "/categories/:path*"],
};
