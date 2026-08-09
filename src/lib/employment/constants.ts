export const EMPLOYMENT_SKILLS = [
  "Construction",
  "Electrician",
  "Plumber",
  "Welder",
  "Mason",
  "Civil Engineer",
  "Mechanical Engineer",
  "Software Engineer",
  "Chef",
  "Hotel Staff",
  "Housekeeping",
  "Driver",
  "Caregiver",
  "Nurse",
  "Doctor",
  "Factory Worker",
  "Warehouse",
  "Sales",
  "Marketing",
  "Accounting",
  "Customer Support",
  "Language Teacher",
  "HVAC Technician",
  "Automotive Mechanic",
  "IT Support",
  "Network Engineer",
  "Pharmacist",
  "Lab Technician",
  "Security Guard",
  "Agriculture Worker",
] as const;

export const EMPLOYMENT_COUNTRIES = [
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "QA", name: "Qatar" },
  { code: "KW", name: "Kuwait" },
  { code: "OM", name: "Oman" },
  { code: "BH", name: "Bahrain" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "DE", name: "Germany" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
] as const;

export const EMPLOYMENT_DOCUMENT_KINDS = [
  { kind: "PASSPORT", label: "Passport" },
  { kind: "NATIONAL_ID", label: "National ID" },
  { kind: "SSC", label: "SSC" },
  { kind: "HSC", label: "HSC" },
  { kind: "DIPLOMA", label: "Diploma" },
  { kind: "DEGREE", label: "Degree" },
  { kind: "EXPERIENCE_LETTER", label: "Experience Letter" },
  { kind: "TRAINING_CERTIFICATE", label: "Training Certificate" },
  { kind: "POLICE_CLEARANCE", label: "Police Clearance" },
  { kind: "MEDICAL_CERTIFICATE", label: "Medical Certificate" },
  { kind: "MEDICAL_REPORT", label: "Medical Report" },
  { kind: "DRIVING_LICENSE", label: "Driving License" },
  { kind: "CV", label: "CV" },
  { kind: "LANGUAGE_CERTIFICATE", label: "Language Certificate" },
  { kind: "TRADE_LICENSE", label: "Trade License" },
  { kind: "BIRTH_CERTIFICATE", label: "Birth Certificate" },
  { kind: "MARRIAGE_CERTIFICATE", label: "Marriage Certificate" },
  { kind: "OTHER", label: "Others" },
] as const;

/** Core documents required before payment / submit */
export const REQUIRED_EMPLOYMENT_DOCS = [
  "PASSPORT",
  "CV",
  "EXPERIENCE_LETTER",
  "POLICE_CLEARANCE",
  "MEDICAL_CERTIFICATE",
] as const;

export function employmentDocLabel(kind: string) {
  return (
    EMPLOYMENT_DOCUMENT_KINDS.find((d) => d.kind === kind)?.label ??
    kind.replace(/_/g, " ")
  );
}

export const EMPLOYMENT_LANGUAGE_OPTIONS = [
  "English",
  "IELTS",
  "TOEFL",
  "German",
  "French",
  "Japanese",
  "Korean",
  "Arabic",
  "Others",
] as const;

export const EDUCATION_LEVELS = [
  "SSC",
  "HSC",
  "Diploma",
  "Bachelor",
  "Masters",
  "Technical Education",
  "Vocational Training",
  "Trade Certificates",
] as const;

export const EMPLOYMENT_WORKFLOW_STEPS = [
  { step: 1, id: "personal", title: "Personal Information", href: "/work/employment/profile" },
  { step: 2, id: "education", title: "Education", href: "/work/employment/education" },
  { step: 3, id: "experience", title: "Work Experience", href: "/work/employment/experience" },
  { step: 4, id: "skills", title: "Skills", href: "/work/employment/skills" },
  { step: 5, id: "languages", title: "Language", href: "/work/employment/languages" },
  { step: 6, id: "documents", title: "Upload Documents", href: "/work/employment/documents" },
  { step: 7, id: "analysis", title: "AI Profile Analysis", href: "/work/employment/analysis" },
  { step: 8, id: "jobs", title: "AI Job Matching", href: "/work/employment/jobs" },
  { step: 9, id: "advisor", title: "AI Career Coach", href: "/work/employment/advisor" },
  { step: 10, id: "builder", title: "Application Builder", href: "/work/employment/builder" },
  { step: 11, id: "cover-letter", title: "Cover Letter", href: "/work/employment/cover-letter" },
  { step: 12, id: "review", title: "Application Validation", href: "/work/employment/review" },
  { step: 13, id: "payment", title: "Payment", href: "/work/employment/payment" },
  { step: 14, id: "confirmation", title: "Confirmation", href: "/work/employment/confirmation" },
  { step: 15, id: "submission", title: "Submission", href: "/work/employment/submission" },
  { step: 16, id: "receipt", title: "Receipt", href: "/work/employment/receipt" },
  { step: 17, id: "tracker", title: "Application Tracker", href: "/work/employment/tracker" },
] as const;

export const EMPLOYMENT_FEE = {
  amount: 15000,
  currency: "BDT",
  name: "Overseas Employment Application",
} as const;

export const ADVISOR_PROMPTS = [
  "Which country should I work in?",
  "What salary can I expect?",
  "How can I improve my chances?",
  "Which certificate should I obtain?",
  "Am I eligible for Germany?",
  "Am I eligible for Japan?",
  "Should I improve English?",
] as const;

export const PREFERRED_INDUSTRIES = [
  "Construction",
  "Healthcare",
  "Hospitality",
  "Information Technology",
  "Engineering",
  "Manufacturing",
  "Logistics",
  "Education",
  "Oil & Gas",
  "Agriculture",
  "Retail",
  "Automotive",
  "Security",
  "Domestic Work",
  "Other",
] as const;
