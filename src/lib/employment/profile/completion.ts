import type {
  CertificationEntry,
  EducationEntry,
  EmergencyContact,
  ExperienceEntry,
  LanguageEntry,
  WorkerProfileLike,
} from "./types";
import { asArray, asEmergencyContact } from "./types";

export type { WorkerProfileLike } from "./types";

export function computeProfileCompletion(
  profile: WorkerProfileLike | null | undefined,
) {
  if (!profile) return 0;

  const education = asArray<EducationEntry>(profile.education);
  const experience = asArray<ExperienceEntry>(profile.experience);
  const languages = asArray<LanguageEntry>(profile.languages);
  const certifications = asArray<CertificationEntry>(profile.certifications);
  const emergency = asEmergencyContact(profile.emergencyContact);
  const allSkills = [
    ...(profile.skills ?? []),
    ...(profile.customSkills ?? []),
  ];

  const checks = [
    // Personal
    !!profile.fullName,
    !!profile.dateOfBirth,
    !!profile.gender,
    !!profile.phone,
    !!profile.email,
    // Passport
    !!profile.passportNumber,
    !!profile.passportExpiry,
    // Nationality
    !!profile.nationality,
    // Address
    !!profile.currentCountry,
    !!profile.currentAddress,
    // Education
    education.some((e) => e.level && e.institution),
    // Languages
    languages.some((l) => l.language),
    // Experience
    experience.some((e) => e.employer && e.position),
    // Skills
    allSkills.length > 0,
    // Certifications
    certifications.some((c) => c.name),
    // Preferred countries
    (profile.preferredCountries?.length ?? 0) > 0,
    // Preferred salary
    profile.preferredSalary != null,
    // Preferred industries
    (profile.preferredIndustries?.length ?? 0) > 0,
    // Emergency contact
    !!emergency.name && !!emergency.phone,
    // Profile photo
    !!profile.photoUrl,
  ];

  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

export function isWorkerProfileComplete(
  profile: WorkerProfileLike | null | undefined,
) {
  return computeProfileCompletion(profile) >= 70;
}

export function getProfileSectionCompletion(profile: WorkerProfileLike | null | undefined) {
  if (!profile) {
    return {
      personal: false,
      passport: false,
      nationality: false,
      address: false,
      education: false,
      languages: false,
      experience: false,
      skills: false,
      certifications: false,
      preferredCountries: false,
      preferredSalary: false,
      preferredIndustries: false,
      emergency: false,
      photo: false,
    };
  }

  const education = asArray<EducationEntry>(profile.education);
  const experience = asArray<ExperienceEntry>(profile.experience);
  const languages = asArray<LanguageEntry>(profile.languages);
  const certifications = asArray<CertificationEntry>(profile.certifications);
  const emergency = asEmergencyContact(profile.emergencyContact);
  const allSkills = [
    ...(profile.skills ?? []),
    ...(profile.customSkills ?? []),
  ];

  return {
    personal: !!(
      profile.fullName &&
      profile.dateOfBirth &&
      profile.gender &&
      profile.phone &&
      profile.email
    ),
    passport: !!(profile.passportNumber && profile.passportExpiry),
    nationality: !!profile.nationality,
    address: !!(profile.currentCountry && profile.currentAddress),
    education: education.some((e) => e.level && e.institution),
    languages: languages.some((l) => l.language),
    experience: experience.some((e) => e.employer && e.position),
    skills: allSkills.length > 0,
    certifications: certifications.some((c) => c.name),
    preferredCountries: (profile.preferredCountries?.length ?? 0) > 0,
    preferredSalary: profile.preferredSalary != null,
    preferredIndustries: (profile.preferredIndustries?.length ?? 0) > 0,
    emergency: !!(emergency.name && emergency.phone),
    photo: !!profile.photoUrl,
  };
}
