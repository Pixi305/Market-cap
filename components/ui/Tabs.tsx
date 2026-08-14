"use client";

import { cn } from "@/lib/utils/cn";

export interface TabsProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: readonly { value: T; label: string }[];
  className?: string;
}

export function Tabs<T extends string>({ value, onChange, options, className }: TabsProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-neutral-100 p-1",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-neutral-900 text-white"
                : "text-neutral-500 hover:text-neutral-900",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
