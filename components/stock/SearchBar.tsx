"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { useDebouncedValue } from "@/lib/utils/debounce";
import { useSymbolSearch } from "@/hooks/useSymbolSearch";
import { cn } from "@/lib/utils/cn";

export function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const debounced = useDebouncedValue(query, 250);
  const { data: results, isFetching } = useSymbolSearch(debounced);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  function goTo(symbol: string) {
    setOpen(false);
    setQuery("");
    router.push(`/stock/${symbol}`);
  }

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-sm", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
        size={16}
      />
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && results && results.length > 0) {
            goTo(results[0].symbol);
          }
        }}
        placeholder="Search symbol or company"
        className="h-10 w-full rounded-full border border-neutral-200 bg-neutral-50 pl-9 pr-9 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
      />
      {isFetching && debounced && (
        <Loader2
          className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-neutral-400"
          size={14}
        />
      )}

      {open && debounced && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-neutral-100 bg-surface shadow-card">
          {results && results.length > 0 ? (
            <ul>
              {results.map((r) => (
                <li key={r.symbol}>
                  <button
                    onMouseDown={() => goTo(r.symbol)}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-neutral-50"
                  >
                    <span>
                      <span className="font-medium text-neutral-900">{r.symbol}</span>
                      <span className="ml-2 text-sm text-neutral-500">{r.name}</span>
                    </span>
                    <span className="text-xs text-neutral-400">{r.exchange}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            !isFetching && (
              <p className="px-4 py-3 text-sm text-neutral-400">No matches for &ldquo;{debounced}&rdquo;</p>
            )
          )}
        </div>
      )}
    </div>
  );
}
