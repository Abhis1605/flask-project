import clsx from "clsx";

interface AvatarProps {
  name: string;
  className?: string;
}

export default function Avatar({ name, className }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      className={clsx(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white",
        className
      )}
    >
      {initial}
    </div>
  );
}
