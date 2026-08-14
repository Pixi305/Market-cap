"use client";

import { useRouter } from "next/navigation";
import { Star, Lock } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useSubscription } from "@/hooks/useSubscription";
import { cn } from "@/lib/utils/cn";

const FREE_LIMIT = 3;

export function WatchlistButton({ symbol }: { symbol: string }) {
  const router = useRouter();
  const { symbols, add, remove, addError } = useWatchlist();
  const { isPro, isAuthenticated, isLoading: subLoading } = useSubscription();
  const saved = symbols.includes(symbol);

  const hitLimit = !isPro && symbols.length >= FREE_LIMIT && !saved;
  const upgradeRequired = addError?.message === "upgrade_required" || hitLimit;

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push("/login?redirectTo=" + encodeURIComponent("/stock/" + symbol));
      return;
    }
    if (upgradeRequired) {
      router.push("/pricing");
      return;
    }
    if (saved) {
      remove(symbol);
    } else {
      add(symbol);
    }
  };

  if (!isAuthenticated && !subLoading) {
    return (
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
      >
        <Star size={14} fill="none" />
        Sign in to save
      </button>
    );
  }

  if (upgradeRequired) {
    return (
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-100"
      >
        <Lock size={14} />
        Upgrade to save more
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
        saved
          ? "border-brand-200 bg-brand-50 text-brand-600"
          : "border-neutral-200 text-neutral-600 hover:bg-neutral-50",
      )}
    >
      <Star size={14} fill={saved ? "currentColor" : "none"} />
      {saved ? "In watchlist" : "Add to watchlist"}
    </button>
  );
}
