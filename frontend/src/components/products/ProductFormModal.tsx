"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "@/components/ui/Modal";
import Label from "@/components/ui/Label";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useCategories } from "@/hooks/useCategories";
import { useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";
import { productSchema, ProductSchema } from "@/schemas/product.schema";
import type { Product } from "@/types/product";

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}

export default function ProductFormModal({
  open,
  onClose,
  product,
}: ProductFormModalProps) {
  const isEdit = !!product;

  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (!open) return;

    reset(
      product
        ? {
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            category: product.category?.id ?? 0,
          }
        : {
            name: "",
            price: 0,
            quantity: 0,
            category: 0,
          }
    );
  }, [open, product, reset]);

  const isPending = createProduct.isPending || updateProduct.isPending;

  const onSubmit = (data: ProductSchema) => {
    if (isEdit && product) {
      updateProduct.mutate(
        { id: product.id, data },
        { onSuccess: onClose }
      );
    } else {
      createProduct.mutate(data, { onSuccess: onClose });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Product" : "Add Product"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Product Name</Label>

          <Input
            placeholder="Enter product name"
            error={!!errors.name}
            {...register("name")}
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Price</Label>

            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              error={!!errors.price}
              {...register("price", { valueAsNumber: true })}
            />

            {errors.price && (
              <p className="mt-1 text-sm text-red-500">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <Label>Quantity</Label>

            <Input
              type="number"
              placeholder="0"
              error={!!errors.quantity}
              {...register("quantity", { valueAsNumber: true })}
            />

            {errors.quantity && (
              <p className="mt-1 text-sm text-red-500">
                {errors.quantity.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label>Category</Label>

          <Select
            error={!!errors.category}
            {...register("category", { valueAsNumber: true })}
          >
            <option value={0}>Select a category</option>

            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>

          {errors.category && (
            <p className="mt-1 text-sm text-red-500">
              {errors.category.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" loading={isPending}>
            {isEdit ? "Save Changes" : "Add Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
