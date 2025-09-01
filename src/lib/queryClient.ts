// lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 1 minute

      refetchOnWindowFocus: false,

      retry: 1,
    },
  },
});

export default queryClient;
