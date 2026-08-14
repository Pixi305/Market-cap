"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Star, Briefcase, Newspaper, Zap } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/watchlist", label: "Watchlist", icon: Star },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/pricing", label: "Pricing", icon: Zap },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-16 shrink-0 flex-col items-center gap-2 border-r border-neutral-200/70 bg-surface py-4 sm:flex">
      <Link
        href="/"
        className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white"
      >
        M
      </Link>

      <nav className="flex flex-col items-center gap-1">
        {items.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                active
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700",
              )}
            >
              <Icon size={18} />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
