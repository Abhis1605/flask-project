import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
}

export default function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
        <Icon className="h-6 w-6" />
      </div>

      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-0.5 text-2xl font-semibold text-slate-800 dark:text-slate-100">
          {value}
        </p>
      </div>
    </div>
  );
}
