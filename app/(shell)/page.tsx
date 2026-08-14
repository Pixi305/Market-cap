"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown, Star, Briefcase } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { PriceChangeBadge } from "@/components/stock/PriceChangeBadge";
import { StockRow } from "@/components/stock/StockRow";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useQuotesBatch } from "@/hooks/useQuote";
import { MOCK_COMPANIES, findCompany } from "@/lib/finnhub/mock-data";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatPercent } from "@/lib/utils/formatPercent";

const ALL_SYMBOLS = MOCK_COMPANIES.map((c) => c.symbol);

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { holdings } = usePortfolio();
  const { symbols: watchlistSymbols } = useWatchlist();

  const { data: marketQuotes } = useQuotesBatch(ALL_SYMBOLS);
  const holdingSymbols = holdings.map((h) => h.symbol);
  const { data: holdingQuotes } = useQuotesBatch(holdingSymbols);

  const totalValue = holdings.reduce((sum, h) => {
    const price = holdingQuotes?.[h.symbol]?.price;
    return price ? sum + price * h.quantity : sum;
  }, 0);

  const totalCost = holdings.reduce(
    (sum, h) => (h.avgCost != null ? sum + h.avgCost * h.quantity : sum),
    0,
  );
  const totalGain = totalCost > 0 ? totalValue - totalCost : null;
  const totalGainPercent = totalGain != null && totalCost > 0 ? (totalGain / totalCost) * 100 : null;

  const dayChangeValue = holdings.reduce((sum, h) => {
    const quote = holdingQuotes?.[h.symbol];
    return quote ? sum + quote.change * h.quantity : sum;
  }, 0);
  const dayChangePercent =
    totalValue > 0 ? (dayChangeValue / (totalValue - dayChangeValue)) * 100 : 0;

  const movers = marketQuotes
    ? MOCK_COMPANIES.map((c) => ({ company: c, quote: marketQuotes[c.symbol] }))
        .filter((m) => m.quote)
        .sort((a, b) => Math.abs(b.quote.changePercent) - Math.abs(a.quote.changePercent))
        .slice(0, 5)
    : [];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">{greeting()}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Here&apos;s how your portfolio and watchlist are doing.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="bg-brand-500 text-white shadow-none">
          <CardTitle className="text-white/80">Portfolio value</CardTitle>
          <p className="mt-2 text-3xl font-semibold tabular-nums">
            {holdings.length > 0 ? formatCurrency(totalValue) : "—"}
          </p>
          {totalGain != null && totalGainPercent != null ? (
            <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium">
              {totalGain >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {totalGain >= 0 ? "+" : ""}
              {formatCurrency(totalGain)} ({formatPercent(totalGainPercent)})
            </span>
          ) : (
            <p className="mt-3 text-xs text-white/70">Add holdings to track gain/loss</p>
          )}
        </Card>

        <Card>
          <CardTitle>Day change</CardTitle>
          <p className="mt-2 text-3xl font-semibold text-neutral-900 tabular-nums">
            {holdings.length > 0 ? formatCurrency(dayChangeValue) : "—"}
          </p>
          {holdings.length > 0 ? (
            <div className="mt-3">
              <PriceChangeBadge change={dayChangeValue} changePercent={dayChangePercent} />
            </div>
          ) : (
            <p className="mt-3 text-xs text-neutral-400">No holdings yet</p>
          )}
        </Card>

        <Card>
          <CardTitle>Watchlist</CardTitle>
          <p className="mt-2 text-3xl font-semibold text-neutral-900 tabular-nums">
            {watchlistSymbols.length}
          </p>
          <Link
            href="/watchlist"
            className="mt-3 inline-block text-xs font-medium text-brand-600 hover:underline"
          >
            {watchlistSymbols.length > 0 ? "View watchlist" : "Start a watchlist"}
          </Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-medium text-neutral-500">Market movers</h2>
          </div>
          {movers.length === 0 ? (
            <div className="space-y-3 py-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {movers.map(({ company, quote }) => (
                <StockRow key={company.symbol} symbol={company.symbol} name={company.name} quote={quote} />
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-medium text-neutral-500">Your watchlist</h2>
          </div>
          {watchlistSymbols.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Star className="text-neutral-300" size={24} />
              <p className="text-sm text-neutral-500">Nothing saved yet.</p>
              <Link href="/search" className="text-sm font-medium text-brand-600 hover:underline">
                Find a stock
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {watchlistSymbols.slice(0, 5).map((symbol) => (
                <StockRow
                  key={symbol}
                  symbol={symbol}
                  name={findCompany(symbol)?.name}
                  quote={marketQuotes?.[symbol]}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      {holdings.length === 0 && (
        <Card className="flex flex-col items-center gap-2 py-8 text-center">
          <Briefcase className="text-neutral-300" size={24} />
          <p className="text-sm text-neutral-500">You haven&apos;t added any holdings yet.</p>
          <Link href="/portfolio" className="text-sm font-medium text-brand-600 hover:underline">
            Build your portfolio
          </Link>
        </Card>
      )}
    </div>
  );
}
