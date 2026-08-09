"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionShell } from "../section-shell";
import type { ProfilePatch } from "@/lib/employment/profile/types";
import { toDateInput } from "@/lib/employment/profile/types";

type Props = {
  values: {
    fullName?: string | null;
    dateOfBirth?: Date | string | null;
    gender?: string | null;
    phone?: string | null;
    email?: string | null;
    maritalStatus?: string | null;
    hasDrivingLicense?: boolean | null;
  };
  complete?: boolean;
  onChange: (patch: ProfilePatch) => void;
};

export function PersonalSection({ values, complete, onChange }: Props) {
  return (
    <SectionShell
      id="personal"
      title="Personal Information"
      description="Basic identity and contact details."
      complete={complete}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Full Name"
          value={values.fullName ?? ""}
          onChange={(v) => onChange({ fullName: v })}
        />
        <Field
          label="Date of Birth"
          type="date"
          value={toDateInput(values.dateOfBirth)}
          onChange={(v) => onChange({ dateOfBirth: v || null })}
        />
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <select
            id="gender"
            value={values.gender ?? ""}
            onChange={(e) => onChange({ gender: e.target.value })}
            className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <Field
          label="Phone"
          value={values.phone ?? ""}
          onChange={(v) => onChange({ phone: v })}
        />
        <Field
          label="Email"
          type="email"
          value={values.email ?? ""}
          onChange={(v) => onChange({ email: v })}
        />
        <div className="space-y-2">
          <Label htmlFor="maritalStatus">Marital Status</Label>
          <select
            id="maritalStatus"
            value={values.maritalStatus ?? ""}
            onChange={(e) => onChange({ maritalStatus: e.target.value })}
            className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm"
          >
            <option value="">Select</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm text-stone-700">
        <input
          type="checkbox"
          checked={!!values.hasDrivingLicense}
          onChange={(e) => onChange({ hasDrivingLicense: e.target.checked })}
          className="h-4 w-4 rounded border-stone-300"
        />
        I have a driving license
      </label>
    </SectionShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
