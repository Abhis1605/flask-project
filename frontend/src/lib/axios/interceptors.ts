import { AxiosError, AxiosInstance } from "axios";

import { ApiError } from "@/lib/errors/ApiError";
import { useAuthStore } from "@/store/auth.store";

interface FlaskErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}

const AUTH_CHECK_URL = "/auth/me";
const PUBLIC_ROUTES = ["/login", "/register"];

export function attachInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<FlaskErrorBody>) => {
      if (!error.response) {
        return Promise.reject(
          new ApiError({
            message: "Network error. Please check your connection and try again.",
            status: 0,
          })
        );
      }

      const { status, data } = error.response;

      if (status === 401) {
        useAuthStore.getState().clearUser();

        const isAuthCheck = error.config?.url?.includes(AUTH_CHECK_URL);
        const isPublicRoute =
          typeof window !== "undefined" &&
          PUBLIC_ROUTES.some((route) => window.location.pathname.startsWith(route));

        if (!isAuthCheck && !isPublicRoute && typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      return Promise.reject(
        new ApiError({
          message: data?.message ?? "Something went wrong. Please try again.",
          status,
          errors: data?.errors ?? undefined,
        })
      );
    }
  );
}
