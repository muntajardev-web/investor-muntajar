export type EducationEntry = {
  level?: string;
  institution?: string;
  graduationYear?: number | string;
  gpa?: number | string;
};

export type ExperienceEntry = {
  employer?: string;
  position?: string;
  years?: number | string;
  responsibilities?: string;
  isCurrent?: boolean;
  hasCertificate?: boolean;
  hasReference?: boolean;
};

export type LanguageEntry = {
  language?: string;
  level?: string;
  score?: string;
};

export type CertificationEntry = {
  name?: string;
  issuer?: string;
  year?: number | string;
  expiry?: string;
};

export type EmergencyContact = {
  name?: string;
  relation?: string;
  phone?: string;
  email?: string;
};

export type WorkerProfileLike = {
  fullName?: string | null;
  dateOfBirth?: Date | string | null;
  gender?: string | null;
  nationality?: string | null;
  passportNumber?: string | null;
  passportExpiry?: Date | string | null;
  passportIssueDate?: Date | string | null;
  passportIssuingCountry?: string | null;
  currentCountry?: string | null;
  currentAddress?: string | null;
  currentCity?: string | null;
  phone?: string | null;
  email?: string | null;
  maritalStatus?: string | null;
  preferredCountries?: string[] | null;
  preferredSalary?: unknown;
  preferredJobType?: string | null;
  preferredIndustries?: string[] | null;
  education?: unknown;
  experience?: unknown;
  skills?: string[] | null;
  customSkills?: string[] | null;
  languages?: unknown;
  certifications?: unknown;
  emergencyContact?: unknown;
  photoUrl?: string | null;
};

export type ProfilePatch = {
  fullName?: string;
  dateOfBirth?: string | null;
  gender?: string;
  nationality?: string;
  passportNumber?: string;
  passportExpiry?: string | null;
  passportIssueDate?: string | null;
  passportIssuingCountry?: string;
  currentCountry?: string;
  currentAddress?: string;
  currentCity?: string;
  phone?: string;
  email?: string;
  maritalStatus?: string;
  hasDrivingLicense?: boolean;
  preferredCountries?: string[];
  preferredSalary?: number | null;
  preferredSalaryCurrency?: string;
  preferredJobType?: string | null;
  preferredIndustries?: string[];
  education?: EducationEntry[];
  experience?: ExperienceEntry[];
  skills?: string[];
  customSkills?: string[];
  languages?: LanguageEntry[];
  certifications?: CertificationEntry[];
  emergencyContact?: EmergencyContact;
  photoUrl?: string | null;
  photoFileName?: string | null;
  photoMimeType?: string | null;
  workflowStep?: number;
  autosave?: boolean;
};

export function toDateInput(value?: Date | string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function asEmergencyContact(value: unknown): EmergencyContact {
  if (!value || typeof value !== "object") return {};
  return value as EmergencyContact;
}
