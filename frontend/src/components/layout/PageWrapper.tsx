import { ReactNode } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface PageWrapperProps {
  children: ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <Navbar />

        <main className="flex-1 p-4 sm:p-6">{children}</main>

        <Footer />
      </div>
    </div>
  );
}
