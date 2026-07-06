import { forwardRef, InputHTMLAttributes } from "react";
import clsx from "clsx";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          "w-full rounded-lg border bg-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-slate-300 text-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-600",

          error
            ? "border-red-500 focus:border-red-500"
            : "border-slate-300 focus:border-slate-900 dark:border-slate-700 dark:focus:border-indigo-500",

          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;