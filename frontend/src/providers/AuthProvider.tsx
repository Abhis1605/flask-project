"use client";

import { ReactNode, useEffect } from "react";

import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

interface AuthProviderProps {
  children: ReactNode;
}

let authInitializationPromise: Promise<void> | null = null;

async function initializeAuth() {
  const store = useAuthStore.getState();
  const startingAccessToken = store.accessToken;
  let refreshedAccessToken: string | null = null;

  store.setAuthInitialized(false);

  try {
    const refreshResponse = await AuthService.refresh();
    refreshedAccessToken = refreshResponse.data.access_token;

    useAuthStore.getState().setAccessToken(refreshedAccessToken);

    const meResponse = await AuthService.me();
    useAuthStore.getState().setUser(meResponse.data);
  } catch {
    const currentAccessToken = useAuthStore.getState().accessToken;
    const shouldClearAuth =
      currentAccessToken === startingAccessToken ||
      currentAccessToken === refreshedAccessToken;

    if (shouldClearAuth) {
      useAuthStore.getState().clearAuth();
    }
  } finally {
    useAuthStore.getState().setAuthInitialized(true);
  }
}

function startAuthInitialization() {
  if (!authInitializationPromise && !useAuthStore.getState().isInitialized) {
    authInitializationPromise = initializeAuth().finally(() => {
      authInitializationPromise = null;
    });
  }

  return authInitializationPromise;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    void startAuthInitialization();
  }, []);

  return <>{children}</>;
}
