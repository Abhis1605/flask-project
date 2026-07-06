"use client";

import { Search } from "lucide-react";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useCategories } from "@/hooks/useCategories";

export const SORT_OPTIONS = [
  { key: "id-desc", label: "Newest First", sort: "id", order: "desc" },
  { key: "id-asc", label: "Oldest First", sort: "id", order: "asc" },
  { key: "name-asc", label: "Name (A-Z)", sort: "name", order: "asc" },
  { key: "name-desc", label: "Name (Z-A)", sort: "name", order: "desc" },
  { key: "price-asc", label: "Price: Low to High", sort: "price", order: "asc" },
  { key: "price-desc", label: "Price: High to Low", sort: "price", order: "desc" },
  { key: "quantity-asc", label: "Quantity: Low to High", sort: "quantity", order: "asc" },
  { key: "quantity-desc", label: "Quantity: High to Low", sort: "quantity", order: "desc" },
] as const;

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  minPrice: string;
  onMinPriceChange: (value: string) => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
  sortKey: string;
  onSortKeyChange: (value: string) => void;
}

export default function ProductFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  sortKey,
  onSortKeyChange,
}: ProductFiltersProps) {
  const { data: categories } = useCategories();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <div className="relative lg:col-span-2">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">All Categories</option>

        {categories?.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>

      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => onMinPriceChange(e.target.value)}
        />

        <Input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(e.target.value)}
        />
      </div>

      <Select value={sortKey} onChange={(e) => onSortKeyChange(e.target.value)}>
        {SORT_OPTIONS.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
