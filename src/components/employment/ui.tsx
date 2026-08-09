import { cn } from "@/lib/utils";

type StatusTone = "neutral" | "accent" | "success" | "warning" | "danger";

const toneStyles: Record<StatusTone, string> = {
  neutral: "bg-stone-100 text-stone-700",
  accent: "bg-orange-50 text-orange-800",
  success: "bg-emerald-50 text-emerald-800",
  warning: "bg-amber-50 text-amber-800",
  danger: "bg-red-50 text-red-800",
};

interface StatusPillProps {
  children: React.ReactNode;
  tone?: StatusTone;
  className?: string;
}

export function StatusPill({
  children,
  tone = "neutral",
  className,
}: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-sm font-medium",
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
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

interface PanelProps {
  children: React.ReactNode;
  className?: string;
}

export function Panel({ children, className }: PanelProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-stone-200/80 bg-white p-5 sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
