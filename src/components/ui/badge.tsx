import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        accent: "bg-accent-muted text-orange-600 dark:text-orange-400",
        outline: "border border-border text-muted-foreground bg-transparent",
        success: "bg-success-muted text-green-700 dark:text-green-400",
        warning: "bg-warning-muted text-amber-700 dark:text-amber-400",
        error: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
        info: "bg-info-muted text-blue-700 dark:text-blue-400",
        dark: "bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900",
      },
      size: {
        sm: "px-2 py-0.5 text-[11px] rounded-md",
        md: "px-2.5 py-0.5 text-xs rounded-lg",
        lg: "px-3 py-1 text-xs rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
