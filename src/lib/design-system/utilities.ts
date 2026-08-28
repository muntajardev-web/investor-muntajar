import { cn } from "@/lib/utils";

/** Shared focus ring — WCAG-visible, brand-colored */
export const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Standard elevated surface */
export const surface = cn(
  "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
);

/** Interactive hover for list rows / cards */
export const interactive = cn(
  "transition-colors duration-150",
  "hover:bg-muted/60",
  focusRing,
);
