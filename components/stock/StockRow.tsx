import Link from "next/link";
import { X } from "lucide-react";
import type { Quote } from "@/lib/finnhub/types";
import { PriceChangeBadge } from "./PriceChangeBadge";
import { CompanyLogo } from "./CompanyLogo";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export function StockRow({
  symbol,
  name,
  quote,
  onRemove,
  rightSlot,
}: {
  symbol: string;
  name?: string;
  quote: Quote | undefined;
  onRemove?: () => void;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="group flex items-center justify-between gap-4 py-3">
      <Link href={`/stock/${symbol}`} className="flex min-w-0 items-center gap-3">
        <CompanyLogo symbol={symbol} size={36} />
        <div className="min-w-0">
          <p className="text-sm font-medium text-neutral-900">{symbol}</p>
          {name && <p className="truncate text-xs text-neutral-400">{name}</p>}
        </div>
      </Link>

      <div className="flex items-center gap-4">
        {quote ? (
          <div className="text-right">
            <p className="text-sm font-medium text-neutral-900 tabular-nums">
              {formatCurrency(quote.price)}
            </p>
            <PriceChangeBadge
              change={quote.change}
              changePercent={quote.changePercent}
              className="mt-0.5"
            />
          </div>
        ) : (
          <div className="space-y-1 text-right">
            <Skeleton className="ml-auto h-4 w-16" />
            <Skeleton className="ml-auto h-4 w-14" />
          </div>
        )}

        {rightSlot}

        {onRemove && (
          <button
            onClick={onRemove}
            className="text-neutral-300 opacity-0 transition-opacity hover:text-danger-500 group-hover:opacity-100"
            aria-label={`Remove ${symbol}`}
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
