export type SkillItem = {
  name: string;
  level: number; // 1 to 5
};

export type LanguageItem = {
  name: string;
  proficiency: string; // e.g. "Native", "Fluent", "Intermediate", "Basic"
};

export type ExperienceItem = {
  id: string;
  position: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  description: string;
};

export type EducationItem = {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate: string;
  description?: string;
};

export type HonorItem = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
};

export type PersonalInfo = {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  passportNumber?: string;
  passportExpiry?: string;
  nationality?: string;
  photoUrl?: string | null;
};

export type ResumeData = {
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  languages: LanguageItem[];
  hobbies: string[];
  honors: HonorItem[];
};

export type ResumeTemplateId =
  | "executive"
  | "neque"
  | "original"
  | "bold"
  | "expressive";

export type ResumeAccentColor = "teal" | "orange" | "navy" | "slate" | "crimson";
