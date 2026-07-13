"use client";

import { useState } from "react";

import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import Pagination from "@/components/ui/Pagination";
import StockTransactionTable from "@/components/stock-transactions/StockTransactionTable";
import { useMyTransactions } from "@/hooks/useStockTransactions";
import type { TransactionType } from "@/types/stock-transaction";

const TYPE_OPTIONS: Array<{ value: TransactionType | ""; label: string }> = [
  { value: "", label: "All Types" },
  { value: "STOCK_IN", label: "Stock In" },
  { value: "STOCK_OUT", label: "Stock Out" },
  { value: "ADJUSTMENT", label: "Adjustment" },
];

export default function MyTransactionsPageContent() {
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useMyTransactions({
    type: (type || undefined) as TransactionType | undefined,
    page,
    limit: 10,
  });

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        View your own stock update activity.
      </p>

      <Card>
        <div className="max-w-xs">
          <Select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
          >
            {TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="mt-4">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <div className={isFetching ? "opacity-60 transition-opacity" : ""}>
              <StockTransactionTable transactions={data?.items ?? []} showUser={false} />
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
