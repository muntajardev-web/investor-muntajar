"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Tooltip({ children, open }: { children: React.ReactNode; open?: boolean }) {
  return <div className="relative inline-block">{children}</div>;
}

export function TooltipTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  return <>{children}</>;
}

export function TooltipContent({
  className,
  children,
  sideOffset = 4,
  showArrow = false,
}: {
  className?: string;
  children: React.ReactNode;
  sideOffset?: number;
  showArrow?: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 rounded-lg bg-stone-900 px-3 py-1.5 text-xs text-white shadow-md animate-in fade-in-0 zoom-in-95",
        className
      )}
    >
      {children}
    </div>
  );
}
