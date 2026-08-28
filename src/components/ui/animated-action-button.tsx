"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedActionButtonProps {
  text: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "dark";
  icon?: "arrowUpRight" | "arrowRight";
  size?: "default" | "sm" | "lg";
}

export function AnimatedActionButton({
  text,
  href,
  onClick,
  className,
  variant = "primary",
  icon = "arrowUpRight",
  size = "default",
}: AnimatedActionButtonProps) {
  const isPrimary = variant === "primary";

  const content = (
    <Button
      type="button"
      onClick={onClick}
      className={cn(
        "group not-disabled:inset-shadow-none inline-flex cursor-pointer items-center justify-center gap-0 rounded-full border-none bg-transparent p-0 font-bold shadow-none hover:bg-transparent active:bg-transparent [:hover,[data-pressed]]:bg-transparent select-none max-w-full",
        className
      )}
    >
      <span
        className={cn(
          "rounded-full px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider duration-500 ease-in-out transition-all shrink-0",
          isPrimary
            ? "bg-[#EA580C] text-white group-hover:bg-stone-950 group-hover:text-white shadow-sm"
            : "bg-stone-950 text-white group-hover:bg-[#EA580C] group-hover:text-white shadow-sm",
          size === "sm" && "px-3.5 py-2 text-xs",
          size === "lg" && "px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-base"
        )}
      >
        {text}
      </span>
      <div
        className={cn(
          "relative flex h-fit cursor-pointer items-center overflow-hidden rounded-full p-3 sm:p-3.5 duration-500 ease-in-out transition-all shrink-0",
          isPrimary
            ? "bg-[#EA580C] text-white group-hover:bg-stone-950 group-hover:text-white shadow-sm"
            : "bg-stone-950 text-white group-hover:bg-[#EA580C] group-hover:text-white shadow-sm",
          size === "sm" && "p-2",
          size === "lg" && "p-3.5 sm:p-4.5"
        )}
      >
        {icon === "arrowUpRight" ? (
          <>
            <ArrowUpRight className="absolute h-4 w-4 sm:h-5 sm:w-5 -translate-x-1/2 transition-all duration-500 ease-in-out group-hover:translate-x-10" />
            <ArrowUpRight className="absolute h-4 w-4 sm:h-5 sm:w-5 -translate-x-10 transition-all duration-500 ease-in-out group-hover:-translate-x-1/2" />
          </>
        ) : (
          <>
            <ArrowRight className="absolute h-4 w-4 sm:h-5 sm:w-5 -translate-x-1/2 transition-all duration-500 ease-in-out group-hover:translate-x-10" />
            <ArrowRight className="absolute h-4 w-4 sm:h-5 sm:w-5 -translate-x-10 transition-all duration-500 ease-in-out group-hover:-translate-x-1/2" />
          </>
        )}
      </div>
    </Button>
  );

  if (href) {
    if (href.startsWith("http") || href.startsWith("https")) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block">
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}

export default AnimatedActionButton;
