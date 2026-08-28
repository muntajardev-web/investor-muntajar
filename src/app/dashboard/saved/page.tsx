import Link from "next/link";
import { requireAuth } from "@/server/auth/session";
import { getSavedUniversities } from "@/lib/student/queries";
import { PageHeader, EmptyPanel } from "@/components/student";
import { Button } from "@/components/ui/button";

export default async function SavedPage() {
  const session = await requireAuth();
  const saved = await getSavedUniversities(session.user.id);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Saved"
        description="Universities you've bookmarked for later."
        action={
          <Button asChild size="sm" variant="outline">
            <Link href="/dashboard/recommendations">Browse matches</Link>
          </Button>
        }
      />

      {saved.length > 0 ? (
        <div className="divide-y divide-stone-100 rounded-xl border border-stone-200/80 bg-white">
          {saved.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-stone-900">
                  {item.university.name}
                </p>
                <p className="mt-0.5 text-xs text-stone-500">
                  {[item.university.city, item.university.country?.name]
                    .filter(Boolean)
                    .join(", ")}
                  {item.university.rankings[0] &&
                    ` · Rank #${item.university.rankings[0].rank}`}
                </p>
              </div>
              <span className="shrink-0 text-[11px] text-stone-400">
                Saved {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyPanel
          title="Nothing saved yet"
          description="Save universities from your recommendations to compare and apply later."
          action={
            <Button asChild size="sm">
              <Link href="/dashboard/recommendations">View recommendations</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
