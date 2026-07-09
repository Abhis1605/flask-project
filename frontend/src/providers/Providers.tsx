"use client";

import { ReactNode, useState } from "react";

import {
  QueryClientProvider,
} from "@tanstack/react-query";

import { Toaster } from 'sonner'
import { ThemeProvider } from "next-themes";

import {
  ReactQueryDevtools,
} from "@tanstack/react-query-devtools";

import { queryClient } from "@/lib/query/queryClient";
import AuthProvider from "@/providers/AuthProvider";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({
  children,
}: ProvidersProps) {

  const [client] = useState(() => queryClient());

  return (
    <QueryClientProvider client={client}>

      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>

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
