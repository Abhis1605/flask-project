import { HTMLAttributes } from "react";
import clsx from "clsx";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger";
}

export default function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",

        {
          "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300":
            variant === "default",

          "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400":
            variant === "success",

          "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400":
            variant === "warning",

          "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400":
            variant === "danger",
        },

        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
