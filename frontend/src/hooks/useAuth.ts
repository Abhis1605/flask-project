import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

import type {
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";

export function useLogin() {
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: LoginRequest) =>
      AuthService.login(data),

    onSuccess: (response) => {
      setUser(response.data);

      router.push("/dashboard");
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

export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser);

  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await AuthService.me();
      setUser(response.data);
      return response.data;
    },
    retry: false,
  });

  return query;
}

export function useLogout() {
  const router = useRouter();

  const clearUser = useAuthStore((state) => state.clearUser);

  return useMutation({
    mutationFn: () => AuthService.logout(),

    onSuccess: () => {
      clearUser();

      router.replace("/login");
    },
  });
}
