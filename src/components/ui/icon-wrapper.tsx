import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const iconWrapperVariants = cva(
  "inline-flex items-center justify-center shrink-0",
  {
    variants: {
      variant: {
        default: "text-stone-600",
        accent: "text-orange-500",
        muted: "text-stone-400",
        dark: "text-stone-900",
        white: "text-white",
      },
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-14 w-14",
      },
      background: {
        none: "",
        subtle: "bg-stone-100 rounded-lg",
        accent: "bg-orange-50 rounded-lg",
        dark: "bg-stone-900 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      background: "none",
    },
  },
);

export interface IconWrapperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof iconWrapperVariants> {
  icon: LucideIcon;
  iconSize?: number;
}

export function IconWrapper({
  icon: Icon,
  variant,
  size,
  background,
  iconSize,
  className,
  ...props
}: IconWrapperProps) {
  const defaultIconSize =
    size === "sm" ? 16 : size === "lg" ? 24 : size === "xl" ? 28 : 20;

  return (
    <div
      className={cn(iconWrapperVariants({ variant, size, background }), className)}
      {...props}
    >
      <Icon size={iconSize ?? defaultIconSize} strokeWidth={1.75} />
    </div>
  );
}
