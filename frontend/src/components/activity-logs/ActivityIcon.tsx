import {
  Pencil,
  PackageMinus,
  PackagePlus,
  Plus,
  SlidersHorizontal,
  Trash2,
  UserCog,
} from "lucide-react";
import clsx from "clsx";

import type { ActivityAction } from "@/types/activity-log";

const ICONS: Record<ActivityAction, typeof Plus> = {
  CREATE: Plus,
  UPDATE: Pencil,
  DELETE: Trash2,
  CHANGE_ROLE: UserCog,
  STOCK_IN: PackagePlus,
  STOCK_OUT: PackageMinus,
  ADJUSTMENT: SlidersHorizontal,
};

const COLORS: Record<ActivityAction, { bg: string; icon: string }> = {
  CREATE: {
    bg: "bg-emerald-100 dark:bg-emerald-500/10",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  UPDATE: {
    bg: "bg-amber-100 dark:bg-amber-500/10",
    icon: "text-amber-600 dark:text-amber-400",
  },
  DELETE: {
    bg: "bg-red-100 dark:bg-red-500/10",
    icon: "text-red-600 dark:text-red-400",
  },
  CHANGE_ROLE: {
    bg: "bg-violet-100 dark:bg-violet-500/10",
    icon: "text-violet-600 dark:text-violet-400",
  },
  STOCK_IN: {
    bg: "bg-emerald-100 dark:bg-emerald-500/10",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  STOCK_OUT: {
    bg: "bg-red-100 dark:bg-red-500/10",
    icon: "text-red-600 dark:text-red-400",
  },
  ADJUSTMENT: {
    bg: "bg-amber-100 dark:bg-amber-500/10",
    icon: "text-amber-600 dark:text-amber-400",
  },
};

export default function ActivityIcon({ action }: { action: ActivityAction }) {
  const Icon = ICONS[action];
  const colors = COLORS[action];

  return (
    <span
      className={clsx(
        "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
        colors.bg
      )}
    >
      <Icon className={clsx("h-4 w-4", colors.icon)} />
    </span>
  );
}
