import { cn } from "@/lib/utils";

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  time: string;
  type?: string;
}

interface ActivityTimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function ActivityTimeline({ items, className }: ActivityTimelineProps) {
  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No activity yet
      </p>
    );
  }

  return (
    <ul className={cn("space-y-0", className)}>
      {items.map((item, i) => (
        <li key={item.id} className="relative flex gap-3 pb-6 last:pb-0">
          {i < items.length - 1 && (
            <span className="absolute left-[5px] top-3 h-full w-px bg-border" />
          )}
          <span className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-orange-500 bg-background" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{item.title}</p>
            {item.description && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {item.description}
              </p>
            )}
            <p className="mt-1 text-[11px] text-muted-foreground">{item.time}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
