"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";
import { getCanonicalRoleCode, getRoleHome } from "@/config/roles";
import Spinner from "@/components/ui/Spinner";

interface RoleGuardProps {
  allow: string[];
  children: ReactNode;
}

export default function RoleGuard({ allow, children }: RoleGuardProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const roleCode = user?.role.code;
  const canonicalRoleCode = getCanonicalRoleCode(roleCode);
  const canonicalAllowList = allow.map((role) => getCanonicalRoleCode(role)).filter((role): role is string => Boolean(role));
  const allowed = Boolean(canonicalRoleCode && canonicalAllowList.includes(canonicalRoleCode));

  useEffect(() => {
    if (!allowed && roleCode) {
      router.replace(getRoleHome(roleCode));
    }
  }, [allowed, roleCode, router]);

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
