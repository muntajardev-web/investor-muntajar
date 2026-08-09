"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionShell } from "../section-shell";
import type { ProfilePatch } from "@/lib/employment/profile/types";
import { toDateInput } from "@/lib/employment/profile/types";

type Props = {
  values: {
    passportNumber?: string | null;
    passportExpiry?: Date | string | null;
    passportIssueDate?: Date | string | null;
    passportIssuingCountry?: string | null;
  };
  complete?: boolean;
  onChange: (patch: ProfilePatch) => void;
};

export function PassportSection({ values, complete, onChange }: Props) {
  return (
    <SectionShell
      id="passport"
      title="Passport"
      description="Passport number, issue and expiry details."
      complete={complete}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="passportNumber">Passport Number</Label>
          <Input
            id="passportNumber"
            value={values.passportNumber ?? ""}
            onChange={(e) => onChange({ passportNumber: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="passportIssuingCountry">Issuing Country</Label>
          <Input
            id="passportIssuingCountry"
            value={values.passportIssuingCountry ?? ""}
            onChange={(e) =>
              onChange({ passportIssuingCountry: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="passportIssueDate">Issue Date</Label>
          <Input
            id="passportIssueDate"
            type="date"
            value={toDateInput(values.passportIssueDate)}
            onChange={(e) =>
              onChange({ passportIssueDate: e.target.value || null })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="passportExpiry">Expiry Date</Label>
          <Input
            id="passportExpiry"
            type="date"
            value={toDateInput(values.passportExpiry)}
            onChange={(e) =>
              onChange({ passportExpiry: e.target.value || null })
            }
          />
        </div>
      </div>
    </SectionShell>
  );
}
