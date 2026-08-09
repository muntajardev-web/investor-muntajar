"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  EmergencyContact,
  ProfilePatch,
} from "@/lib/employment/profile/types";
import { SectionShell } from "../section-shell";

type Props = {
  value: EmergencyContact;
  complete?: boolean;
  onChange: (patch: ProfilePatch) => void;
};

export function EmergencyContactSection({
  value,
  complete,
  onChange,
}: Props) {
  function update(partial: EmergencyContact) {
    onChange({ emergencyContact: { ...value, ...partial } });
  }

  return (
    <SectionShell
      id="emergency"
      title="Emergency Contact"
      description="Someone we can reach if needed during your application."
      complete={complete}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="emergencyName">Full Name</Label>
          <Input
            id="emergencyName"
            value={value.name ?? ""}
            onChange={(e) => update({ name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergencyRelation">Relationship</Label>
          <Input
            id="emergencyRelation"
            value={value.relation ?? ""}
            onChange={(e) => update({ relation: e.target.value })}
            placeholder="e.g. Spouse, Parent, Sibling"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergencyPhone">Phone</Label>
          <Input
            id="emergencyPhone"
            value={value.phone ?? ""}
            onChange={(e) => update({ phone: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergencyEmail">Email</Label>
          <Input
            id="emergencyEmail"
            type="email"
            value={value.email ?? ""}
            onChange={(e) => update({ email: e.target.value })}
          />
        </div>
      </div>
    </SectionShell>
  );
}
