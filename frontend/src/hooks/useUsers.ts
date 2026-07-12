import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { RoleService, UserService } from "@/services/user.service";
import type { Role, User } from "@/types/auth";

const USERS_KEY = ["users"];
const ROLES_KEY = ["roles"];

export function useUsers() {
  return useQuery<User[]>({
    queryKey: USERS_KEY,
    queryFn: async () => (await UserService.getUsers()).data,
  });
}

export function useRoles() {
  return useQuery<Role[]>({
    queryKey: ROLES_KEY,
    queryFn: async () => (await RoleService.getRoles()).data,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, roleId }: { id: number; roleId: number }) =>
      UserService.updateRole(id, roleId),

    onSuccess: () => {
      toast.success("User role updated successfully.");
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => UserService.toggleStatus(id),

    onSuccess: () => {
      toast.success("User status updated.");
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => UserService.deleteUser(id),

    onSuccess: () => {
      toast.success("User deleted successfully.");
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });
}
