import type { User } from "./auth";

export interface DashboardStats {
  total_products: number;
  total_categories: number;
}

export interface Dashboard {
  user: User;
  stats: DashboardStats;
}
