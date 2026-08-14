"use client";

import { useQuery } from "@tanstack/react-query";
import { getCompanyNews, getMarketNews } from "@/lib/finnhub/endpoints";
import { queryKeys } from "@/lib/query-keys";

export function useCompanyNews(symbol: string) {
  return useQuery({
    queryKey: queryKeys.companyNews(symbol),
    queryFn: () => getCompanyNews(symbol),
    staleTime: 5 * 60_000,
    enabled: Boolean(symbol),
  });
}

export function useMarketNews() {
  return useQuery({
    queryKey: queryKeys.marketNews(),
    queryFn: () => getMarketNews(),
    staleTime: 5 * 60_000,
  });
}
