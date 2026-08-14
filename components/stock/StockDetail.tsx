"use client";

import type { CompanyProfile } from "@/lib/finnhub/types";
import { useQuote } from "@/hooks/useQuote";
import { useCompanyNews } from "@/hooks/useCompanyNews";
import { QuoteHeader } from "./QuoteHeader";
import { KeyStatsGrid } from "./KeyStatsGrid";
import { PriceChart } from "./PriceChart";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { WatchlistButton } from "./WatchlistButton";
import { NewsList } from "@/components/news/NewsList";

export function StockDetail({ profile }: { profile: CompanyProfile }) {
  const { data: quote } = useQuote(profile.symbol);
  const { data: news, isLoading: newsLoading } = useCompanyNews(profile.symbol);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Card>
        <div className="flex items-start justify-between gap-4">
          <QuoteHeader profile={profile} quote={quote} />
        </div>
        <div className="mt-4">
          <WatchlistButton symbol={profile.symbol} />
        </div>
      </Card>

      <PriceChart symbol={profile.symbol} />

      <KeyStatsGrid profile={profile} quote={quote} />

      <Card>
        <h2 className="mb-2 text-sm font-medium text-neutral-500">News about {profile.symbol}</h2>
        {newsLoading || !news ? (
          <div className="space-y-4 py-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <NewsList items={news} />
        )}
      </Card>
    </div>
  );
}
