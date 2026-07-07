"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme.store";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme)

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      if (theme === "system") {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;

        root.classList.toggle("dark", prefersDark);
      } else {
        root.classList.toggle("dark", theme === "dark");
      }
    };

    applyTheme();

    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    media.addEventListener("change", applyTheme);

    return () => media.removeEventListener("change", applyTheme);
  }, [theme]);

  return children;
}