"use client";

import { Package, Tags } from "lucide-react";
import Link from "next/link";

import { useDashboard } from "@/hooks/useDashboard";
import { usePermissions } from "@/hooks/usePermissions";
import { useMyTransactions, useStockTransactions } from "@/hooks/useStockTransactions";
import StatCard from "@/components/dashboard/StatCard";
import RecentTransactionsCard from "@/components/dashboard/RecentTransactionsCard";
import Spinner from "@/components/ui/Spinner";

export default function DashboardPageContent() {
  const { data, isLoading } = useDashboard();
  const { prefix, hasPermission } = usePermissions();

  const canViewAllTransactions = hasPermission("can_view_stock_transactions");
  const canViewOwnTransactions = !canViewAllTransactions && hasPermission("can_update_stock");

  const { data: allTransactions } = useStockTransactions(
    { limit: 5 },
    canViewAllTransactions
  );

  const { data: myTransactions } = useMyTransactions(
    { limit: 5 },
    canViewOwnTransactions
  );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          Welcome back, {data?.user.full_name}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Here&apos;s an overview of your inventory.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href={`${prefix}/products`}>
          <StatCard
            label="Total Products"
            value={data?.stats.total_products ?? 0}
            icon={Package}
          />
        </Link>

        <Link href={`${prefix}/categories`}>
          <StatCard
            label="Total Categories"
            value={data?.stats.total_categories ?? 0}
            icon={Tags}
          />
        </Link>
      </div>

      {canViewAllTransactions && (
        <RecentTransactionsCard
          items={allTransactions?.items ?? []}
          viewAllHref={`${prefix}/stock-transactions`}
        />
      )}

      {canViewOwnTransactions && (
        <RecentTransactionsCard
          items={myTransactions?.items ?? []}
          viewAllHref={`${prefix}/my-transactions`}
        />
      )}
    </div>
  );
}
