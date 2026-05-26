import { useQuery } from "@tanstack/react-query";
import { getConfig } from "../api/config";

// hooks/useConfig.ts
export const useConfig = () => {
  return useQuery({
    queryKey: ["config"],
    queryFn: getConfig,
    staleTime: Infinity, // never considered stale, won't refetch
  });
};
