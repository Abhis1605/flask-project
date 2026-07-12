"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import CategoryTable from "@/components/categories/CategoryTable";
import CategoryFormModal from "@/components/categories/CategoryFormModal";
import { useCategories, useDeleteCategory } from "@/hooks/useCategories";
import { usePermissions } from "@/hooks/usePermissions";
import type { Category } from "@/types/category";

export default function CategoriesPageContent() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const { data, isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();
  const { hasPermission } = usePermissions();

  const canCreate = hasPermission("can_create_category");
  const canUpdate = hasPermission("can_update_category");
  const canDelete = hasPermission("can_delete_category");

  const openCreateForm = () => {
    setEditingCategory(null);
    setFormOpen(true);
  };

  const openEditForm = (category: Category) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingCategory) return;

    deleteCategory.mutate(deletingCategory.id, {
      onSuccess: () => setDeletingCategory(null),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your product categories.
        </p>

        {canCreate && (
          <Button onClick={openCreateForm}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        )}
      </div>

      <Card>
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <CategoryTable
            categories={data ?? []}
            onEdit={openEditForm}
            onDelete={setDeletingCategory}
            canUpdate={canUpdate}
            canDelete={canDelete}
          />
        )}
      </Card>

      {canCreate || canUpdate ? (
        <CategoryFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          category={editingCategory}
        />
      ) : null}

      <ConfirmDialog
        open={!!deletingCategory}
        title="Delete Category"
        description={`Are you sure you want to delete "${deletingCategory?.name}"? Products in this category will be affected.`}
        loading={deleteCategory.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeletingCategory(null)}
      />
    </div>
  );
}
