import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva("text-stone-900 font-sans tracking-tight", {
  variants: {
    size: {
      xl: "text-4xl md:text-[2.5rem] leading-tight",
      lg: "text-3xl md:text-[2rem] leading-tight",
      md: "text-2xl md:text-[1.5rem] leading-snug",
      sm: "text-xl leading-snug",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
    },
  },
  defaultVariants: {
    size: "lg",
    weight: "semibold",
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function Heading({
  className,
  size,
  weight,
  as: Component = "h2",
  ...props
}: HeadingProps) {
  return (
    <Component
      className={cn(headingVariants({ size, weight }), className)}
      {...props}
    />
  );
}
