import Link from "next/link";
import { History } from "lucide-react";

import Card from "@/components/ui/Card";
import TransactionTypeBadge from "@/components/stock-transactions/TransactionTypeBadge";
import type { StockTransaction } from "@/types/stock-transaction";

interface RecentTransactionsCardProps {
  items: StockTransaction[];
  viewAllHref: string;
}

export default function RecentTransactionsCard({
  items,
  viewAllHref,
}: RecentTransactionsCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Recent Stock Activity
        </h3>

        <Link
          href={viewAllHref}
          className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          View all
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-400">
          <History className="h-8 w-8" />
          <p className="text-sm">No recent stock activity.</p>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
          {items.map((transaction) => (
            <li
              key={transaction.id}
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                  {transaction.product_name}
                </p>
                <p className="text-xs text-slate-400">
                  {new Date(transaction.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {transaction.quantity}
                </span>
                <TransactionTypeBadge type={transaction.transaction_type} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
