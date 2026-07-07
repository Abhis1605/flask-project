"use client";

import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";

import Button from "@/components/ui/Button";
import { useThemeStore } from "@/store/theme.store";
import { useSidebarStore } from "@/store/sidebar.store";
import { useMobile } from "@/hooks/useMobile";
import UserMenu from "./UserMenu";
import { NAV_ITEMS } from "./nav-items";

export default function Navbar() {
  const pathname = usePathname();
  const isMobile = useMobile();
  const theme = useThemeStore((state) => state.theme);
  const setTheme  = useThemeStore((state) => state.setTheme)
  const mobileOpen = useSidebarStore((state) => state.mobileOpen);
  const toggleMobileSidebar = useSidebarStore((state) => state.toggleMobileSidebar);

  const title =
    NAV_ITEMS.find(
      (item) => pathname === item.href || pathname?.startsWith(`${item.href}/`)
    )?.label ?? "Dashboard";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-sm sm:px-6 dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center gap-3">
        {isMobile && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => 
              setTheme
            }
            className="p-2.5!"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            title={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        )}

        <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => 
            setTheme(theme === "dark" ? "light" : "dark")
          }
          className="p-2.5! cursor-pointer"
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
