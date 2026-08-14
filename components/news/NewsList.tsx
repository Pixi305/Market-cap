import type { NewsItem } from "@/lib/finnhub/types";
import { NewsCard } from "./NewsCard";

export function NewsList({ items }: { items: NewsItem[] }) {
  if (items.length === 0) {
    return <p className="py-6 text-center text-sm text-neutral-400">No news available.</p>;
  }

  return (
    <div className="divide-y divide-neutral-100">
      {items.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  );
}
