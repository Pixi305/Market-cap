import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
  {
    variants: {
      intent: {
        primary: "bg-neutral-900 text-white hover:bg-neutral-800",
        brand: "bg-brand-500 text-white hover:bg-brand-600",
        secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
        ghost: "bg-transparent text-neutral-700 hover:bg-neutral-100",
        destructive: "bg-danger-500 text-white hover:bg-danger-600",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, intent, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ intent, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
