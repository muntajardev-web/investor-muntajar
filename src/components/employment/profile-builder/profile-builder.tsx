"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProgressBar } from "@/components/employment/ui";
import { Button } from "@/components/ui/button";
import { getProfileSectionCompletion } from "@/lib/employment/profile/completion";
import {
  asArray,
  asEmergencyContact,
  type CertificationEntry,
  type EducationEntry,
  type ExperienceEntry,
  type LanguageEntry,
  type ProfilePatch,
} from "@/lib/employment/profile/types";
import { AutosaveStatus } from "./autosave-status";
import { useProfileAutosave } from "./use-profile-autosave";
import { PersonalSection } from "./sections/personal-section";
import { PassportSection } from "./sections/passport-section";
import { NationalitySection } from "./sections/nationality-section";
import { AddressSection } from "./sections/address-section";
import { EducationSection } from "./sections/education-section";
import { LanguagesSection } from "./sections/languages-section";
import { ExperienceSection } from "./sections/experience-section";
import { SkillsSection } from "./sections/skills-section";
import { CertificationsSection } from "./sections/certifications-section";
import { PreferredCountriesSection } from "./sections/preferred-countries-section";
import { PreferredSalarySection } from "./sections/preferred-salary-section";
import { PreferredIndustriesSection } from "./sections/preferred-industries-section";
import { EmergencyContactSection } from "./sections/emergency-contact-section";
import { PhotoSection } from "./sections/photo-section";

export type ProfileBuilderInitial = {
  fullName?: string | null;
  dateOfBirth?: Date | string | null;
  gender?: string | null;
  nationality?: string | null;
  passportNumber?: string | null;
  passportExpiry?: Date | string | null;
  passportIssueDate?: Date | string | null;
  passportIssuingCountry?: string | null;
  currentCountry?: string | null;
  currentCity?: string | null;
  currentAddress?: string | null;
  phone?: string | null;
  email?: string | null;
  maritalStatus?: string | null;
  hasDrivingLicense?: boolean | null;
  preferredCountries?: string[];
  preferredSalary?: unknown;
  preferredSalaryCurrency?: string | null;
  preferredJobType?: string | null;
  preferredIndustries?: string[];
  education?: unknown;
  experience?: unknown;
  skills?: string[];
  customSkills?: string[];
  languages?: unknown;
  certifications?: unknown;
  emergencyContact?: unknown;
  photoUrl?: string | null;
  photoFileName?: string | null;
  profileCompletion?: number;
};

type Draft = {
  fullName: string;
  dateOfBirth: string | null;
  gender: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string | null;
  passportIssueDate: string | null;
  passportIssuingCountry: string;
  currentCountry: string;
  currentCity: string;
  currentAddress: string;
  phone: string;
  email: string;
  maritalStatus: string;
  hasDrivingLicense: boolean;
  preferredCountries: string[];
  preferredSalary: number | null;
  preferredSalaryCurrency: string;
  preferredJobType: string | null;
  preferredIndustries: string[];
  education: EducationEntry[];
  experience: ExperienceEntry[];
  skills: string[];
  customSkills: string[];
  languages: LanguageEntry[];
  certifications: CertificationEntry[];
  emergencyContact: ReturnType<typeof asEmergencyContact>;
  photoUrl: string | null;
  photoFileName: string | null;
};

function toDraft(initial: ProfileBuilderInitial | null): Draft {
  return {
    fullName: initial?.fullName ?? "",
    dateOfBirth: initial?.dateOfBirth
      ? new Date(initial.dateOfBirth).toISOString().slice(0, 10)
      : null,
    gender: initial?.gender ?? "",
    nationality: initial?.nationality ?? "",
    passportNumber: initial?.passportNumber ?? "",
    passportExpiry: initial?.passportExpiry
      ? new Date(initial.passportExpiry).toISOString().slice(0, 10)
      : null,
    passportIssueDate: initial?.passportIssueDate
      ? new Date(initial.passportIssueDate).toISOString().slice(0, 10)
      : null,
    passportIssuingCountry: initial?.passportIssuingCountry ?? "",
    currentCountry: initial?.currentCountry ?? "",
    currentCity: initial?.currentCity ?? "",
    currentAddress: initial?.currentAddress ?? "",
    phone: initial?.phone ?? "",
    email: initial?.email ?? "",
    maritalStatus: initial?.maritalStatus ?? "",
    hasDrivingLicense: !!initial?.hasDrivingLicense,
    preferredCountries: initial?.preferredCountries ?? [],
    preferredSalary:
      initial?.preferredSalary != null
        ? Number(initial.preferredSalary)
        : null,
    preferredSalaryCurrency: initial?.preferredSalaryCurrency ?? "USD",
    preferredJobType: initial?.preferredJobType ?? null,
    preferredIndustries: initial?.preferredIndustries ?? [],
    education: asArray<EducationEntry>(initial?.education),
    experience: asArray<ExperienceEntry>(initial?.experience),
    skills: initial?.skills ?? [],
    customSkills: initial?.customSkills ?? [],
    languages: asArray<LanguageEntry>(initial?.languages),
    certifications: asArray<CertificationEntry>(initial?.certifications),
    emergencyContact: asEmergencyContact(initial?.emergencyContact),
    photoUrl: initial?.photoUrl ?? null,
    photoFileName: initial?.photoFileName ?? null,
  };
}

export function ProfileBuilder({
  initial,
}: {
  initial: ProfileBuilderInitial | null;
}) {
  const [draft, setDraft] = useState(() => toDraft(initial));
  const autosave = useProfileAutosave(initial?.profileCompletion ?? 0);

  const sections = useMemo(() => {
    if (autosave.sections) return autosave.sections;
    return getProfileSectionCompletion({
      ...draft,
      preferredSalary: draft.preferredSalary,
    });
  }, [autosave.sections, draft]);

  function apply(patch: ProfilePatch) {
    setDraft((prev) => ({
      ...prev,
      ...(patch.fullName !== undefined ? { fullName: patch.fullName } : {}),
      ...(patch.dateOfBirth !== undefined
        ? { dateOfBirth: patch.dateOfBirth }
        : {}),
      ...(patch.gender !== undefined ? { gender: patch.gender } : {}),
      ...(patch.nationality !== undefined
        ? { nationality: patch.nationality }
        : {}),
      ...(patch.passportNumber !== undefined
        ? { passportNumber: patch.passportNumber }
        : {}),
      ...(patch.passportExpiry !== undefined
        ? { passportExpiry: patch.passportExpiry }
        : {}),
      ...(patch.passportIssueDate !== undefined
        ? { passportIssueDate: patch.passportIssueDate }
        : {}),
      ...(patch.passportIssuingCountry !== undefined
        ? { passportIssuingCountry: patch.passportIssuingCountry }
        : {}),
      ...(patch.currentCountry !== undefined
        ? { currentCountry: patch.currentCountry }
        : {}),
      ...(patch.currentCity !== undefined
        ? { currentCity: patch.currentCity }
        : {}),
      ...(patch.currentAddress !== undefined
        ? { currentAddress: patch.currentAddress }
        : {}),
      ...(patch.phone !== undefined ? { phone: patch.phone } : {}),
      ...(patch.email !== undefined ? { email: patch.email } : {}),
      ...(patch.maritalStatus !== undefined
        ? { maritalStatus: patch.maritalStatus }
        : {}),
      ...(patch.hasDrivingLicense !== undefined
        ? { hasDrivingLicense: patch.hasDrivingLicense }
        : {}),
      ...(patch.preferredCountries !== undefined
        ? { preferredCountries: patch.preferredCountries }
        : {}),
      ...(patch.preferredSalary !== undefined
        ? { preferredSalary: patch.preferredSalary }
        : {}),
      ...(patch.preferredSalaryCurrency !== undefined
        ? { preferredSalaryCurrency: patch.preferredSalaryCurrency }
        : {}),
      ...(patch.preferredJobType !== undefined
        ? { preferredJobType: patch.preferredJobType }
        : {}),
      ...(patch.preferredIndustries !== undefined
        ? { preferredIndustries: patch.preferredIndustries }
        : {}),
      ...(patch.education !== undefined ? { education: patch.education } : {}),
      ...(patch.experience !== undefined
        ? { experience: patch.experience }
        : {}),
      ...(patch.skills !== undefined ? { skills: patch.skills } : {}),
      ...(patch.customSkills !== undefined
        ? { customSkills: patch.customSkills }
        : {}),
      ...(patch.languages !== undefined ? { languages: patch.languages } : {}),
      ...(patch.certifications !== undefined
        ? { certifications: patch.certifications }
        : {}),
      ...(patch.emergencyContact !== undefined
        ? { emergencyContact: patch.emergencyContact }
        : {}),
      ...(patch.photoUrl !== undefined ? { photoUrl: patch.photoUrl } : {}),
      ...(patch.photoFileName !== undefined
        ? { photoFileName: patch.photoFileName }
        : {}),
    }));
    autosave.save(patch);
  }

  const completion = autosave.completion;

  return (
    <div className="space-y-6">
      {/* ── TOP STUNNING PROFILE COMPLETION HEADER ── */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <AutosaveStatus
            saving={autosave.saving}
            lastSavedAt={autosave.lastSavedAt}
            error={autosave.error}
            completion={completion}
          />
          <Link
            href="/work/employment/documents"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-extrabold text-xs sm:text-sm transition-all cursor-pointer shrink-0"
          >
            <span>Continue to Documents</span>
            <span>→</span>
          </Link>
        </div>

        <div className="space-y-1.5 pt-1 border-t border-stone-100">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span>Profile Readiness Score</span>
            <span className="text-stone-950 font-extrabold tabular-nums">
              {completion}% Complete
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-stone-100 p-0.5 overflow-hidden border border-stone-200">
            <div
              className="h-full rounded-full bg-teal-600 transition-all duration-500"
              style={{ width: `${Math.max(5, completion)}%` }}
            />
          </div>
        </div>
      </div>

      <PersonalSection
        values={draft}
        complete={sections.personal}
        onChange={apply}
      />
      <PassportSection
        values={draft}
        complete={sections.passport}
        onChange={apply}
      />
      <NationalitySection
        nationality={draft.nationality}
        complete={sections.nationality}
        onChange={apply}
      />
      <AddressSection
        values={draft}
        complete={sections.address}
        onChange={apply}
      />
      <EducationSection
        value={draft.education}
        complete={sections.education}
        onChange={apply}
      />
      <LanguagesSection
        value={draft.languages}
        complete={sections.languages}
        onChange={apply}
      />
      <ExperienceSection
        value={draft.experience}
        complete={sections.experience}
        onChange={apply}
      />
      <SkillsSection
        skills={draft.skills}
        customSkills={draft.customSkills}
        complete={sections.skills}
        onChange={apply}
      />
      <CertificationsSection
        value={draft.certifications}
        complete={sections.certifications}
        onChange={apply}
      />
      <PreferredCountriesSection
        value={draft.preferredCountries}
        complete={sections.preferredCountries}
        onChange={apply}
      />
      <PreferredSalarySection
        salary={draft.preferredSalary}
        currency={draft.preferredSalaryCurrency}
        jobType={draft.preferredJobType}
        complete={sections.preferredSalary}
        onChange={apply}
      />
      <PreferredIndustriesSection
        value={draft.preferredIndustries}
        complete={sections.preferredIndustries}
        onChange={apply}
      />
      <EmergencyContactSection
        value={draft.emergencyContact}
        complete={sections.emergency}
        onChange={apply}
      />
      <PhotoSection
        photoUrl={draft.photoUrl}
        photoFileName={draft.photoFileName}
        complete={sections.photo}
        onUploaded={({ photoUrl, photoFileName, completion: next }) => {
          setDraft((prev) => ({ ...prev, photoUrl, photoFileName }));
          autosave.setCompletion(next);
        }}
        onRemoved={(nextCompletion) => {
          setDraft((prev) => ({
            ...prev,
            photoUrl: null,
            photoFileName: null,
          }));
          autosave.setCompletion(nextCompletion);
        }}
      />
    </div>
  );
}
