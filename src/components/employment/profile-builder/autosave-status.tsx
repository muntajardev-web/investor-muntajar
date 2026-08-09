"use client";

import { Loader2, Check } from "lucide-react";

export function AutosaveStatus({
  saving,
  lastSavedAt,
  error,
  completion,
}: {
  saving: boolean;
  lastSavedAt: Date | null;
  error: string | null;
  completion: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500">
      <span className="tabular-nums font-medium text-stone-800">
        {completion}% complete
      </span>
      <span className="text-stone-300">·</span>
      {error ? (
        <span className="text-red-600">{error}</span>
      ) : saving ? (
        <span className="inline-flex items-center gap-1.5">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Saving…
        </span>
      ) : lastSavedAt ? (
        <span className="inline-flex items-center gap-1.5 text-emerald-700">
          <Check className="h-3.5 w-3.5" />
          Saved
        </span>
      ) : (
        <span>Changes autosave</span>
      )}
    </div>
  );
}
