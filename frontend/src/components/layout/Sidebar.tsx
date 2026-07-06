"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import clsx from "clsx";

import { useSidebarStore } from "@/store/sidebar.store";
import { useLogout } from "@/hooks/useAuth";
import { NAV_ITEMS } from "./nav-items";

export default function Sidebar() {
  const pathname = usePathname();
  const collapsed = useSidebarStore((state) => state.collapsed);
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const logout = useLogout();

  return (
    <aside
      className={clsx(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-300 dark:border-slate-800 dark:bg-slate-900",
        collapsed ? "w-18" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between gap-2 border-b border-slate-200 px-4 dark:border-slate-800">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Boxes className="h-5 w-5" />
          </div>

          {!collapsed && (
            <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
              Inventory
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                collapsed && "justify-center",
                active
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />

              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-slate-200 px-3 py-4 dark:border-slate-800">
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

        <button
          type="button"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          title={collapsed ? "Logout" : undefined}
          className={clsx(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-500/10",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />

          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
