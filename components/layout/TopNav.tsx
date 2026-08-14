import { Suspense } from "react";
import { SearchBar } from "@/components/stock/SearchBar";
import { UserMenu } from "@/components/layout/UserMenu";
import { Skeleton } from "@/components/ui/Skeleton";

export function TopNav() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-neutral-200/70 bg-surface px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">Marketcap</h1>
      </div>

      <SearchBar className="flex-1" />

      <Suspense fallback={<Skeleton className="h-9 w-9 rounded-full" />}>
        <UserMenu />
      </Suspense>
    </header>
  );
}
