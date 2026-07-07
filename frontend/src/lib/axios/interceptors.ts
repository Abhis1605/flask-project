import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

import { ApiError } from "@/lib/errors/ApiError";
import { useAuthStore } from "@/store/auth.store";
import { getCookie } from "@/lib/utils/cookies";

import type { ApiResponse, RefreshResponseData } from "@/types/auth";

interface FlaskErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Requests to these endpoints must never trigger a refresh-and-retry -
// a 401 here means "not logged in", not "access token expired".
const NO_REFRESH_RETRY = ["/auth/refresh", "/auth/login", "/auth/register"];
const PUBLIC_ROUTES = ["/login", "/register"];

// Coalesces concurrent 401s into a single in-flight refresh call.
let refreshPromise: Promise<string | null> | null = null;

function refreshAccessToken(instance: AxiosInstance): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = instance
      .post<ApiResponse<RefreshResponseData>>("/auth/refresh", null, {
        headers: {
          "X-CSRF-TOKEN": getCookie("csrf_refresh_token") ?? "",
        },
      })
      .then((res) => {
        const token = res.data.data.access_token;
        useAuthStore.getState().setAccessToken(token);
        return token;
      })
      .catch(() => {
        useAuthStore.getState().clearAuth();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export function attachInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<FlaskErrorBody>) => {
      if (!error.response) {
        return Promise.reject(
          new ApiError({
            message: "Network error. Please check your connection and try again.",
            status: 0,
          })
        );
      }

      const { status, data } = error.response;
      const originalRequest = error.config as RetryableConfig | undefined;
      const url = originalRequest?.url ?? "";

      const isPublicRoute =
        typeof window !== "undefined" &&
        PUBLIC_ROUTES.some((route) => window.location.pathname.startsWith(route));

      const shouldAttemptRefresh =
        status === 401 &&
        !!originalRequest &&
        !originalRequest._retry &&
        !NO_REFRESH_RETRY.some((route) => url.includes(route));

      if (shouldAttemptRefresh && originalRequest) {
        originalRequest._retry = true;

        const newToken = await refreshAccessToken(instance);

        if (newToken) {
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return instance(originalRequest);
        }
      }

      if (status === 401) {
        useAuthStore.getState().clearAuth();

        const isAuthCheck = url.includes("/auth/me");

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
