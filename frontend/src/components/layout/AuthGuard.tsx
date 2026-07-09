"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";
import Spinner from "@/components/ui/Spinner";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isLoggingOut = useAuthStore((state) => state.isLoggingOut);

  useEffect(() => {
    // The edge proxy already redirects requests with no session cookie at
    // all, so reaching this point with isAuthenticated=false means a
    // session existed but the refresh+/auth/me bootstrap in AuthProvider
    // failed - i.e. the session expired, not "never logged in". An
    // explicit logout also flips isAuthenticated to false while we're
    // still on this page, but that's not an expiry - useLogout already
    // owns navigating to a plain /login, so skip ours here.
    if (isInitialized && !isAuthenticated && !isLoggingOut) {
      const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}&reason=session_expired`;
      router.replace(loginUrl);
    }
  }, [isAuthenticated, isInitialized, isLoggingOut, pathname, router]);

  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
