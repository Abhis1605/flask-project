import { LayoutDashboard, Package, Tags, Users } from "lucide-react";

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
    permissions.can_manage_users
      ? { label: "Users", href: `${prefix}/users`, icon: Users }
      : null,
  ];

  return items.filter((item): item is NavItem => item !== null);
}
