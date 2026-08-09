import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  inactive: "bg-stone-500/10 text-stone-600 dark:text-stone-400",
  rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
  draft: "bg-stone-500/10 text-stone-500",
  submitted: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  scheduled: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  approved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status.toLowerCase().replace(/_/g, "-");
  const variant =
    variants[key] ?? variants[status.toLowerCase()] ?? variants.inactive;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium capitalize",
        variant,
        className,
      )}
    >
      {status.replace(/_/g, " ").toLowerCase()}
    </span>
  );
}
