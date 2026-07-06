"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import clsx from "clsx";

import Avatar from "@/components/ui/Avatar";
import { useAuthStore } from "@/store/auth.store";
import { useLogout } from "@/hooks/useAuth";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <Avatar name={user.full_name} />

        <div className="hidden text-left sm:block">
          <p className="text-sm font-semibold leading-tight text-slate-800 dark:text-slate-100">
            {user.full_name}
          </p>
          <p className="text-xs leading-tight text-slate-400">{user.email}</p>
        </div>

        <ChevronDown
          className={clsx(
            "h-4 w-4 text-slate-400 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
              {user.full_name}
            </p>
            <p className="truncate text-xs text-slate-400">{user.email}</p>
          </div>

          <button
            type="button"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
