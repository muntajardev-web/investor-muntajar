"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EMPLOYMENT_LANGUAGE_OPTIONS } from "@/lib/employment/constants";
import type { LanguageEntry, ProfilePatch } from "@/lib/employment/profile/types";
import { cn } from "@/lib/utils";
import { SectionShell } from "../section-shell";

type Props = {
  value: LanguageEntry[];
  complete?: boolean;
  onChange: (patch: ProfilePatch) => void;
};

export function LanguagesSection({ value, complete, onChange }: Props) {
  const selected = value.map((l) => l.language).filter(Boolean) as string[];
  const [active, setActive] = useState<string[]>(
    selected.length ? selected : ["English"],
  );

  function sync(nextSelected: string[], details = value) {
    setActive(nextSelected);
    onChange({
      languages: nextSelected.map((language) => {
        const existing = details.find((d) => d.language === language);
        return {
          language,
          level: existing?.level ?? "",
          score: existing?.score ?? "",
        };
      }),
    });
  }

  function toggle(lang: string) {
    const next = active.includes(lang)
      ? active.filter((l) => l !== lang)
      : [...active, lang];
    sync(next);
  }

  return (
    <SectionShell
      id="languages"
      title="Languages"
      description="English, IELTS, TOEFL, and other languages."
      complete={complete}
    >
      <div className="flex flex-wrap gap-2">
        {EMPLOYMENT_LANGUAGE_OPTIONS.map((lang) => {
          const isOn = active.includes(lang);
          return (
            <button
              key={lang}
              type="button"
              onClick={() => toggle(lang)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                isOn
                  ? "border-orange-400 bg-orange-50 text-orange-900"
                  : "border-stone-200 bg-white text-stone-700 hover:border-stone-300",
              )}
            >
              {lang}
            </button>
          );
        })}
      </div>

      <div className="mt-4 space-y-4">
        {active.map((lang) => {
          const detail = value.find((l) => l.language === lang) ?? {
            language: lang,
            level: "",
            score: "",
          };
          return (
            <div
              key={lang}
              className="grid gap-4 rounded-xl border border-stone-200 bg-stone-50/50 p-4 sm:grid-cols-3"
            >
              <p className="text-sm font-semibold text-stone-900 sm:col-span-3">
                {lang}
              </p>
              <div className="space-y-2">
                <Label>Level</Label>
                <Input
                  placeholder="e.g. Intermediate / B1"
                  value={detail.level ?? ""}
                  onChange={(e) => {
                    const nextDetails = active.map((language) => {
                      const existing = value.find((d) => d.language === language);
                      if (language === lang) {
                        return {
                          language,
                          level: e.target.value,
                          score: existing?.score ?? "",
                        };
                      }
                      return {
                        language,
                        level: existing?.level ?? "",
                        score: existing?.score ?? "",
                      };
                    });
                    onChange({ languages: nextDetails });
                  }}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Score / Certificate</Label>
                <Input
                  placeholder="e.g. IELTS 6.5"
                  value={detail.score ?? ""}
                  onChange={(e) => {
                    const nextDetails = active.map((language) => {
                      const existing = value.find((d) => d.language === language);
                      if (language === lang) {
                        return {
                          language,
                          level: existing?.level ?? "",
                          score: e.target.value,
                        };
                      }
                      return {
                        language,
                        level: existing?.level ?? "",
                        score: existing?.score ?? "",
                      };
                    });
                    onChange({ languages: nextDetails });
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
