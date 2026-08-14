"use client";

import { useQuery } from "@tanstack/react-query";
import { searchSymbols } from "@/lib/finnhub/endpoints";
import { queryKeys } from "@/lib/query-keys";

export function useSymbolSearch(query: string) {
  return useQuery({
    queryKey: queryKeys.search(query),
    queryFn: () => searchSymbols(query),
    enabled: query.trim().length > 0,
    staleTime: 30_000,
  });
}
