import { cn } from "@/lib/utils";

interface EmptyPanelProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyPanel({
  title,
  description,
  action,
  className,
}: EmptyPanelProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-stone-200 bg-white px-6 py-14 text-center",
        className,
      )}
    >
      <p className="text-xl font-semibold text-stone-900">{title}</p>
      <p className="mt-2 max-w-md text-base leading-relaxed text-stone-600">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
