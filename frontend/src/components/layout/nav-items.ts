import { History, LayoutDashboard, Package, ScrollText, Tags, Users } from "lucide-react";

import type { Permissions } from "@/types/auth";

export interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

export function getNavItems(prefix: string, permissions: Permissions): NavItem[] {
  const items: Array<NavItem | null> = [
    { label: "Dashboard", href: `${prefix}/dashboard`, icon: LayoutDashboard },
    permissions.can_view_products
      ? { label: "Products", href: `${prefix}/products`, icon: Package }
      : null,
    permissions.can_view_categories
      ? { label: "Categories", href: `${prefix}/categories`, icon: Tags }
      : null,
    permissions.can_view_stock_transactions
      ? { label: "Stock Transactions", href: `${prefix}/stock-transactions`, icon: History }
      : permissions.can_update_stock
        ? { label: "My Transactions", href: `${prefix}/my-transactions`, icon: History }
        : null,
            permissions.can_view_activity_logs
      ? { label: "Activity Logs", href: `${prefix}/activity-logs`, icon: ScrollText }
      : { label: "My Activity", href: `${prefix}/my-activity`, icon: ScrollText },
    permissions.can_manage_users
      ? { label: "Users", href: `${prefix}/users`, icon: Users }
      : null,
  ];

  return items.filter((item): item is NavItem => item !== null);
}
