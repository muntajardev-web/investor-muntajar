"use client";

import { PREFERRED_INDUSTRIES } from "@/lib/employment/constants";
import type { ProfilePatch } from "@/lib/employment/profile/types";
import { cn } from "@/lib/utils";
import { SectionShell } from "../section-shell";

type Props = {
  value: string[];
  complete?: boolean;
  onChange: (patch: ProfilePatch) => void;
};

export function PreferredIndustriesSection({
  value,
  complete,
  onChange,
}: Props) {
  function toggle(industry: string) {
    const next = value.includes(industry)
      ? value.filter((i) => i !== industry)
      : [...value, industry];
    onChange({ preferredIndustries: next });
  }

  return (
    <SectionShell
      id="preferred-industries"
      title="Preferred Industries"
      description="Sectors you want to work in abroad."
      complete={complete}
    >
      <div className="flex flex-wrap gap-2">
        {PREFERRED_INDUSTRIES.map((industry) => {
          const active = value.includes(industry);
          return (
            <button
              key={industry}
              type="button"
              onClick={() => toggle(industry)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                active
                  ? "border-orange-400 bg-orange-50 text-orange-900"
                  : "border-stone-200 bg-white text-stone-700 hover:border-stone-300",
              )}
            >
              {industry}
            </button>
          );
        })}
      </div>
    </SectionShell>
  );
}
