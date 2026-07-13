"use client";

import { useState } from "react";

import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import Pagination from "@/components/ui/Pagination";
import StockTransactionFilters from "@/components/stock-transactions/StockTransactionFilters";
import StockTransactionTable from "@/components/stock-transactions/StockTransactionTable";
import { useStockTransactions } from "@/hooks/useStockTransactions";
import type { TransactionType } from "@/types/stock-transaction";

export default function StockTransactionsPageContent() {
  const [type, setType] = useState("");
  const [productId, setProductId] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useStockTransactions({
    type: (type || undefined) as TransactionType | undefined,
    product_id: productId ? Number(productId) : undefined,
    page,
    limit: 10,
  });

  const changeFilter = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        View all stock transaction activity across your inventory.
      </p>

      <Card>
        <StockTransactionFilters
          type={type}
          onTypeChange={changeFilter(setType)}
          productId={productId}
          onProductIdChange={changeFilter(setProductId)}
        />

        <div className="mt-4">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <div className={isFetching ? "opacity-60 transition-opacity" : ""}>
              <StockTransactionTable transactions={data?.items ?? []} />
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
    </div>
  );
}
