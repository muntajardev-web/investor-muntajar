"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProfilePatch } from "@/lib/employment/profile/types";
import { SectionShell } from "../section-shell";

type Props = {
  salary?: number | null;
  currency?: string | null;
  jobType?: string | null;
  complete?: boolean;
  onChange: (patch: ProfilePatch) => void;
};

export function PreferredSalarySection({
  salary,
  currency,
  jobType,
  complete,
  onChange,
}: Props) {
  return (
    <SectionShell
      id="preferred-salary"
      title="Preferred Salary"
      description="Target monthly compensation and job type."
      complete={complete}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="preferredSalary">Monthly salary</Label>
          <Input
            id="preferredSalary"
            type="number"
            value={salary ?? ""}
            onChange={(e) =>
              onChange({
                preferredSalary: e.target.value
                  ? Number(e.target.value)
                  : null,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferredSalaryCurrency">Currency</Label>
          <select
            id="preferredSalaryCurrency"
            value={currency ?? "USD"}
            onChange={(e) =>
              onChange({ preferredSalaryCurrency: e.target.value })
            }
            className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="AED">AED</option>
            <option value="CAD">CAD</option>
            <option value="AUD">AUD</option>
            <option value="BDT">BDT</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferredJobType">Job type</Label>
          <select
            id="preferredJobType"
            value={jobType ?? ""}
            onChange={(e) =>
              onChange({ preferredJobType: e.target.value || null })
            }
            className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm"
          >
            <option value="">Select</option>
            <option value="FULL_TIME">Full time</option>
            <option value="PART_TIME">Part time</option>
            <option value="CONTRACT">Contract</option>
            <option value="TEMPORARY">Temporary</option>
            <option value="SEASONAL">Seasonal</option>
          </select>
        </div>
      </div>
    </SectionShell>
  );
}
