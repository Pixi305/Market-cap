import { Newspaper } from "lucide-react";
import type { NewsItem } from "@/lib/finnhub/types";
import { formatRelativeTime } from "@/lib/utils/formatRelativeTime";

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-4 rounded-lg p-3 -mx-3 transition-colors hover:bg-neutral-50"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400">
        <Newspaper size={20} />
      </div>
      <div className="min-w-0">
        <p className="line-clamp-2 text-sm font-medium text-neutral-900">{item.headline}</p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400">
          <span>{item.source}</span>
          <span>&middot;</span>
          <span>{formatRelativeTime(item.datetime)}</span>
        </p>
      </div>
    </a>
  );
}
