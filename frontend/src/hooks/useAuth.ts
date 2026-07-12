import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { getRoleHome } from "@/config/roles";

import type {
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";

export function useLogin(redirectTo?: string) {
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: (data: LoginRequest) =>
      AuthService.login(data),

    onSuccess: (response) => {
      setAccessToken(response.data.access_token);
      setUser(response.data.user);

      router.push(redirectTo ?? getRoleHome(response.data.user.role.code));
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
  const setLoggingOut = useAuthStore((state) => state.setLoggingOut);

  return useMutation({
    mutationFn: () => AuthService.logout(),

    // Flip this before the request even resolves - it's what tells
    // AuthGuard to stay quiet once clearAuth() below flips
    // isAuthenticated to false while we're still on the protected page.
    onMutate: () => {
      setLoggingOut(true);
    },

    onSuccess: () => {
      clearAuth();

      router.replace("/login");
    },

    onError: () => {
      setLoggingOut(false);
    },
  });
}

export function useLogoutAll() {
  const router = useRouter();

  const clearAuth = useAuthStore(
    (state) => state.clearAuth
  );
  const setLoggingOut = useAuthStore((state) => state.setLoggingOut);

  return useMutation({
    mutationFn: () =>
      AuthService.logoutAll(),

    onMutate: () => {
      setLoggingOut(true);
    },

    onSuccess: () => {
      clearAuth();
      router.replace("/login");
    },

    onError: () => {
      setLoggingOut(false);
    },
  });
}