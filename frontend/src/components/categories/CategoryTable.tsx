import { Pencil, Tags, Trash2 } from "lucide-react";

import type { Category } from "@/types/category";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export default function CategoryTable({
  categories,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
        <Tags className="h-10 w-10" />
        <p className="text-sm">No categories found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <th className="whitespace-nowrap px-4 py-3 font-medium">Name</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {categories.map((category) => (
            <tr key={category.id} className="text-slate-700 dark:text-slate-200">
              <td className="whitespace-nowrap px-4 py-3 font-medium">
                {category.name}
              </td>

              <td className="whitespace-nowrap px-4 py-3">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(category)}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(category)}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
