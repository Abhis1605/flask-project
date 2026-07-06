import { ReactNode } from "react";

import AuthGuard from "@/components/layout/AuthGuard";
import PageWrapper from "@/components/layout/PageWrapper";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthGuard>
      <PageWrapper>{children}</PageWrapper>
    </AuthGuard>
  );
}
