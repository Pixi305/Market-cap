import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-md border bg-surface px-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors",
        "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20",
        error ? "border-danger-500" : "border-neutral-200",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
