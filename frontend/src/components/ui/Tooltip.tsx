import { ReactNode } from "react";
import clsx from "clsx";

interface TooltipProps {
  label: string;
  children: ReactNode;
  side?: "right" | "top";
}

export default function Tooltip({ label, children, side = "top" }: TooltipProps) {
  return (
    <div className="group/tooltip relative flex">
      {children}

      <span
        role="tooltip"
        className={clsx(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/tooltip:opacity-100 dark:bg-slate-700",
          side === "right" && "left-full top-1/2 ml-2 -translate-y-1/2",
          side === "top" && "bottom-full left-1/2 mb-2 -translate-x-1/2"
        )}
      >
        {label}
      </span>
    </div>
  );
}
