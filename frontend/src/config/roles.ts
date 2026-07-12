export const ROLE_CONFIG = {
  ADMIN: { prefix: "/admin", label: "Admin" },
  admin: { prefix: "/admin", label: "Admin" },
  INVENTORY_MANAGER: { prefix: "/inventory-manager", label: "Inventory Manager" },
  inventory_manager: { prefix: "/inventory-manager", label: "Inventory Manager" },
  EMPLOYEE: { prefix: "/employee", label: "Employee" },
  employee: { prefix: "/employee", label: "Employee" },
  user: { prefix: "/employee", label: "User" },
} as const;

export type RoleCode = keyof typeof ROLE_CONFIG;

export function normalizeRoleCode(roleCode: string | undefined): RoleCode | undefined {
  if (!roleCode) {
    return undefined;
  }

  const normalizedRoleCode = roleCode.trim().replace(/-/g, "_");
  const uppercaseRoleCode = normalizedRoleCode.toUpperCase();

  if (uppercaseRoleCode in ROLE_CONFIG) {
    return uppercaseRoleCode as RoleCode;
  }

  if (normalizedRoleCode in ROLE_CONFIG) {
    return normalizedRoleCode as RoleCode;
  }

  return undefined;
}

export function getCanonicalRoleCode(roleCode: string | undefined): string | undefined {
  const normalizedRoleCode = normalizeRoleCode(roleCode);

  if (!normalizedRoleCode) {
    return undefined;
  }

  if (normalizedRoleCode === "admin" || normalizedRoleCode === "ADMIN") {
    return "ADMIN";
  }

  if (
    normalizedRoleCode === "inventory_manager" ||
    normalizedRoleCode === "INVENTORY_MANAGER"
  ) {
    return "INVENTORY_MANAGER";
  }

  if (normalizedRoleCode === "employee" || normalizedRoleCode === "EMPLOYEE" || normalizedRoleCode === "user") {
    return "EMPLOYEE";
  }

  return normalizedRoleCode;
}

export function getRolePrefix(roleCode: string | undefined): string {
  const normalizedRoleCode = normalizeRoleCode(roleCode);

  if (normalizedRoleCode) {
    return ROLE_CONFIG[normalizedRoleCode].prefix;
  }

  return "/login";
}

export function getRoleHome(roleCode: string | undefined): string {
  const prefix = getRolePrefix(roleCode);
  return prefix === "/login" ? prefix : `${prefix}/dashboard`;
}
