"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock3, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ApplyLaterButton({
  jobListingId,
  className,
}: {
  jobListingId: string;
  className?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function applyLater() {
    setLoading(true);
    try {
      // Save first so it appears in shortlist
      await fetch("/api/employment/jobs/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobListingId }),
      });

      const res = await fetch("/api/employment/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "apply_later", jobListingId }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message ?? "Could not queue application");
      }

      toast.success("Saved for later — draft application created");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not apply later");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => void applyLater()}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900 disabled:opacity-50",
        className,
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
      ) : (
        <Clock3 className="h-4 w-4" strokeWidth={1.75} />
      )}
      Apply later
    </button>
  );
}
