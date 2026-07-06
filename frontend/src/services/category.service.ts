import { api } from "@/lib/axios/api";

import type { ApiResponse } from "@/types/auth";
import type { Category, CategoryRequest } from "@/types/category";

export const CategoryService = {
  getCategories: () =>
    api.get<ApiResponse<Category[]>>("/categories"),

  createCategory: (data: CategoryRequest) =>
    api.post<ApiResponse<Category>, CategoryRequest>("/categories", data),

  updateCategory: (id: number, data: CategoryRequest) =>
    api.put<ApiResponse<Category>, CategoryRequest>(`/categories/${id}`, data),

  deleteCategory: (id: number) =>
    api.delete<ApiResponse<null>>(`/categories/${id}`),
};
