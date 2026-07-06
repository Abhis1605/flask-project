"use client";

import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";

import Button from "@/components/ui/Button";
import { useThemeStore } from "@/store/theme.store";
import UserMenu from "./UserMenu";
import { NAV_ITEMS } from "./nav-items";

export default function Navbar() {
  const pathname = usePathname();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const title =
    NAV_ITEMS.find(
      (item) => pathname === item.href || pathname?.startsWith(`${item.href}/`)
    )?.label ?? "Dashboard";

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-sm sm:px-6 dark:border-slate-800 dark:bg-slate-900/80">
      <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </h1>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => toggleTheme()}
          className="!p-2.5"
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>

        <UserMenu />
      </div>
    </header>
  );
}
