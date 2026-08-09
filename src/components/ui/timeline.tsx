import { cn } from "@/lib/utils";

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  status?: "complete" | "current" | "upcoming";
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cn("relative space-y-0", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const status = item.status ?? "upcoming";

        return (
          <li key={item.id} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <span
                className="absolute left-[7px] top-4 h-full w-px bg-border"
                aria-hidden
              />
            )}
            <span
              className={cn(
                "relative z-10 mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                status === "complete" && "border-accent bg-accent",
                status === "current" && "border-accent bg-card",
                status === "upcoming" && "border-border bg-card",
              )}
              aria-hidden
            >
              {status === "complete" && (
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              {item.description && (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}
              {item.timestamp && (
                <time className="mt-1 block text-xs text-muted-foreground">
                  {item.timestamp}
                </time>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
