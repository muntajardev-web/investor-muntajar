import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textVariants = cva("text-stone-700", {
  variants: {
    size: {
      lg: "text-lg leading-relaxed",
      md: "text-base leading-relaxed",
      sm: "text-sm leading-relaxed",
    },
    tone: {
      default: "text-stone-700",
      muted: "text-muted-foreground",
      dark: "text-stone-900",
      accent: "text-orange-600",
    },
  },
  defaultVariants: {
    size: "md",
    tone: "default",
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div";
}

export function Text({
  className,
  size,
  tone,
  as: Component = "p",
  ...props
}: TextProps) {
  return (
    <Component
      className={cn(textVariants({ size, tone }), className)}
      {...props}
    />
  );
}
