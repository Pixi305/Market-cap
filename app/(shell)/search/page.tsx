"use client";

import { useState } from "react";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDebouncedValue } from "@/lib/utils/debounce";
import { useSymbolSearch } from "@/hooks/useSymbolSearch";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query, 250);
  const { data: results, isFetching } = useSymbolSearch(debounced);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-xl font-semibold text-neutral-900">Search</h1>

      <div className="relative mb-4">
        <SearchIcon
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          size={16}
        />
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search symbol or company"
          className="h-11 pl-9"
        />
      </div>

      <Card>
        {!debounced ? (
          <p className="py-6 text-center text-sm text-neutral-400">
            Start typing to find a stock.
          </p>
        ) : isFetching ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : results && results.length > 0 ? (
          <ul className="divide-y divide-neutral-100">
            {results.map((r) => (
              <li key={r.symbol}>
                <Link
                  href={`/stock/${r.symbol}`}
                  className="flex items-center justify-between py-3 hover:opacity-70"
                >
                  <span>
                    <span className="font-medium text-neutral-900">{r.symbol}</span>
                    <span className="ml-2 text-sm text-neutral-500">{r.name}</span>
                  </span>
                  <span className="text-xs text-neutral-400">{r.exchange}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-6 text-center text-sm text-neutral-400">
            No matches for &ldquo;{debounced}&rdquo;
          </p>
        )}
      </Card>
    </div>
  );
}
