import type { Pagination } from "./common";

export type TransactionType = "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT";

export interface StockTransaction {
  id: number;
  reference_no: string;
  product_id: number;
  product_name: string;
  user_id: number;
  user_name: string;
  transaction_type: TransactionType;
  quantity: number;
  previous_stock: number;
  new_stock: number;
  remarks: string | null;
  created_at: string;
}

export interface StockTransactionQuery {
  page?: number;
  limit?: number;
  type?: TransactionType;
  product_id?: number;
  user_id?: number;
}

export interface StockTransactionListResult {
  success: boolean;
  items: StockTransaction[];
  pagination: Pagination;
}
