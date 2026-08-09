import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sectionVariants = cva("relative", {
  variants: {
    padding: {
      default: "section-padding",
      sm: "section-padding-sm",
      none: "",
    },
    background: {
      default: "bg-background",
      muted: "bg-muted",
      card: "bg-card",
      gradient: "bg-stone-100",
      warm: "bg-stone-50",
    },
  },
  defaultVariants: {
    padding: "default",
    background: "default",
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: "section" | "div" | "article";
}

export function Section({
  className,
  padding,
  background,
  as: Component = "section",
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn(sectionVariants({ padding, background }), className)}
      {...props}
    />
  );
}
