"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useCurrentUser } from "@/hooks/useAuth";
import Spinner from "@/components/ui/Spinner";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isLoading, isError } = useCurrentUser();

  useEffect(() => {
    if (isError) router.replace("/login");
  }, [isError, router]);

  if (isLoading || isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
