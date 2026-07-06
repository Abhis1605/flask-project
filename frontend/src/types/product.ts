import type { Category } from "./category";

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  total_amount: number;
  category: Category | null;
}

export interface ProductRequest {
  name: string;
  price: number;
  quantity: number;
  category: number;
}

export type ProductSort = "id" | "name" | "price" | "quantity" | "total_amount";

export type ProductOrder = "asc" | "desc";

export interface ProductQuery {
  search?: string;
  category?: number | string;
  min_price?: number;
  max_price?: number;
  page?: number;
  per_page?: number;
  sort?: ProductSort;
  order?: ProductOrder;
}
