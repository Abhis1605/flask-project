import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

import type {
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";

export function useLogin(redirectTo: string = "/dashboard") {
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: (data: LoginRequest) =>
      AuthService.login(data),

    onSuccess: (response) => {
      setAccessToken(response.data.access_token);
      setUser(response.data.user);

      router.push(redirectTo);
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) =>
      AuthService.register(data),

    onSuccess: () => {
      router.push("/login");
    },
  });
}

export function useLogout() {
  const router = useRouter();

  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: () => AuthService.logout(),

    onSuccess: () => {
      clearAuth();

      router.replace("/login");
    },
  });
}

export function useLogoutAll() {
  const router = useRouter();

  const clearAuth = useAuthStore(
    (state) => state.clearAuth
  );

  return useMutation({
    mutationFn: () =>
      AuthService.logoutAll(),

    onSuccess: () => {
      clearAuth();
      router.replace("/login");
    },
  });
}