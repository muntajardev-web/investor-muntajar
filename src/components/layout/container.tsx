import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const containerVariants = cva("w-full mx-auto px-4 sm:px-6 lg:px-8", {
  variants: {
    size: {
      default: "max-w-[1440px]",
      wide: "max-w-[1720px]",
      narrow: "max-w-4xl",
      prose: "max-w-3xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export function Container({ className, size, ...props }: ContainerProps) {
  return (
    <div className={cn(containerVariants({ size }), className)} {...props} />
  );
}
