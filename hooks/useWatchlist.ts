"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { addToWatchlist as localAdd, getWatchlist as localGet, removeFromWatchlist as localRemove } from "@/lib/mock/watchlistStore";

async function fetchWatchlist(): Promise<string[]> {
  if (!isSupabaseConfigured) return localGet();
  const res = await fetch("/api/watchlist");
  if (!res.ok) return [];
  return res.json();
}

async function apiAdd(symbol: string): Promise<string[]> {
  if (!isSupabaseConfigured) return localAdd(symbol);
  const res = await fetch("/api/watchlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symbol }),
  });
  if (res.status === 403) {
    const body = await res.json();
    if (body.error === "upgrade_required") throw new Error("upgrade_required");
  }
  if (!res.ok) throw new Error("Failed to add to watchlist");
  return res.json();
}

async function apiRemove(symbol: string): Promise<string[]> {
  if (!isSupabaseConfigured) return localRemove(symbol);
  const res = await fetch(`/api/watchlist?symbol=${encodeURIComponent(symbol)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove from watchlist");
  return res.json();
}

export function useWatchlist() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.watchlist(),
    queryFn: fetchWatchlist,
  });

  const add = useMutation({
    mutationFn: apiAdd,
    onSuccess: (symbols) => queryClient.setQueryData(queryKeys.watchlist(), symbols),
  });

  const remove = useMutation({
    mutationFn: apiRemove,
    onSuccess: (symbols) => queryClient.setQueryData(queryKeys.watchlist(), symbols),
  });

  return {
    symbols: query.data ?? [],
    isLoading: query.isLoading,
    add: add.mutate,
    remove: remove.mutate,
    addError: add.error,
  };
}
