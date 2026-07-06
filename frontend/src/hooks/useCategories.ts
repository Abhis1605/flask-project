import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { CategoryService } from "@/services/category.service";
import type { Category, CategoryRequest } from "@/types/category";

const CATEGORIES_KEY = ["categories"];

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: CATEGORIES_KEY,
    queryFn: async () => (await CategoryService.getCategories()).data,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryRequest) =>
      CategoryService.createCategory(data),

    onSuccess: () => {
      toast.success("Category created successfully.");
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryRequest }) =>
      CategoryService.updateCategory(id, data),

    onSuccess: () => {
      toast.success("Category updated successfully.");
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => CategoryService.deleteCategory(id),

    onSuccess: () => {
      toast.success("Category deleted successfully.");
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
}
