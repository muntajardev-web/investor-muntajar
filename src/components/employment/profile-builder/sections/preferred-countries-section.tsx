"use client";

import { Label } from "@/components/ui/label";
import { EMPLOYMENT_COUNTRIES } from "@/lib/employment/constants";
import type { ProfilePatch } from "@/lib/employment/profile/types";
import { cn } from "@/lib/utils";
import { SectionShell } from "../section-shell";

type Props = {
  value: string[];
  complete?: boolean;
  onChange: (patch: ProfilePatch) => void;
};

export function PreferredCountriesSection({
  value,
  complete,
  onChange,
}: Props) {
  function toggle(code: string) {
    const next = value.includes(code)
      ? value.filter((c) => c !== code)
      : [...value, code];
    onChange({ preferredCountries: next });
  }

  return (
    <SectionShell
      id="preferred-countries"
      title="Preferred Countries"
      description="Where you want to work abroad."
      complete={complete}
    >
      <div className="flex flex-wrap gap-2">
        {EMPLOYMENT_COUNTRIES.map((c) => {
          const active = value.includes(c.code);
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => toggle(c.code)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                active
                  ? "border-orange-400 bg-orange-50 text-orange-900"
                  : "border-stone-200 bg-white text-stone-700 hover:border-stone-300",
              )}
            >
              {c.name}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-stone-400">
        <Label className="sr-only">Selected countries</Label>
        Selected: {value.length}
      </p>
    </SectionShell>
  );
}
