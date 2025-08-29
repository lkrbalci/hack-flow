// lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute

      refetchOnWindowFocus: false,

      retry: false,
    },
  },
});

export default queryClient;
