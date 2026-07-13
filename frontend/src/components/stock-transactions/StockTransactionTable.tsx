import { History } from "lucide-react";

import TransactionTypeBadge from "@/components/stock-transactions/TransactionTypeBadge";
import { useMobile } from "@/hooks/useMobile";
import type { StockTransaction } from "@/types/stock-transaction";
import { formatIndianDateTime } from "@/utils/date";

interface StockTransactionTableProps {
  transactions: StockTransaction[];
  showUser?: boolean;
}

export default function StockTransactionTable({
  transactions,
  showUser = true,
}: StockTransactionTableProps) {
  const isMobile = useMobile();

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
        <History className="h-10 w-10" />
        <p className="text-sm">No stock transactions found.</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-800 dark:text-slate-100">
                  {transaction.product_name}
                </p>
                <p className="text-xs text-slate-400">{transaction.reference_no}</p>
              </div>

              <TransactionTypeBadge type={transaction.transaction_type} />
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-sm dark:border-slate-800">
              <div>
                <dt className="text-xs text-slate-400">Quantity</dt>
                <dd className="font-medium text-slate-700 dark:text-slate-200">
                  {transaction.quantity}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-slate-400">Stock (prev → new)</dt>
                <dd className="font-medium text-slate-700 dark:text-slate-200">
                  {transaction.previous_stock} → {transaction.new_stock}
                </dd>
              </div>

              {showUser && (
                <div>
                  <dt className="text-xs text-slate-400">User</dt>
                  <dd className="font-medium text-slate-700 dark:text-slate-200">
                    {transaction.user_name}
                  </dd>
                </div>
              )}

              <div>
                <dt className="text-xs text-slate-400">Date</dt>
                <dd className="font-medium text-slate-700 dark:text-slate-200">
                  {formatIndianDateTime(transaction.created_at)}
                </dd>
              </div>

              {transaction.remarks && (
                <div className="col-span-2">
                  <dt className="text-xs text-slate-400">Remarks</dt>
                  <dd className="text-slate-700 dark:text-slate-200">
                    {transaction.remarks}</dd>
                </div>
              )}
            </dl>
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
            <th className="whitespace-nowrap px-4 py-3 font-medium">Reference No</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Product</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Type</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Quantity</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Prev → New Stock</th>
            {showUser && <th className="whitespace-nowrap px-4 py-3 font-medium">User</th>}
            <th className="whitespace-nowrap px-4 py-3 font-medium">Remarks</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Date</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="text-slate-700 dark:text-slate-200">
              <td className="whitespace-nowrap px-4 py-3 font-medium">
                {transaction.reference_no}
              </td>

              <td className="whitespace-nowrap px-4 py-3">{transaction.product_name}</td>

              <td className="whitespace-nowrap px-4 py-3">
                <TransactionTypeBadge type={transaction.transaction_type} />
              </td>

              <td className="whitespace-nowrap px-4 py-3">{transaction.quantity}</td>

              <td className="whitespace-nowrap px-4 py-3">
                {transaction.previous_stock} → {transaction.new_stock}
              </td>

              {showUser && (
                <td className="whitespace-nowrap px-4 py-3">{transaction.user_name}</td>
              )}

              <td className="max-w-xs truncate px-4 py-3 text-slate-500 dark:text-slate-400">
                {transaction.remarks ?? "—"}
              </td>

              <td className="whitespace-nowrap px-4 py-3">
                {formatIndianDateTime(transaction.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
