import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;

  setTheme: (theme: Theme) => void;

  resolvedTheme: "light" | "dark";

  setResolvedTheme: (resolvedTheme: "light" | "dark") => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",

      setTheme: (theme) => set({ theme }),

      resolvedTheme: "light",

      setResolvedTheme: (resolvedTheme) => set({ resolvedTheme }),
    }),
    {
      name: "theme-storage",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);