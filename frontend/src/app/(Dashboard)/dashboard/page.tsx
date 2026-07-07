"use client";

import { Package, Tags } from "lucide-react";

import { useDashboard } from "@/hooks/useDashboard";
import StatCard from "@/components/dashboard/StatCard";
import Spinner from "@/components/ui/Spinner";
import Link from "next/link";

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

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
        <Link href={"/products"}>
          <StatCard
          label="Total Products"
          value={data?.stats.total_products ?? 0}
          icon={Package}
        />
        </Link>

        <Link href={"/categories"}>
          <StatCard
          label="Total Categories"
          value={data?.stats.total_categories ?? 0}
          icon={Tags}
        />
        </Link>
      </div>
    </div>
  );
}
