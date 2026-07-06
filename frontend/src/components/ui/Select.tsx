import { forwardRef, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={clsx(
            "w-full appearance-none rounded-lg border bg-white px-4 py-2.5 pr-9 text-sm outline-none transition-all text-slate-700 dark:bg-slate-900 dark:text-slate-200",

            error
              ? "border-red-500 focus:border-red-500"
              : "border-slate-300 focus:border-slate-900 dark:border-slate-700 dark:focus:border-indigo-500",

            className
          )}
          {...props}
        >
          {children}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
