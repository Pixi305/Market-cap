"use client";

import { useQuery } from "@tanstack/react-query";
import { getCompanyProfile } from "@/lib/finnhub/endpoints";
import { queryKeys } from "@/lib/query-keys";

export function useCompanyProfile(symbol: string) {
  return useQuery({
    queryKey: queryKeys.companyProfile(symbol),
    queryFn: () => getCompanyProfile(symbol),
    staleTime: 5 * 60_000,
    enabled: Boolean(symbol),
  });
}
