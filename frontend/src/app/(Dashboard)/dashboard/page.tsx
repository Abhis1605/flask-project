"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";
import { getRoleHome } from "@/config/roles";
import Spinner from "@/components/ui/Spinner";

export default function DashboardRedirectPage() {
  const router = useRouter();
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }
 
    router.replace(getRoleHome(user.role.code));
  }, [isInitialized, isAuthenticated, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Spinner />
    </div>
  );
}
