"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StockRow } from "@/components/stock/StockRow";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useQuotesBatch } from "@/hooks/useQuote";
import { findCompany } from "@/lib/finnhub/mock-data";

export default function WatchlistPage() {
  const { symbols, isLoading, remove } = useWatchlist();
  const { data: quotes } = useQuotesBatch(symbols);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-4 text-xl font-semibold text-neutral-900">Watchlist</h1>

      <Card>
        {isLoading ? null : symbols.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <Star className="text-neutral-300" size={28} />
            <p className="text-sm text-neutral-500">Your watchlist is empty.</p>
            <Link href="/search" className="text-sm font-medium text-brand-600 hover:underline">
              Search for a stock to add one
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {symbols.map((symbol) => (
              <StockRow
                key={symbol}
                symbol={symbol}
                name={findCompany(symbol)?.name}
                quote={quotes?.[symbol]}
                onRemove={() => remove(symbol)}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
