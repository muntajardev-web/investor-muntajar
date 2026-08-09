import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground opacity-60" />}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      {change && (
        <p className="mt-1 text-xs text-muted-foreground">{change}</p>
      )}
    </div>
  );
}
