import { LabelHTMLAttributes } from "react";
import clsx from "clsx";

interface LabelProps
  extends LabelHTMLAttributes<HTMLLabelElement> {}

export default function Label({
  className,
  children,
  ...props
}: LabelProps) {
  return (
    <label
      className={clsx(
        "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}