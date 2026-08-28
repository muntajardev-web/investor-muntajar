"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  CertificationEntry,
  ProfilePatch,
} from "@/lib/employment/profile/types";
import { SectionShell } from "../section-shell";

type Props = {
  value: CertificationEntry[];
  complete?: boolean;
  onChange: (patch: ProfilePatch) => void;
};

const empty = (): CertificationEntry => ({
  name: "",
  issuer: "",
  year: "",
  expiry: "",
});

export function CertificationsSection({ value, complete, onChange }: Props) {
  const rows = value.length ? value : [empty()];

  function update(next: CertificationEntry[]) {
    onChange({ certifications: next });
  }

  return (
    <SectionShell
      id="certifications"
      title="Certifications"
      description="Trade licenses, training certificates, and professional credentials."
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
                Certificate {index + 1}
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
                <Label>Name</Label>
                <Input
                  value={row.name ?? ""}
                  onChange={(e) =>
                    update(
                      rows.map((item, i) =>
                        i === index ? { ...item, name: e.target.value } : item,
                      ),
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Issuer</Label>
                <Input
                  value={row.issuer ?? ""}
                  onChange={(e) =>
                    update(
                      rows.map((item, i) =>
                        i === index ? { ...item, issuer: e.target.value } : item,
                      ),
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input
                  value={String(row.year ?? "")}
                  onChange={(e) =>
                    update(
                      rows.map((item, i) =>
                        i === index ? { ...item, year: e.target.value } : item,
                      ),
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Expiry (optional)</Label>
                <Input
                  type="date"
                  value={row.expiry ?? ""}
                  onChange={(e) =>
                    update(
                      rows.map((item, i) =>
                        i === index ? { ...item, expiry: e.target.value } : item,
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
          onClick={() => update([...rows, empty()])}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add certification
        </Button>
      </div>
    </SectionShell>
  );
}
