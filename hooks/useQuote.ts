"use client";

import { useQuery } from "@tanstack/react-query";
import { getQuote, getQuotesBatch } from "@/lib/finnhub/endpoints";
import { queryKeys } from "@/lib/query-keys";

const POLL_INTERVAL_MS = 15_000;

export function useQuote(symbol: string) {
  return useQuery({
    queryKey: queryKeys.quote(symbol),
    queryFn: () => getQuote(symbol),
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
    enabled: Boolean(symbol),
  });
}

export function useQuotesBatch(symbols: string[]) {
  return useQuery({
    queryKey: queryKeys.quotesBatch(symbols),
    queryFn: () => getQuotesBatch(symbols),
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
    enabled: symbols.length > 0,
  });
}
