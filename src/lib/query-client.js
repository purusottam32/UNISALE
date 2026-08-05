import { QueryClient } from "@tanstack/react-query";

/**
 * Marketplace inventory changes constantly, so data goes stale quickly — but we
 * do not refetch on window focus, which on a listing grid would reshuffle the
 * page under the user's cursor.
 */
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          const status = error?.response?.status;
          if (status >= 400 && status < 500) return false;
          return failureCount < 2;
        },
      },
      mutations: { retry: false },
    },
  });
