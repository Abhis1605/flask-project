import { QueryClient } from '@tanstack/react-query';
// import { toast } from '@/components/ui/toast'; 
import { ApiError } from '@/lib/errors/ApiError';

export function queryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,       // 1 min — tune per-module with overrides if needed
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        onError: (error) => {
          const message = error instanceof ApiError ? error.message : 'Request failed';
        //   toast.error(message);
        },
      },
    },
  });
}