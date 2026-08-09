import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function Panel({ children, className, href, padding = "md" }: PanelProps) {
  const classes = cn(
    "rounded-xl border border-stone-200/80 bg-white",
    paddingMap[padding],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cn(classes, "block transition-colors hover:border-stone-300")}>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
}

/** @deprecated use Panel */
export const DashboardCard = Panel;

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  href: string;
  description?: string;
}

export function QuickAction({ icon: Icon, label, href, description }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3.5 rounded-xl border border-stone-200/80 bg-white px-4 py-3.5 transition-colors hover:border-stone-300"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-50 text-stone-500 transition-colors group-hover:bg-stone-100 group-hover:text-stone-700">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-stone-900">{label}</p>
        {description && (
          <p className="mt-0.5 truncate text-xs text-stone-500">{description}</p>
        )}
      </div>
    </Link>
  );
}

interface ProgressBarProps {
  value: number;
  label?: string;
  className?: string;
}

export function ProgressBar({ value, label, className }: ProgressBarProps) {
  return (
    <div className={className}>
      {label && (
        <div className="mb-2 flex justify-between text-xs">
          <span className="text-stone-500">{label}</span>
          <span className="tabular-nums text-stone-700">{value}%</span>
        </div>
      )}
      <div className="h-1.5 overflow-hidden rounded-full bg-stone-100">
        <div
          className="h-full rounded-full bg-orange-500 transition-all duration-700 ease-out"
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}

interface ScoreRingProps {
  value: number;
  size?: number;
  label?: string;
}

export function ScoreRing({ value, size = 120, label }: ScoreRingProps) {
  const stroke = 3;
  const radius = (size - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-stone-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-stone-900 transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-medium tabular-nums tracking-tight text-stone-900">
          {value}
        </span>
        {label && (
          <span className="mt-0.5 text-[10px] uppercase tracking-widest text-stone-400">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

interface ChanceBadgeProps {
  level: string;
  className?: string;
}

const chanceStyles: Record<string, string> = {
  high: "text-emerald-700 bg-emerald-50",
  medium: "text-amber-700 bg-amber-50",
  low: "text-stone-600 bg-stone-100",
  insufficient_data: "text-stone-500 bg-stone-50",
};

export function ChanceBadge({ level, className }: ChanceBadgeProps) {
  const key = level.toLowerCase().replace(/ /g, "_");
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium capitalize",
        chanceStyles[key] ?? chanceStyles.low,
        className,
      )}
    >
      {level.replace(/_/g, " ")}
    </span>
  );
}

interface DataRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export function DataRow({ label, value, className }: DataRowProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 py-3", className)}>
      <span className="text-[13px] text-stone-500">{label}</span>
      <span className="text-right text-[13px] font-medium text-stone-900">{value}</span>
    </div>
  );
}

interface ListRowProps {
  children: React.ReactNode;
  className?: string;
}

export function ListRow({ children, className }: ListRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 border-b border-stone-100 py-4 last:border-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
