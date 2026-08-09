"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  ExperienceEntry,
  ProfilePatch,
} from "@/lib/employment/profile/types";
import { SectionShell } from "../section-shell";

type Props = {
  value: ExperienceEntry[];
  complete?: boolean;
  onChange: (patch: ProfilePatch) => void;
};

const empty = (): ExperienceEntry => ({
  employer: "",
  position: "",
  years: "",
  responsibilities: "",
  isCurrent: false,
  hasCertificate: false,
  hasReference: false,
});

export function ExperienceSection({ value, complete, onChange }: Props) {
  const rows = value.length ? value : [{ ...empty(), isCurrent: true }];

  function update(next: ExperienceEntry[]) {
    onChange({ experience: next });
  }

  return (
    <SectionShell
      id="experience"
      title="Work Experience"
      description="Current and previous jobs."
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
                {row.isCurrent ? "Current job" : `Job ${index + 1}`}
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
                <Label>Employer</Label>
                <Input
                  value={row.employer ?? ""}
                  onChange={(e) =>
                    update(
                      rows.map((item, i) =>
                        i === index
                          ? { ...item, employer: e.target.value }
                          : item,
                      ),
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input
                  value={row.position ?? ""}
                  onChange={(e) =>
                    update(
                      rows.map((item, i) =>
                        i === index
                          ? { ...item, position: e.target.value }
                          : item,
                      ),
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Years of Experience</Label>
                <Input
                  value={String(row.years ?? "")}
                  onChange={(e) =>
                    update(
                      rows.map((item, i) =>
                        i === index ? { ...item, years: e.target.value } : item,
                      ),
                    )
                  }
                />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Label>Responsibilities</Label>
              <textarea
                rows={3}
                value={row.responsibilities ?? ""}
                onChange={(e) =>
                  update(
                    rows.map((item, i) =>
                      i === index
                        ? { ...item, responsibilities: e.target.value }
                        : item,
                    ),
                  )
                }
                className="w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-700">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!row.isCurrent}
                  onChange={(e) =>
                    update(
                      rows.map((item, i) =>
                        i === index
                          ? { ...item, isCurrent: e.target.checked }
                          : item,
                      ),
                    )
                  }
                />
                Current job
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!row.hasCertificate}
                  onChange={(e) =>
                    update(
                      rows.map((item, i) =>
                        i === index
                          ? { ...item, hasCertificate: e.target.checked }
                          : item,
                      ),
                    )
                  }
                />
                Employment certificate
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!row.hasReference}
                  onChange={(e) =>
                    update(
                      rows.map((item, i) =>
                        i === index
                          ? { ...item, hasReference: e.target.checked }
                          : item,
                      ),
                    )
                  }
                />
                Reference letter
              </label>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => update([...rows, empty()])}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add job
        </Button>
      </div>
    </SectionShell>
  );
}
