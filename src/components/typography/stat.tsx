"use client";

import * as React from "react";
import CountUp from "react-countup";
import { cn } from "@/lib/utils";

export interface StatProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  decimals?: number;
  className?: string;
  duration?: number;
}

export function Stat({
  value,
  suffix = "",
  prefix = "",
  label,
  decimals = 0,
  className,
  duration = 2.5,
}: StatProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="font-mono text-4xl md:text-5xl font-medium tracking-tight text-orange-500 tabular-nums">
        {prefix}
        {mounted ? (
          <CountUp
            end={value}
            duration={duration}
            decimals={decimals}
            separator=","
            useEasing
          />
        ) : (
          "0"
        )}
        {suffix}
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
