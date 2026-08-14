import type { CompanyProfile, Quote } from "@/lib/finnhub/types";
import { PriceChangeBadge } from "./PriceChangeBadge";
import { CompanyLogo } from "./CompanyLogo";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export function QuoteHeader({
  profile,
  quote,
}: {
  profile: CompanyProfile;
  quote: Quote | null | undefined;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <CompanyLogo symbol={profile.symbol} size={48} />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-neutral-900">{profile.symbol}</h1>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">
              {profile.exchange}
            </span>
          </div>
          <p className="text-sm text-neutral-500">{profile.name}</p>
        </div>
      </div>

      <div className="text-right">
        {quote ? (
          <>
            <p className="text-3xl font-semibold text-neutral-900 tabular-nums">
              {formatCurrency(quote.price, profile.currency)}
            </p>
            <div className="mt-1 flex justify-end">
              <PriceChangeBadge change={quote.change} changePercent={quote.changePercent} />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-5 w-20" />
          </div>
        )}
        <p className="mt-1 text-xs text-neutral-400">Delayed quote</p>
      </div>
    </div>
  );
}
