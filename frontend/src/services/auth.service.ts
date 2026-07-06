import { api } from "@/lib/axios/api";

import type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types/auth";

export const AuthService = {
  login: (data: LoginRequest) =>
    api.post<ApiResponse<{ user: User }>, LoginRequest>(
      "/auth/login",
      data
    ),

  register: (data: RegisterRequest) =>
    api.post<ApiResponse<null>, RegisterRequest>(
      "/auth/register",
      data
    ),

  me: () =>
    api.get<ApiResponse<{ user: User }>>(
      "/auth/me"
    ),

  logout: () =>
    api.post<ApiResponse<null>>(
      "/auth/logout"
    ),
};