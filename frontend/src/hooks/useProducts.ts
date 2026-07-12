import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ProductService } from "@/services/product.service";
import type { Pagination } from "@/types/common";
import type { Product, ProductQuery, ProductRequest } from "@/types/product";

const PRODUCTS_KEY = ["products"];

export function useProducts(query: ProductQuery) {
  return useQuery<{ products: Product[]; pagination: Pagination }>({
    queryKey: [...PRODUCTS_KEY, query],
    queryFn: async () => (await ProductService.getProducts(query)).data,
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductRequest) => ProductService.createProduct(data),

    onSuccess: () => {
      toast.success("Product created successfully.");
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductRequest }) =>
      ProductService.updateProduct(id, data),

    onSuccess: () => {
      toast.success("Product updated successfully.");
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ProductService.deleteProduct(id),

    onSuccess: () => {
      toast.success("Product deleted successfully.");
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateProductQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { operation: "add" | "remove"; quantity: number };
    }) => ProductService.updateQuantity(id, data),

    onSuccess: () => {
      toast.success("Stock updated successfully.");
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
