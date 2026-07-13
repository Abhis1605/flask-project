import { useAuthStore } from "@/store/auth.store";
import { getRolePrefix } from "@/config/roles";
import type { Permissions } from "@/types/auth";

const EMPTY_PERMISSIONS: Permissions = {
  can_view_products: false,
  can_create_product: false,
  can_update_product: false,
  can_delete_product: false,
  can_view_categories: false,
  can_create_category: false,
  can_update_category: false,
  can_delete_category: false,
  can_view_stock: false,
  can_update_stock: false,
  can_view_stock_transactions: false,
  can_adjust_stock: false,
  can_manage_users: false,
};

export function usePermissions() {
  const user = useAuthStore((state) => state.user);

  const permissions = user?.permissions ?? EMPTY_PERMISSIONS;
  const role = user?.role;
  const prefix = getRolePrefix(role?.code);

  const hasPermission = (key: keyof Permissions) => Boolean(permissions[key]);

  return { permissions, role, prefix, hasPermission };
}
