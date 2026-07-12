"use client";

import { useState } from "react";

import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import UserTable from "@/components/users/UserTable";
import {
  useUsers,
  useRoles,
  useUpdateUserRole,
  useToggleUserStatus,
  useDeleteUser,
} from "@/hooks/useUsers";
import { useAuthStore } from "@/store/auth.store";
import type { User } from "@/types/auth";

export default function UsersPageContent() {
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const currentUser = useAuthStore((state) => state.user);

  const { data: users, isLoading } = useUsers();
  const { data: roles } = useRoles();

  const updateRole = useUpdateUserRole();
  const toggleStatus = useToggleUserStatus();
  const deleteUser = useDeleteUser();

  const confirmDelete = () => {
    if (!deletingUser) return;

    deleteUser.mutate(deletingUser.id, {
      onSuccess: () => setDeletingUser(null),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage user roles and access.
        </p>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <UserTable
            users={users ?? []}
            roles={roles ?? []}
            currentUserId={currentUser?.id}
            onRoleChange={(user, roleId) =>
              updateRole.mutate({ id: user.id, roleId })
            }
            onToggleStatus={(user) => toggleStatus.mutate(user.id)}
            onDelete={(user) => {
              if (currentUser?.id === user.id) return;
              setDeletingUser(user);
            }}
          />
        )}
      </Card>

      <ConfirmDialog
        open={!!deletingUser}
        title="Delete User"
        description={`Are you sure you want to delete "${deletingUser?.full_name}"? This action cannot be undone.`}
        loading={deleteUser.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeletingUser(null)}
      />
    </div>
  );
}
