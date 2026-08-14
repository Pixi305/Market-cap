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
  { href: "/pricing", label: "Upgrade", icon: Zap },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-neutral-200/70 bg-surface py-2 sm:hidden">
      {items.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] font-medium",
              active ? "text-neutral-900" : "text-neutral-400",
            )}
          >
            <Icon size={20} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
