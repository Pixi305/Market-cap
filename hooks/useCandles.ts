"use client";

import { useQuery } from "@tanstack/react-query";
import { getCandles } from "@/lib/finnhub/endpoints";
import { queryKeys } from "@/lib/query-keys";
import type { ChartRange } from "@/lib/finnhub/types";

export function useCandles(symbol: string, range: ChartRange) {
  return useQuery({
    queryKey: queryKeys.candles(symbol, range),
    queryFn: () => getCandles(symbol, range),
    staleTime: 60_000,
    enabled: Boolean(symbol),
  });
}
