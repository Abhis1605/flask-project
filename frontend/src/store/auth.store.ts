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

  // Set while an explicit logout is in flight, so AuthGuard can tell
  // "user chose to log out" apart from "session expired underneath them"
  // and skip its own session_expired redirect.
  isLoggingOut: boolean;

  setUser: (user: User) => void;

  setAccessToken: (accessToken: string) => void;

  setAuthInitialized: (isInitialized: boolean) => void;

  setLoggingOut: (isLoggingOut: boolean) => void;

  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  accessToken: null,

  isAuthenticated: false,

  isInitialized: false,

  isLoggingOut: false,

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

  setLoggingOut: (isLoggingOut) =>
    set({
      isLoggingOut,
    }),

  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoggingOut: false,
    }),
}));
