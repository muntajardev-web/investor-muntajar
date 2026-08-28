import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const displayVariants = cva("text-stone-900 font-display", {
  variants: {
    size: {
      xl: "text-display-xl",
      lg: "text-display-lg",
      md: "text-display-md",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
    },
  },
  defaultVariants: {
    size: "lg",
    weight: "normal",
  },
});

export interface DisplayProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof displayVariants> {
  as?: "h1" | "h2" | "h3" | "p";
}

export function Display({
  className,
  size,
  weight,
  as: Component = "h1",
  ...props
}: DisplayProps) {
  return (
    <Component
      className={cn(displayVariants({ size, weight }), className)}
      {...props}
    />
  );
}
