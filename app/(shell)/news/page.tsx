"use client";

import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { NewsList } from "@/components/news/NewsList";
import { useMarketNews } from "@/hooks/useCompanyNews";

export default function NewsPage() {
  const { data: news, isLoading } = useMarketNews();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-4 text-xl font-semibold text-neutral-900">Market news</h1>
      <Card>
        {isLoading || !news ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
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
