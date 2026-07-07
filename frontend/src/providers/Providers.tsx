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

interface ProvidersProps {
  children: ReactNode;
}

function ThemeInitializer() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      if (theme === "system") {
        root.classList.toggle("dark", media.matches);
      } else {
        root.classList.toggle("dark", theme === "dark");
      }
    };

    applyTheme();

    if (theme === "system") {
      media.addEventListener("change", applyTheme);

      return () => {
        media.removeEventListener("change", applyTheme);
      };
    }
  }, [theme]);

  return null;
}

export default function Providers({
  children,
}: ProvidersProps) {

  const [client] = useState(() => queryClient());

  return (
    <QueryClientProvider client={client}>

      <ThemeInitializer />

      {children}

      <Toaster position="top-right"
        richColors
        closeButton
        duration={300}
       />

      <ReactQueryDevtools
        initialIsOpen={false}
        buttonPosition="bottom-right"
      />
    </QueryClientProvider>
  );
}