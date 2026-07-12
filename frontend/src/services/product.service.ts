import { api } from "@/lib/axios/api";

import type { ApiResponse } from "@/types/auth";
import type { Pagination } from "@/types/common";
import type { Product, ProductQuery, ProductRequest } from "@/types/product";

export const ProductService = {
  getProducts: (query: ProductQuery) =>
    api.get<ApiResponse<{ products: Product[]; pagination: Pagination }>>(
      "/products",
      { params: query }
    ),

  getProduct: (id: number) =>
    api.get<ApiResponse<Product>>(`/products/${id}`),

  createProduct: (data: ProductRequest) =>
    api.post<ApiResponse<Product>, ProductRequest>("/products", data),

  updateProduct: (id: number, data: ProductRequest) =>
    api.put<ApiResponse<Product>, ProductRequest>(`/products/${id}`, data),

  deleteProduct: (id: number) =>
    api.delete<ApiResponse<null>>(`/products/${id}`),

  updateQuantity: (id: number, data: { operation: "add" | "remove"; quantity: number }) =>
    api.patch<ApiResponse<Product>, typeof data>(`/products/${id}/quantity`, data),
};
