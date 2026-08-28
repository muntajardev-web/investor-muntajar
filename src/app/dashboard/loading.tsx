export default function DashboardLoading() {
  return (
    <div className="flex h-svh bg-stone-50">
      <div className="hidden w-[280px] shrink-0 border-r border-stone-200 bg-white lg:block">
        <div className="h-16 border-b border-stone-100 px-5" />
        <div className="space-y-3 p-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-10 animate-pulse rounded-lg bg-stone-100"
            />
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="h-16 border-b border-stone-200 bg-white" />
        <div className="flex-1 space-y-4 p-6 sm:p-8">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-stone-200" />
          <div className="h-4 w-72 animate-pulse rounded bg-stone-100" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-xl border border-stone-200 bg-white"
              />
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-xl border border-stone-200 bg-white" />
        </div>
      </div>
    </div>
  );
}
