import { type HTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      intent: {
        neutral: "bg-neutral-100 text-neutral-600",
        success: "bg-success-50 text-success-600",
        danger: "bg-danger-50 text-danger-600",
        brand: "bg-brand-50 text-brand-600",
      },
    },
    defaultVariants: {
      intent: "neutral",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, intent, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ intent }), className)} {...props} />
  ),
);
Badge.displayName = "Badge";
