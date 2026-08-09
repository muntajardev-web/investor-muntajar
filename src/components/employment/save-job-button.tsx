"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SaveJobButton({
  jobListingId,
  initiallySaved = false,
  className,
}: {
  jobListingId: string;
  initiallySaved?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initiallySaved);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      if (saved) {
        const res = await fetch("/api/employment/jobs/saved", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobListingId }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json?.error?.message);
        setSaved(false);
        toast.success("Removed from saved jobs");
      } else {
        const res = await fetch("/api/employment/jobs/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobListingId }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json?.error?.message);
        setSaved(true);
        toast.success("Job saved");
      }
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={toggle}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900 disabled:opacity-50",
        className,
      )}
    >
      {saved ? (
        <BookmarkCheck className="h-4 w-4 text-orange-600" strokeWidth={1.75} />
      ) : (
        <Bookmark className="h-4 w-4" strokeWidth={1.75} />
      )}
      {saved ? "Saved" : "Save"}
    </button>
  );
}
