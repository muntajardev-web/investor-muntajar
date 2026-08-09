"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EMPLOYMENT_LANGUAGE_OPTIONS } from "@/lib/employment/constants";
import { cn } from "@/lib/utils";

type Lang = { language: string; level: string; score: string };

export function LanguagesForm({ initial }: { initial?: Lang[] | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>(
    initial?.map((l) => l.language).filter(Boolean) ?? ["English"],
  );
  const [details, setDetails] = useState<Record<string, { level: string; score: string }>>(
    () => {
      const map: Record<string, { level: string; score: string }> = {};
      for (const item of initial ?? []) {
        if (item.language) {
          map[item.language] = {
            level: item.level ?? "",
            score: item.score ?? "",
          };
        }
      }
      return map;
    },
  );

  function toggle(lang: string) {
    setSelected((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    );
  }

  async function save() {
    setLoading(true);
    const languages = selected.map((language) => ({
      language,
      level: details[language]?.level ?? "",
      score: details[language]?.score ?? "",
    }));
    try {
      const res = await fetch("/api/employment/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ languages, workflowStep: 6 }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message);
      toast.success("Languages saved");
      router.push("/work/employment/documents");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {EMPLOYMENT_LANGUAGE_OPTIONS.map((lang) => {
          const active = selected.includes(lang);
          return (
            <button
              key={lang}
              type="button"
              onClick={() => toggle(lang)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                active
                  ? "border-orange-400 bg-orange-50 text-orange-900"
                  : "border-stone-200 bg-white text-stone-700 hover:border-stone-300",
              )}
            >
              {lang}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {selected.map((lang) => (
          <div
            key={lang}
            className="grid gap-4 rounded-xl border border-stone-200 bg-white p-4 sm:grid-cols-3"
          >
            <p className="text-sm font-semibold text-stone-900 sm:col-span-3">
              {lang}
            </p>
            <div className="space-y-2">
              <Label>Level</Label>
              <Input
                placeholder="e.g. Intermediate / B1"
                value={details[lang]?.level ?? ""}
                onChange={(e) =>
                  setDetails((d) => ({
                    ...d,
                    [lang]: {
                      level: e.target.value,
                      score: d[lang]?.score ?? "",
                    },
                  }))
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Score / Certificate</Label>
              <Input
                placeholder="e.g. IELTS 6.5"
                value={details[lang]?.score ?? ""}
                onChange={(e) =>
                  setDetails((d) => ({
                    ...d,
                    [lang]: {
                      level: d[lang]?.level ?? "",
                      score: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>
        ))}
      </div>

      <Button onClick={save} disabled={loading} size="lg">
        {loading ? "Saving…" : "Save & continue"}
      </Button>
    </div>
  );
}
