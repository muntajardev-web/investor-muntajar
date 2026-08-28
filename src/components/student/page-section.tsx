import { cn } from "@/lib/utils";

interface PageSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function PageSection({
  title,
  description,
  children,
  className,
}: PageSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h2 className="text-xl font-semibold text-stone-900 sm:text-2xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-base text-stone-600">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
