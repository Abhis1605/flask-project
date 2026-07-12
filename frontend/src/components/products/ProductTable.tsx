import { useState } from "react";

import { Boxes, Package, Pencil, Trash2 } from "lucide-react";

import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import Tooltip from "@/components/ui/Tooltip";
import { useMobile } from "@/hooks/useMobile";
import type { Product } from "@/types/product";

type ProductAction = "" | "stock" | "edit" | "delete";

function ProductActionsMenu({
  product,
  canUpdate,
  canDelete,
  canUpdateStock,
  onEdit,
  onDelete,
  onUpdateStock,
}: {
  product: Product;
  canUpdate: boolean;
  canDelete: boolean;
  canUpdateStock: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onUpdateStock: (product: Product) => void;
}) {
  const [action, setAction] = useState<ProductAction>("");

  const handleAction = (selectedAction: ProductAction) => {
    switch (selectedAction) {
      case "stock":
        onUpdateStock(product);
        break;
      case "edit":
        onEdit(product);
        break;
      case "delete":
        onDelete(product);
        break;
    }

    setAction("");
  };

  const actionsAvailable = [canUpdateStock, canUpdate, canDelete].filter(Boolean).length;

  const buttonClassName =
    "inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800";

  if (actionsAvailable > 1) {
    return (
      <Select
        value={action}
        onChange={(e) => handleAction(e.target.value as ProductAction)}
        className="w-full min-w-40 text-sm"
        aria-label={`Actions for ${product.name}`}
      >
        <option value="" disabled>
          Actions
        </option>
        {canUpdateStock && <option value="stock">Update stock</option>}
        {canUpdate && <option value="edit">Edit product</option>}
        {canDelete && <option value="delete">Delete product</option>}
      </Select>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {canUpdateStock && (
        <button
          type="button"
          onClick={() => onUpdateStock(product)}
          className={buttonClassName}
        >
          <Boxes className="h-4 w-4" />
          Update stock
        </button>
      )}

      {canUpdate && (
        <button
          type="button"
          onClick={() => onEdit(product)}
          className={buttonClassName}
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>
      )}

      {canDelete && (
        <button
          type="button"
          onClick={() => onDelete(product)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      )}
    </div>
  );
}

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onUpdateStock: (product: Product) => void;
  canUpdate: boolean;
  canDelete: boolean;
  canUpdateStock: boolean;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onUpdateStock,
  canUpdate,
  canDelete,
  canUpdateStock,
}: ProductTableProps) {
  const isMobile = useMobile();

  const hasActions = canUpdate || canDelete || canUpdateStock;

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
        <Package className="h-10 w-10" />
        <p className="text-sm">No products found.</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
          >
            <div className="space-y-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-800 dark:text-slate-100">
                  {product.name}
                </p>

                <div className="mt-1.5">
                  {product.category ? (
                    <Badge>{product.category.name}</Badge>
                  ) : (
                    <span className="text-xs text-slate-400">No category</span>
                  )}
                </div>
              </div>

              <dl className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-sm dark:border-slate-800">
                <div>
                  <dt className="text-xs text-slate-400">Price</dt>
                  <dd className="font-medium text-slate-700 dark:text-slate-200">
                    ₹{product.price.toFixed(2)}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-slate-400">Quantity</dt>
                  <dd className="font-medium text-slate-700 dark:text-slate-200">
                    {product.quantity}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-slate-400">Total</dt>
                  <dd className="font-medium text-slate-700 dark:text-slate-200">
                    ₹{product.total_amount.toFixed(2)}
                  </dd>
                </div>
              </dl>

              {(canUpdate || canDelete || canUpdateStock) && (
                <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
                  <ProductActionsMenu
                    product={product}
                    canUpdate={canUpdate}
                    canDelete={canDelete}
                    canUpdateStock={canUpdateStock}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onUpdateStock={onUpdateStock}
                  />
                </div>
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
            <th className="whitespace-nowrap px-4 py-3 font-medium">Category</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Price</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Quantity</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Total Amount</th>
            {hasActions && (
              <th className="whitespace-nowrap px-4 py-3 font-medium text-right">Actions</th>
            )}
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
                ₹{product.price.toFixed(2)}
              </td>

              <td className="whitespace-nowrap px-4 py-3">{product.quantity}</td>

              <td className="whitespace-nowrap px-4 py-3">
                ₹{product.total_amount.toFixed(2)}
              </td>

              {hasActions && (
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex justify-end">
                    <ProductActionsMenu
                      product={product}
                      canUpdate={canUpdate}
                      canDelete={canDelete}
                      canUpdateStock={canUpdateStock}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onUpdateStock={onUpdateStock}
                    />
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
