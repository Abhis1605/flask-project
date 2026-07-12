import { ReactNode } from "react";

import AuthGuard from "@/components/layout/AuthGuard";
import RoleGuard from "@/components/layout/RoleGuard";
import PageWrapper from "@/components/layout/PageWrapper";

export default function EmployeeLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <RoleGuard allow={["EMPLOYEE"]}>
        <PageWrapper>{children}</PageWrapper>
      </RoleGuard>
    </AuthGuard>
  );
}
