"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EDUCATION_LEVELS } from "@/lib/employment/constants";
import type { EducationEntry, ProfilePatch } from "@/lib/employment/profile/types";
import { SectionShell } from "../section-shell";

type Props = {
  value: EducationEntry[];
  complete?: boolean;
  onChange: (patch: ProfilePatch) => void;
};

const empty = (): EducationEntry => ({
  level: "Bachelor",
  institution: "",
  graduationYear: "",
  gpa: "",
});

export function EducationSection({ value, complete, onChange }: Props) {
  const rows = value.length ? value : [empty()];

  function update(next: EducationEntry[]) {
    onChange({ education: next });
  }

  return (
    <SectionShell
      id="education"
      title="Education"
      description="Academic and technical qualifications."
      complete={complete}
    >
      <div className="space-y-4">
        {rows.map((row, index) => (
          <div
            key={index}
            className="rounded-xl border border-stone-200 bg-stone-50/50 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-stone-900">
                Education {index + 1}
              </p>
              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => update(rows.filter((_, i) => i !== index))}
                  className="text-stone-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Level</Label>
                <select
                  value={row.level ?? ""}
                  onChange={(e) =>
                    update(
                      rows.map((item, i) =>
                        i === index ? { ...item, level: e.target.value } : item,
                      ),
                    )
                  }
                  className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm"
                >
                  {EDUCATION_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Institution</Label>
                <Input
                  value={row.institution ?? ""}
                  onChange={(e) =>
                    update(
                      rows.map((item, i) =>
                        i === index
                          ? { ...item, institution: e.target.value }
                          : item,
                      ),
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Graduation Year</Label>
                <Input
                  value={String(row.graduationYear ?? "")}
                  onChange={(e) =>
                    update(
                      rows.map((item, i) =>
                        i === index
                          ? { ...item, graduationYear: e.target.value }
                          : item,
                      ),
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>GPA</Label>
                <Input
                  value={String(row.gpa ?? "")}
                  onChange={(e) =>
                    update(
                      rows.map((item, i) =>
                        i === index ? { ...item, gpa: e.target.value } : item,
                      ),
                    )
                  }
                />
              </div>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => update([...rows, empty()])}>
          <Plus className="mr-2 h-4 w-4" />
          Add education
        </Button>
      </div>
    </SectionShell>
  );
}
