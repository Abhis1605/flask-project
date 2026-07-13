"use client";

import Select from "@/components/ui/Select";
import { useUsers } from "@/hooks/useUsers";
import type { ActivityAction, ActivityEntityType } from "@/types/activity-log";

const ACTION_OPTIONS: Array<{ value: ActivityAction | ""; label: string }> = [
  { value: "", label: "All Actions" },
  { value: "CREATE", label: "Created" },
  { value: "UPDATE", label: "Updated" },
  { value: "DELETE", label: "Deleted" },
  { value: "CHANGE_ROLE", label: "Role Changed" },
  { value: "STOCK_IN", label: "Stock In" },
  { value: "STOCK_OUT", label: "Stock Out" },
  { value: "ADJUSTMENT", label: "Adjustment" },
];

const ENTITY_OPTIONS: Array<{ value: ActivityEntityType | ""; label: string }> = [
  { value: "", label: "All Entities" },
  { value: "PRODUCT", label: "Product" },
  { value: "CATEGORY", label: "Category" },
  { value: "USER", label: "User" },
];

interface ActivityLogFiltersProps {
  action: string;
  onActionChange: (value: string) => void;
  entityType: string;
  onEntityTypeChange: (value: string) => void;
  userId?: string;
  onUserIdChange?: (value: string) => void;
  showUserFilter?: boolean;
}

export default function ActivityLogFilters({
  action,
  onActionChange,
  entityType,
  onEntityTypeChange,
  userId = "",
  onUserIdChange,
  showUserFilter = false,
}: ActivityLogFiltersProps) {
  const { data: users } = useUsers();

  return (
    <div
      className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${
        showUserFilter ? "lg:grid-cols-3" : ""
      }`}
    >
      <Select value={action} onChange={(e) => onActionChange(e.target.value)}>
        {ACTION_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      <Select value={entityType} onChange={(e) => onEntityTypeChange(e.target.value)}>
        {ENTITY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      {showUserFilter && onUserIdChange && (
        <Select value={userId} onChange={(e) => onUserIdChange(e.target.value)}>
          <option value="">All Users</option>

          {users?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.full_name}
            </option>
          ))}
        </Select>
      )}
    </div>
  );
}
