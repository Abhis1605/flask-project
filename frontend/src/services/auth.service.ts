import { api } from "@/lib/axios/api";
import { getCookie } from "@/lib/utils/cookies";

import type {
  ApiResponse,
  LoginRequest,
  LoginResponseData,
  RefreshResponseData,
  RegisterRequest,
  User,
} from "@/types/auth";

export const AuthService = {
  login: (data: LoginRequest) =>
    api.post<ApiResponse<LoginResponseData>, LoginRequest>("/auth/login", data),

  register: (data: RegisterRequest) =>
    api.post<ApiResponse<null>, RegisterRequest>("/auth/register", data),

  me: () => api.get<ApiResponse<User>>("/auth/me"),

  // Exchanges the httpOnly refresh cookie for a new access token.
  // Normally triggered transparently by the axios response interceptor.
  refresh: () =>
    api.post<ApiResponse<RefreshResponseData>>("/auth/refresh", undefined, {
      headers: { "X-CSRF-TOKEN": getCookie("csrf_refresh_token") ?? "" },
    }),

  logout: () =>
    api.post<ApiResponse<null>>("/auth/logout", undefined, {
      headers: { "X-CSRF-TOKEN": getCookie("csrf_refresh_token") ?? "" },
    }),

  logoutAll: () =>
    api.post<ApiResponse<null>>("/auth/logout-all", undefined, {
      headers: {
        "X-CSRF-TOKEN": getCookie("csrf_refresh_token") ?? "",
      },
    }),
};
