export default function EmploymentDashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3 border-b border-stone-200 pb-6">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-stone-200" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded bg-stone-100" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-xl border border-stone-200 bg-white"
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-xl border border-stone-200 bg-white"
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-56 animate-pulse rounded-xl border border-stone-200 bg-white"
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-xl border border-stone-200 bg-white"
          />
        ))}
      </div>

      <div className="h-64 animate-pulse rounded-xl border border-stone-200 bg-white" />
    </div>
  );
}
