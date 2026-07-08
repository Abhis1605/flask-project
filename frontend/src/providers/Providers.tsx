"use client";

import { ReactNode, useEffect, useState } from "react";

import {
  QueryClientProvider,
} from "@tanstack/react-query";

import { Toaster } from 'sonner'

import {
  ReactQueryDevtools,
} from "@tanstack/react-query-devtools";

import { queryClient } from "@/lib/query/queryClient";
import { useThemeStore } from "@/store/theme.store";
import AuthProvider from "@/providers/AuthProvider";

interface ProvidersProps {
  children: ReactNode;
}

function ThemeInitializer() {
  const theme = useThemeStore((state) => state.theme);
  const setResolvedTheme = useThemeStore((state) => state.setResolvedTheme);

  useEffect(() => {
    const root = document.documentElement;

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const isDark = theme === "system" ? media.matches : theme === "dark";

      root.classList.toggle("dark", isDark);
      setResolvedTheme(isDark ? "dark" : "light");
    };

    applyTheme();

    if (theme === "system") {
      media.addEventListener("change", applyTheme);

      return () => {
        media.removeEventListener("change", applyTheme);
      };
    }
  }, [theme, setResolvedTheme]);

  return null;
}

export default function Providers({
  children,
}: ProvidersProps) {

  const [client] = useState(() => queryClient());

  return (
    <QueryClientProvider client={client}>

      <ThemeInitializer />

      <AuthProvider>
        {children}
      </AuthProvider>

      <Toaster position="top-right"
        richColors
        closeButton
        duration={3000}
       />

      <ReactQueryDevtools
        initialIsOpen={false}
        buttonPosition="bottom-right"
      />
    </QueryClientProvider>
  );
}
