"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionShell } from "../section-shell";
import type { ProfilePatch } from "@/lib/employment/profile/types";

type Props = {
  nationality?: string | null;
  complete?: boolean;
  onChange: (patch: ProfilePatch) => void;
};

export function NationalitySection({
  nationality,
  complete,
  onChange,
}: Props) {
  return (
    <SectionShell
      id="nationality"
      title="Nationality"
      description="Your citizenship / nationality."
      complete={complete}
    >
      <div className="max-w-md space-y-2">
        <Label htmlFor="nationality">Nationality</Label>
        <Input
          id="nationality"
          value={nationality ?? ""}
          onChange={(e) => onChange({ nationality: e.target.value })}
          placeholder="e.g. Bangladeshi"
        />
      </div>
    </SectionShell>
  );
}
