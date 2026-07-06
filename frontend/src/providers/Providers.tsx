"use client";

import { ReactNode, useState } from "react";

import {
  QueryClientProvider,
} from "@tanstack/react-query";

import { Toaster } from 'sonner'

import {
  ReactQueryDevtools,
} from "@tanstack/react-query-devtools";

import { queryClient } from "@/lib/query/queryClient";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({
  children,
}: ProvidersProps) {

  const [client] = useState(() => queryClient());

  return (
    <QueryClientProvider client={client}>

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