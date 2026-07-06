import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
  loading?: boolean;
}

export default function Button({
  variant = "primary",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60",

        {
          "bg-slate-900 text-white hover:bg-slate-800":
            variant === "primary",

          "bg-slate-100 text-slate-900 hover:bg-slate-200":
            variant === "secondary",

          "bg-red-600 text-white hover:bg-red-700":
            variant === "danger",

          "border border-slate-300 bg-white hover:bg-slate-100":
            variant === "outline",
        },

        className
      )}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}