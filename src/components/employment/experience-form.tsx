"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Exp = {
  employer: string;
  position: string;
  years: string;
  responsibilities: string;
  isCurrent: boolean;
  hasCertificate: boolean;
  hasReference: boolean;
};

export function ExperienceForm({ initial }: { initial?: Exp[] | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Exp[]>(
    initial?.length
      ? initial.map((e) => ({
          employer: e.employer ?? "",
          position: e.position ?? "",
          years: String(e.years ?? ""),
          responsibilities: e.responsibilities ?? "",
          isCurrent: !!e.isCurrent,
          hasCertificate: !!e.hasCertificate,
          hasReference: !!e.hasReference,
        }))
      : [
          {
            employer: "",
            position: "",
            years: "",
            responsibilities: "",
            isCurrent: true,
            hasCertificate: false,
            hasReference: false,
          },
        ],
  );

  async function save() {
    setLoading(true);
    try {
      const res = await fetch("/api/employment/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experience: rows, workflowStep: 4 }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message);
      toast.success("Experience saved");
      router.push("/work/employment/skills");
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
              {row.isCurrent ? "Current job" : `Previous job ${index + 1}`}
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
              <Label>Employer</Label>
              <Input
                value={row.employer}
                onChange={(e) =>
                  setRows((r) =>
                    r.map((item, i) =>
                      i === index ? { ...item, employer: e.target.value } : item,
                    ),
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Position</Label>
              <Input
                value={row.position}
                onChange={(e) =>
                  setRows((r) =>
                    r.map((item, i) =>
                      i === index ? { ...item, position: e.target.value } : item,
                    ),
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Years of Experience</Label>
              <Input
                value={row.years}
                onChange={(e) =>
                  setRows((r) =>
                    r.map((item, i) =>
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
              value={row.responsibilities}
              onChange={(e) =>
                setRows((r) =>
                  r.map((item, i) =>
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
                checked={row.isCurrent}
                onChange={(e) =>
                  setRows((r) =>
                    r.map((item, i) =>
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
                checked={row.hasCertificate}
                onChange={(e) =>
                  setRows((r) =>
                    r.map((item, i) =>
                      i === index
                        ? { ...item, hasCertificate: e.target.checked }
                        : item,
                    ),
                  )
                }
              />
              Employment certificate available
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={row.hasReference}
                onChange={(e) =>
                  setRows((r) =>
                    r.map((item, i) =>
                      i === index
                        ? { ...item, hasReference: e.target.checked }
                        : item,
                    ),
                  )
                }
              />
              Reference letter available
            </label>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          setRows((r) => [
            ...r,
            {
              employer: "",
              position: "",
              years: "",
              responsibilities: "",
              isCurrent: false,
              hasCertificate: false,
              hasReference: false,
            },
          ])
        }
      >
        <Plus className="mr-2 h-4 w-4" />
        Add previous job
      </Button>

      <div>
        <Button onClick={save} disabled={loading} size="lg">
          {loading ? "Saving…" : "Save & continue"}
        </Button>
      </div>
    </div>
  );
}
