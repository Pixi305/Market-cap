"use client";

import { useState } from "react";
import Image from "next/image";
import { getLogoUrl } from "@/lib/finnhub/logo";
import { cn } from "@/lib/utils/cn";

export function CompanyLogo({
  symbol,
  size = 40,
  className,
}: {
  symbol: string;
  size?: number;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        style={{ width: size, height: size }}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl bg-neutral-900 font-bold text-white",
          size <= 40 ? "text-xs" : "text-sm",
          className,
        )}
      >
        {symbol.slice(0, 2)}
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100",
        className,
      )}
    >
      <Image
        src={getLogoUrl(symbol)}
        alt={`${symbol} logo`}
        width={size}
        height={size}
        className="h-full w-full object-contain p-1"
        onError={() => setErrored(true)}
      />
    </div>
  );
}
