import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

interface PaginationProps {
  page: number;
  pages: number;
  total: number;
  perPage: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  pages,
  total,
  perPage,
  hasPrev,
  hasNext,
  onPageChange,
}: PaginationProps) {
  if (total === 0) return null;

  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm text-slate-500 sm:flex-row dark:border-slate-800 dark:text-slate-400">
      <p>
        Showing <span className="font-medium text-slate-700 dark:text-slate-200">{start}</span>–
        <span className="font-medium text-slate-700 dark:text-slate-200">{end}</span> of{" "}
        <span className="font-medium text-slate-700 dark:text-slate-200">{total}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          className={clsx(
            "flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 transition-colors dark:border-slate-700",
            hasPrev
              ? "hover:bg-slate-100 dark:hover:bg-slate-800"
              : "cursor-not-allowed opacity-40"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="min-w-20 text-center">
          Page {page} of {Math.max(pages, 1)}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          className={clsx(
            "flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 transition-colors dark:border-slate-700",
            hasNext
              ? "hover:bg-slate-100 dark:hover:bg-slate-800"
              : "cursor-not-allowed opacity-40"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
