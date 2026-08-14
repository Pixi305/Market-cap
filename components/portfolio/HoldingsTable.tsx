"use client";

import { X } from "lucide-react";
import type { Holding } from "@/lib/mock/portfolioStore";
import type { Quote } from "@/lib/finnhub/types";
import { findCompany } from "@/lib/finnhub/mock-data";
import { PriceChangeBadge } from "@/components/stock/PriceChangeBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export function HoldingsTable({
  holdings,
  quotes,
  onRemove,
}: {
  holdings: Holding[];
  quotes: Record<string, Quote> | undefined;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-100 text-left text-xs text-neutral-400">
            <th className="py-2 font-medium">Symbol</th>
            <th className="py-2 font-medium">Quantity</th>
            <th className="py-2 font-medium">Avg cost</th>
            <th className="py-2 font-medium">Price</th>
            <th className="py-2 font-medium">Value</th>
            <th className="py-2 font-medium">Gain/Loss</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {holdings.map((holding) => {
            const quote = quotes?.[holding.symbol];
            const value = quote ? quote.price * holding.quantity : null;
            const costBasis = holding.avgCost != null ? holding.avgCost * holding.quantity : null;
            const gain = value != null && costBasis != null ? value - costBasis : null;
            const gainPercent = gain != null && costBasis ? (gain / costBasis) * 100 : null;

            return (
              <tr key={holding.id} className="group">
                <td className="py-3">
                  <p className="font-medium text-neutral-900">{holding.symbol}</p>
                  <p className="text-xs text-neutral-400">{findCompany(holding.symbol)?.name}</p>
                </td>
                <td className="py-3 tabular-nums text-neutral-700">{holding.quantity}</td>
                <td className="py-3 tabular-nums text-neutral-700">
                  {holding.avgCost != null ? formatCurrency(holding.avgCost) : "—"}
                </td>
                <td className="py-3 tabular-nums text-neutral-700">
                  {quote ? formatCurrency(quote.price) : <Skeleton className="h-4 w-14" />}
                </td>
                <td className="py-3 tabular-nums font-medium text-neutral-900">
                  {value != null ? formatCurrency(value) : <Skeleton className="h-4 w-16" />}
                </td>
                <td className="py-3">
                  {gain != null && gainPercent != null ? (
                    <PriceChangeBadge change={gain} changePercent={gainPercent} />
                  ) : (
                    <span className="text-xs text-neutral-300">—</span>
                  )}
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => onRemove(holding.id)}
                    className="text-neutral-300 opacity-0 transition-opacity hover:text-danger-500 group-hover:opacity-100"
                    aria-label={`Remove ${holding.symbol}`}
                  >
                    <X size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
