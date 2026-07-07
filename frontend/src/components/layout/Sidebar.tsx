"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, ChevronLeft, ChevronRight, LogOut, X } from "lucide-react";
import clsx from "clsx";

import Tooltip from "@/components/ui/Tooltip";
import { useSidebarStore } from "@/store/sidebar.store";
import { useLogout } from "@/hooks/useAuth";
import { useMobile } from "@/hooks/useMobile";
import { NAV_ITEMS } from "./nav-items";

export default function Sidebar() {
  const pathname = usePathname();
  const isMobile = useMobile();

  const collapsed = useSidebarStore((state) => state.collapsed);
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const mobileOpen = useSidebarStore((state) => state.mobileOpen);
  const closeMobileSidebar = useSidebarStore((state) => state.closeMobileSidebar);

  const logout = useLogout();

  const isCollapsed = !isMobile && collapsed;

  useEffect(() => {
    if (!isMobile) return;

    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, mobileOpen]);

  const handleNavClick = () => {
    if (isMobile) closeMobileSidebar();
  };

  return (
    <>
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={clsx(
          "flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
          isMobile
            ? clsx(
                "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300",
                mobileOpen ? "translate-x-0" : "-translate-x-full"
              )
            : clsx(
                "sticky top-0 transition-[width] duration-300",
                collapsed ? "w-18" : "w-64"
              )
        )}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-slate-200 px-4 dark:border-slate-800">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Boxes className="h-5 w-5" />
            </div>

            {!isCollapsed && (
              <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                Inventory
              </span>
            )}
          </div>

          {isMobile && (
            <button
              type="button"
              onClick={closeMobileSidebar}
              aria-label="Close menu"
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);

            const Icon = item.icon;

            const link = (
              <Link
                href={item.href}
                onClick={handleNavClick}
                className={clsx(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isCollapsed && "justify-center",
                  active
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />

                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );

            return isCollapsed ? (
              <Tooltip key={item.href} label={item.label} side="right">
                {link}
              </Tooltip>
            ) : (
              <div key={item.href}>{link}</div>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-slate-200 px-3 py-4 dark:border-slate-800">
          {!isMobile && (
            <button
              type="button"
              onClick={() => toggleSidebar()}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={clsx(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                collapsed && "justify-center"
              )}
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5 shrink-0" />
              ) : (
                <>
                  <ChevronLeft className="h-5 w-5 shrink-0" />
                  <span>Collapse</span>
                </>
              )}
            </button>
          )}

          {isCollapsed ? (
            <Tooltip label="Logout" side="right">
              <button
                type="button"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                aria-label="Logout"
                className="flex w-full items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                <LogOut className="h-5 w-5 shrink-0" />
              </button>
            </Tooltip>
          ) : (
            <button
              type="button"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
