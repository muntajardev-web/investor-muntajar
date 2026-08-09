"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EMPLOYMENT_SKILLS } from "@/lib/employment/constants";
import type { ProfilePatch } from "@/lib/employment/profile/types";
import { cn } from "@/lib/utils";
import { SectionShell } from "../section-shell";

type Props = {
  skills: string[];
  customSkills: string[];
  complete?: boolean;
  onChange: (patch: ProfilePatch) => void;
};

export function SkillsSection({
  skills,
  customSkills,
  complete,
  onChange,
}: Props) {
  const [customInput, setCustomInput] = useState("");

  function toggle(skill: string) {
    const next = skills.includes(skill)
      ? skills.filter((s) => s !== skill)
      : [...skills, skill];
    onChange({ skills: next });
  }

  function addCustom() {
    const value = customInput.trim();
    if (!value) return;
    if (!customSkills.includes(value) && !skills.includes(value)) {
      onChange({ customSkills: [...customSkills, value] });
    }
    setCustomInput("");
  }

  return (
    <SectionShell
      id="skills"
      title="Skills"
      description="Trade and professional skills."
      complete={complete}
    >
      <div className="flex flex-wrap gap-2">
        {EMPLOYMENT_SKILLS.map((skill) => {
          const active = skills.includes(skill);
          return (
            <button
              key={skill}
              type="button"
              onClick={() => toggle(skill)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                active
                  ? "border-orange-400 bg-orange-50 text-orange-900"
                  : "border-stone-200 bg-white text-stone-700 hover:border-stone-300",
              )}
            >
              {skill}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Add a custom skill"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={addCustom}>
          Add skill
        </Button>
      </div>

      {customSkills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {customSkills.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() =>
                onChange({
                  customSkills: customSkills.filter((s) => s !== skill),
                })
              }
              className="rounded-lg border border-orange-400 bg-orange-50 px-3 py-1.5 text-sm text-orange-900"
            >
              {skill} ×
            </button>
          ))}
        </div>
      )}
    </SectionShell>
  );
}
