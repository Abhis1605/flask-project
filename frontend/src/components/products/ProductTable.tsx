import { Package, Pencil, Trash2 } from "lucide-react";

import Badge from "@/components/ui/Badge";
import type { Product } from "@/types/product";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
        <Package className="h-10 w-10" />
        <p className="text-sm">No products found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <th className="whitespace-nowrap px-4 py-3 font-medium">Name</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Category</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Price</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Quantity</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Total Amount</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {products.map((product) => (
            <tr key={product.id} className="text-slate-700 dark:text-slate-200">
              <td className="whitespace-nowrap px-4 py-3 font-medium">
                {product.name}
              </td>

              <td className="whitespace-nowrap px-4 py-3">
                {product.category ? (
                  <Badge>{product.category.name}</Badge>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>

              <td className="whitespace-nowrap px-4 py-3">
                ${product.price.toFixed(2)}
              </td>

              <td className="whitespace-nowrap px-4 py-3">{product.quantity}</td>

              <td className="whitespace-nowrap px-4 py-3">
                ${product.total_amount.toFixed(2)}
              </td>

              <td className="whitespace-nowrap px-4 py-3">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(product)}
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
