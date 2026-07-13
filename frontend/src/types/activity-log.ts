import type { Pagination } from "./common";

export type ActivityAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "CHANGE_ROLE"
  | "STOCK_IN"
  | "STOCK_OUT"
  | "ADJUSTMENT";

export type ActivityEntityType = "PRODUCT" | "CATEGORY" | "USER";

export interface ActivityLog {
  id: number;
  user_id: number;
  user_name: string | null;
  action: ActivityAction;
  entity_type: ActivityEntityType;
  entity_id: number | null;
  description: string;
  created_at: string;
}

export interface ActivityLogQuery {
  page?: number;
  per_page?: number;
  user_id?: number;
  action?: ActivityAction;
  entity_type?: ActivityEntityType;
}

export interface ActivityLogListResult {
  items: ActivityLog[];
  pagination: Pagination;
}
