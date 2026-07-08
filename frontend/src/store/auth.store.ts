import { create } from "zustand";

import type { User } from "@/types/auth";

interface AuthState {
  user: User | null;

  // Kept in memory only (never persisted) - the least exposed place to
  // hold a bearer token. Lost on full page reload by design; restored via
  // a silent refresh against the httpOnly refresh cookie.
  accessToken: string | null;

  isAuthenticated: boolean;

  isInitialized: boolean;

  setUser: (user: User) => void;

  setAccessToken: (accessToken: string) => void;

  setAuthInitialized: (isInitialized: boolean) => void;

  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  accessToken: null,

  isAuthenticated: false,

  isInitialized: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  setAccessToken: (accessToken) =>
    set({
      accessToken,
    }),

  setAuthInitialized: (isInitialized) =>
    set({
      isInitialized,
    }),

  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    }),
}));
