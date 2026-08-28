"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EDUCATION_LEVELS } from "@/lib/employment/constants";

type Edu = {
  level: string;
  institution: string;
  graduationYear: string;
  gpa: string;
};

export function EducationForm({
  initial,
}: {
  initial?: Edu[] | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Edu[]>(
    initial?.length
      ? initial.map((e) => ({
          level: e.level ?? "",
          institution: e.institution ?? "",
          graduationYear: String(e.graduationYear ?? ""),
          gpa: String(e.gpa ?? ""),
        }))
      : [{ level: "Bachelor", institution: "", graduationYear: "", gpa: "" }],
  );

  async function save() {
    setLoading(true);
    try {
      const res = await fetch("/api/employment/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ education: rows, workflowStep: 3 }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message);
      toast.success("Education saved");
      router.push("/work/employment/experience");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {rows.map((row, index) => (
        <div
          key={index}
          className="rounded-xl border border-stone-200 bg-white p-4 sm:p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-stone-900">
              Education {index + 1}
            </p>
            {rows.length > 1 && (
              <button
                type="button"
                onClick={() => setRows((r) => r.filter((_, i) => i !== index))}
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
                value={row.level}
                onChange={(e) =>
                  setRows((r) =>
                    r.map((item, i) =>
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
                value={row.institution}
                onChange={(e) =>
                  setRows((r) =>
                    r.map((item, i) =>
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
                value={row.graduationYear}
                onChange={(e) =>
                  setRows((r) =>
                    r.map((item, i) =>
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
                value={row.gpa}
                onChange={(e) =>
                  setRows((r) =>
                    r.map((item, i) =>
                      i === index ? { ...item, gpa: e.target.value } : item,
                    ),
                  )
                }
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          setRows((r) => [
            ...r,
            { level: "Diploma", institution: "", graduationYear: "", gpa: "" },
          ])
        }
      >
        <Plus className="mr-2 h-4 w-4" />
        Add education
      </Button>

      <div>
        <Button onClick={save} disabled={loading} size="lg">
          {loading ? "Saving…" : "Save & continue"}
        </Button>
      </div>
    </div>
  );
}
