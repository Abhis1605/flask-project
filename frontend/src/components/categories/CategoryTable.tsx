import { Pencil, Tags, Trash2 } from "lucide-react";

import Tooltip from "@/components/ui/Tooltip";
import { useMobile } from "@/hooks/useMobile";
import type { Category } from "@/types/category";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  canUpdate: boolean;
  canDelete: boolean;
}

export default function CategoryTable({
  categories,
  onEdit,
  onDelete,
  canUpdate,
  canDelete,
}: CategoryTableProps) {
  const isMobile = useMobile();

  const hasActions = canUpdate || canDelete;

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
        <Tags className="h-10 w-10" />
        <p className="text-sm">No categories found.</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800"
          >
            <p className="truncate font-medium text-slate-800 dark:text-slate-100">
              {category.name}
            </p>

            <div className="flex shrink-0 gap-1">
              {canUpdate && (
                <Tooltip label="Edit">
                  <button
                    type="button"
                    onClick={() => onEdit(category)}
                    aria-label="Edit category"
                    className="rounded-lg p-2 cursor-pointer text-slate-400 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </Tooltip>
              )}

              {canDelete && (
                <Tooltip label="Delete">
                  <button
                    type="button"
                    onClick={() => onDelete(category)}
                    aria-label="Delete category"
                    className="rounded-lg p-2 cursor-pointer text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </Tooltip>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <th className="whitespace-nowrap px-4 py-3 font-medium">Name</th>
            {hasActions && (
              <th className="whitespace-nowrap px-4 py-3 font-medium text-right">
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {categories.map((category) => (
            <tr key={category.id} className="text-slate-700 dark:text-slate-200">
              <td className="whitespace-nowrap px-4 py-3 font-medium">
                {category.name}
              </td>

              {hasActions && (
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex justify-end gap-1">
                    {canUpdate && (
                      <Tooltip label="Edit">
                        <button
                          type="button"
                          onClick={() => onEdit(category)}
                          aria-label="Edit category"
                          className="rounded-lg p-2 cursor-pointer text-slate-400 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </Tooltip>
                    )}

                    {canDelete && (
                      <Tooltip label="Delete">
                        <button
                          type="button"
                          onClick={() => onDelete(category)}
                          aria-label="Delete category"
                          className="rounded-lg p-2 cursor-pointer text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </Tooltip>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
