import { api } from "@/lib/axios/api";

import type { ApiResponse, Role, User } from "@/types/auth";

export const UserService = {
  getUsers: () => api.get<ApiResponse<User[]>>("/users"),

  getUser: (id: number) => api.get<ApiResponse<User>>(`/users/${id}`),

  updateRole: (id: number, roleId: number) =>
    api.patch<ApiResponse<User>, { role_id: number }>(`/users/${id}/role`, {
      role_id: roleId,
    }),

  toggleStatus: (id: number) =>
    api.patch<ApiResponse<User>>(`/users/${id}/status`),

  deleteUser: (id: number) => api.delete<ApiResponse<null>>(`/users/${id}`),
};

export const RoleService = {
  getRoles: () => api.get<ApiResponse<Role[]>>("/roles"),
};
