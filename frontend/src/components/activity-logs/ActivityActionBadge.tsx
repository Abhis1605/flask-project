import Badge from "@/components/ui/Badge";
import type { ActivityAction } from "@/types/activity-log";

const LABELS: Record<ActivityAction, string> = {
  CREATE: "Created",
  UPDATE: "Updated",
  DELETE: "Deleted",
  CHANGE_ROLE: "Role Changed",
  STOCK_IN: "Stock In",
  STOCK_OUT: "Stock Out",
  ADJUSTMENT: "Adjustment",
};

const VARIANTS: Record<ActivityAction, "default" | "success" | "warning" | "danger"> = {
  CREATE: "success",
  UPDATE: "warning",
  DELETE: "danger",
  CHANGE_ROLE: "default",
  STOCK_IN: "success",
  STOCK_OUT: "danger",
  ADJUSTMENT: "warning",
};

export default function ActivityActionBadge({ action }: { action: ActivityAction }) {
  return <Badge variant={VARIANTS[action]}>{LABELS[action]}</Badge>;
}
