"use client";

import Select from "@/components/ui/Select";
import { useProducts } from "@/hooks/useProducts";
import type { TransactionType } from "@/types/stock-transaction";

const TYPE_OPTIONS: Array<{ value: TransactionType | ""; label: string }> = [
  { value: "", label: "All Types" },
  { value: "STOCK_IN", label: "Stock In" },
  { value: "STOCK_OUT", label: "Stock Out" },
  { value: "ADJUSTMENT", label: "Adjustment" },
];

interface StockTransactionFiltersProps {
  type: string;
  onTypeChange: (value: string) => void;
  productId: string;
  onProductIdChange: (value: string) => void;
}

export default function StockTransactionFilters({
  type,
  onTypeChange,
  productId,
  onProductIdChange,
}: StockTransactionFiltersProps) {
  const { data } = useProducts({ per_page: 100 });

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Select value={type} onChange={(e) => onTypeChange(e.target.value)}>
        {TYPE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      <Select value={productId} onChange={(e) => onProductIdChange(e.target.value)}>
        <option value="">All Products</option>

        {data?.products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
