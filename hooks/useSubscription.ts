"use client";

import { useQuery } from "@tanstack/react-query";

interface SubscriptionData {
  plan: "free" | "pro";
  status: string;
  current_period_end: string | null;
  authenticated: boolean;
}

export function useSubscription() {
  const query = useQuery<SubscriptionData>({
    queryKey: ["subscription"],
    queryFn: async () => {
      const res = await fetch("/api/subscription");
      if (!res.ok) return { plan: "free", status: "active", current_period_end: null, authenticated: false };
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const data = query.data;
  return {
    plan: data?.plan ?? "free",
    isPro: data?.plan === "pro" && data?.status === "active",
    isAuthenticated: data?.authenticated ?? false,
    currentPeriodEnd: data?.current_period_end ?? null,
    isLoading: query.isLoading,
  };
}
