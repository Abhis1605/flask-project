"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "@/components/ui/Modal";
import Label from "@/components/ui/Label";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCreateCategory, useUpdateCategory } from "@/hooks/useCategories";
import { categorySchema, CategorySchema } from "@/schemas/category.schema";
import type { Category } from "@/types/category";

interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  category?: Category | null;
}

export default function CategoryFormModal({
  open,
  onClose,
  category,
}: CategoryFormModalProps) {
  const isEdit = !!category;

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (!open) return;

    reset({ name: category?.name ?? "" });
  }, [open, category, reset]);

  const isPending = createCategory.isPending || updateCategory.isPending;

  const onSubmit = (data: CategorySchema) => {
    if (isEdit && category) {
      updateCategory.mutate(
        { id: category.id, data },
        { onSuccess: onClose }
      );
    } else {
      createCategory.mutate(data, { onSuccess: onClose });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Category" : "Add Category"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Category Name</Label>

          <Input
            placeholder="Enter category name"
            error={!!errors.name}
            {...register("name")}
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" loading={isPending}>
            {isEdit ? "Save Changes" : "Add Category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
