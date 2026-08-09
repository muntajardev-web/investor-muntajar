import * as React from "react";
import { cn } from "@/lib/utils";

export interface OverlineProps extends React.HTMLAttributes<HTMLSpanElement> {
  accent?: boolean;
}

export function Overline({
  className,
  accent = false,
  ...props
}: OverlineProps) {
  return (
    <span
      className={cn(
        "text-overline font-medium uppercase tracking-[0.15em]",
        accent ? "text-orange-500" : "text-stone-500",
        className,
      )}
      {...props}
    />
  );
}
