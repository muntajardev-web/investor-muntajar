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

interface StatBlockProps {
  label: string;
  value: string | number;
  hint?: string;
  className?: string;
}

export function StatBlock({ label, value, hint, className }: StatBlockProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <p className="text-sm font-medium text-stone-500">{label}</p>
      <p className="text-3xl font-semibold tabular-nums text-stone-900">
        {value}
      </p>
      {hint && <p className="text-base text-stone-600">{hint}</p>}
    </div>
  );
}
