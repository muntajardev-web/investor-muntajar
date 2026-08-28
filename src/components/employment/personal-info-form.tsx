"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  EMPLOYMENT_COUNTRIES,
} from "@/lib/employment/constants";
import { cn } from "@/lib/utils";

type PersonalFormProps = {
  initial?: Record<string, unknown> | null;
};

export function PersonalInfoForm({ initial }: PersonalFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preferredCountries, setPreferredCountries] = useState<string[]>(
    (initial?.preferredCountries as string[]) ?? [],
  );

  function toggleCountry(code: string) {
    setPreferredCountries((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      fullName: String(fd.get("fullName") ?? ""),
      dateOfBirth: String(fd.get("dateOfBirth") ?? "") || null,
      gender: String(fd.get("gender") ?? ""),
      nationality: String(fd.get("nationality") ?? ""),
      passportNumber: String(fd.get("passportNumber") ?? ""),
      passportExpiry: String(fd.get("passportExpiry") ?? "") || null,
      currentCountry: String(fd.get("currentCountry") ?? ""),
      currentAddress: String(fd.get("currentAddress") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      maritalStatus: String(fd.get("maritalStatus") ?? ""),
      hasDrivingLicense: fd.get("hasDrivingLicense") === "on",
      preferredCountries,
      preferredSalary: fd.get("preferredSalary")
        ? Number(fd.get("preferredSalary"))
        : null,
      preferredSalaryCurrency: String(fd.get("preferredSalaryCurrency") ?? "USD"),
      preferredJobType: String(fd.get("preferredJobType") ?? "") || null,
      workflowStep: 2,
    };

    try {
      const res = await fetch("/api/employment/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message);
      toast.success("Personal information saved");
      router.push("/work/employment/education");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
      setLoading(false);
    }
  }

  const dob =
    initial?.dateOfBirth != null
      ? new Date(String(initial.dateOfBirth)).toISOString().slice(0, 10)
      : "";
  const expiry =
    initial?.passportExpiry != null
      ? new Date(String(initial.passportExpiry)).toISOString().slice(0, 10)
      : "";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" name="fullName" defaultValue={String(initial?.fullName ?? "")} required />
        <Field label="Date of Birth" name="dateOfBirth" type="date" defaultValue={dob} />
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <select
            id="gender"
            name="gender"
            defaultValue={String(initial?.gender ?? "")}
            className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <Field label="Nationality" name="nationality" defaultValue={String(initial?.nationality ?? "")} />
        <Field label="Passport Number" name="passportNumber" defaultValue={String(initial?.passportNumber ?? "")} />
        <Field label="Passport Expiry" name="passportExpiry" type="date" defaultValue={expiry} />
        <Field label="Current Country" name="currentCountry" defaultValue={String(initial?.currentCountry ?? "")} />
        <Field label="Phone" name="phone" defaultValue={String(initial?.phone ?? "")} />
        <Field label="Email" name="email" type="email" defaultValue={String(initial?.email ?? "")} />
        <div className="space-y-2">
          <Label htmlFor="maritalStatus">Marital Status</Label>
          <select
            id="maritalStatus"
            name="maritalStatus"
            defaultValue={String(initial?.maritalStatus ?? "")}
            className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm"
          >
            <option value="">Select</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>
        <Field
          label="Preferred Salary (monthly)"
          name="preferredSalary"
          type="number"
          defaultValue={
            initial?.preferredSalary != null
              ? String(Number(initial.preferredSalary))
              : ""
          }
        />
        <div className="space-y-2">
          <Label htmlFor="preferredSalaryCurrency">Salary Currency</Label>
          <select
            id="preferredSalaryCurrency"
            name="preferredSalaryCurrency"
            defaultValue={String(initial?.preferredSalaryCurrency ?? "USD")}
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
          <Label htmlFor="preferredJobType">Preferred Job Type</Label>
          <select
            id="preferredJobType"
            name="preferredJobType"
            defaultValue={String(initial?.preferredJobType ?? "")}
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

      <div className="space-y-2">
        <Label htmlFor="currentAddress">Current Address</Label>
        <textarea
          id="currentAddress"
          name="currentAddress"
          rows={3}
          defaultValue={String(initial?.currentAddress ?? "")}
          className="w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input
          type="checkbox"
          name="hasDrivingLicense"
          defaultChecked={Boolean(initial?.hasDrivingLicense)}
          className="h-4 w-4 rounded border-stone-300"
        />
        I have a driving license
      </label>

      <div>
        <Label>Preferred Countries</Label>
        <div className="mt-3 flex flex-wrap gap-2">
          {EMPLOYMENT_COUNTRIES.map((c) => {
            const active = preferredCountries.includes(c.code);
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => toggleCountry(c.code)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "border-orange-400 bg-orange-50 text-orange-900"
                    : "border-stone-200 bg-white text-stone-700 hover:border-stone-300",
                )}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      <Button type="submit" disabled={loading} size="lg">
        {loading ? "Saving…" : "Save & continue"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue = "",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
      />
    </div>
  );
}
