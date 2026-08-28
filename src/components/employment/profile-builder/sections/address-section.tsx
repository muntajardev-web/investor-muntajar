"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionShell } from "../section-shell";
import type { ProfilePatch } from "@/lib/employment/profile/types";

type Props = {
  values: {
    currentCountry?: string | null;
    currentCity?: string | null;
    currentAddress?: string | null;
  };
  complete?: boolean;
  onChange: (patch: ProfilePatch) => void;
};

export function AddressSection({ values, complete, onChange }: Props) {
  return (
    <SectionShell
      id="address"
      title="Current Address"
      description="Where you currently live."
      complete={complete}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="currentCountry">Current Country</Label>
          <Input
            id="currentCountry"
            value={values.currentCountry ?? ""}
            onChange={(e) => onChange({ currentCountry: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currentCity">City</Label>
          <Input
            id="currentCity"
            value={values.currentCity ?? ""}
            onChange={(e) => onChange({ currentCity: e.target.value })}
          />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Label htmlFor="currentAddress">Full Address</Label>
        <textarea
          id="currentAddress"
          rows={3}
          value={values.currentAddress ?? ""}
          onChange={(e) => onChange({ currentAddress: e.target.value })}
          className="w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm"
        />
      </div>
    </SectionShell>
  );
}
