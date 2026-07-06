"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Pagination from "@/components/ui/Pagination";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ProductFilters, { SORT_OPTIONS } from "@/components/products/ProductFilters";
import ProductTable from "@/components/products/ProductTable";
import ProductFormModal from "@/components/products/ProductFormModal";
import { useProducts, useDeleteProduct } from "@/hooks/useProducts";
import type { Product, ProductOrder, ProductSort } from "@/types/product";

export default function ProductsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortKey, setSortKey] = useState<string>("id-desc");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const deleteProduct = useDeleteProduct();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const activeSort =
    SORT_OPTIONS.find((option) => option.key === sortKey) ?? SORT_OPTIONS[0];

  const { data, isLoading, isFetching } = useProducts({
    search: search || undefined,
    category: category || undefined,
    min_price: minPrice ? Number(minPrice) : undefined,
    max_price: maxPrice ? Number(maxPrice) : undefined,
    sort: activeSort.sort as ProductSort,
    order: activeSort.order as ProductOrder,
    page,
    per_page: 10,
  });

  const resetToFirstPage = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  const openCreateForm = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingProduct) return;

    deleteProduct.mutate(deletingProduct.id, {
      onSuccess: () => setDeletingProduct(null),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your product inventory.
        </p>

        <Button onClick={openCreateForm}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <ProductFilters
          search={searchInput}
          onSearchChange={setSearchInput}
          category={category}
          onCategoryChange={resetToFirstPage(setCategory)}
          minPrice={minPrice}
          onMinPriceChange={resetToFirstPage(setMinPrice)}
          maxPrice={maxPrice}
          onMaxPriceChange={resetToFirstPage(setMaxPrice)}
          sortKey={sortKey}
          onSortKeyChange={resetToFirstPage(setSortKey)}
        />

        <div className="mt-4">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <div className={isFetching ? "opacity-60 transition-opacity" : ""}>
              <ProductTable
                products={data?.products ?? []}
                onEdit={openEditForm}
                onDelete={setDeletingProduct}
              />
            </div>
          )}
        </div>

        {data?.pagination && (
          <div className="mt-4">
            <Pagination
              page={data.pagination.page}
              pages={data.pagination.pages}
              total={data.pagination.total}
              perPage={data.pagination.per_page}
              hasPrev={data.pagination.has_prev}
              hasNext={data.pagination.has_next}
              onPageChange={setPage}
            />
          </div>
        )}
      </Card>

      <ProductFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        product={editingProduct}
      />

      <ConfirmDialog
        open={!!deletingProduct}
        title="Delete Product"
        description={`Are you sure you want to delete "${deletingProduct?.name}"? This action cannot be undone.`}
        loading={deleteProduct.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeletingProduct(null)}
      />
    </div>
  );
}
