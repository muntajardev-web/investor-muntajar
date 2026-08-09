import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  User,
  FolderOpen,
  Sparkles,
  Building2,
  FileStack,
  ClipboardCheck,
  Map,
  Wrench,
  MessageSquare,
  FileText,
  CreditCard,
  BadgeCheck,
  Send,
  Receipt,
  GraduationCap,
  Languages,
} from "lucide-react";

export interface EmploymentNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  step?: number;
  description?: string;
}

/** Journey steps — shown in stepper and sidebar with numbers */
export const JOURNEY_STEPS: EmploymentNavItem[] = [
  {
    step: 1,
    title: "Complete Profile",
    href: "/work/employment/profile",
    icon: User,
    description: "Personal info, education, experience, skills",
  },
  {
    step: 2,
    title: "Upload Documents",
    href: "/work/employment/documents",
    icon: FolderOpen,
    description: "Passport, certificates, medical, police clearance",
  },
  {
    step: 3,
    title: "AI Screening",
    href: "/work/employment/analysis",
    icon: Sparkles,
    description: "Automated profile screening and report generation",
  },
  {
    step: 4,
    title: "View AI Report",
    href: "/work/employment/analysis",
    icon: Sparkles,
    description: "Employability score, strengths, recommendations",
  },
  {
    step: 5,
    title: "Skill Analysis",
    href: "/work/employment/skills",
    icon: Wrench,
    description: "Current skills, recommended additions, certifications",
  },
  {
    step: 6,
    title: "Job Matches",
    href: "/work/employment/jobs",
    icon: Building2,
    description: "Live job matching with compatibility scores",
  },
  {
    step: 7,
    title: "Resume Builder",
    href: "/work/employment/builder",
    icon: FileStack,
    description: "Build, edit, and download your ATS resume",
  },
  {
    step: 8,
    title: "Apply",
    href: "/work/employment/review",
    icon: ClipboardCheck,
    description: "Review checklist and submit your application",
  },
  {
    step: 9,
    title: "Track Progress",
    href: "/work/employment/tracker",
    icon: Map,
    description: "Application status, interviews, offer, and relocation",
  },
];

/** Full nav list for sidebar — includes non-journey items */
export const employmentNavItems: EmploymentNavItem[] = [
  { title: "Overview", href: "/work/employment", icon: LayoutDashboard },
  // Profile sub-pages
  { title: "Profile Builder", href: "/work/employment/profile", icon: User, step: 1 },
  { title: "Education", href: "/work/employment/education", icon: GraduationCap },
  { title: "Experience", href: "/work/employment/experience", icon: Building2 },
  { title: "Skills", href: "/work/employment/skills", icon: Wrench, step: 5 },
  { title: "Languages", href: "/work/employment/languages", icon: Languages },
  // Documents
  { title: "Documents", href: "/work/employment/documents", icon: FolderOpen, step: 2 },
  // AI
  { title: "AI Analysis", href: "/work/employment/analysis", icon: Sparkles, step: 3 },
  // Matching
  { title: "Job Matches", href: "/work/employment/jobs", icon: Building2, step: 6 },
  { title: "Career Coach", href: "/work/employment/advisor", icon: MessageSquare },
  // Application
  { title: "Resume Builder", href: "/work/employment/builder", icon: FileStack, step: 7 },
  { title: "Cover Letter", href: "/work/employment/cover-letter", icon: FileText },
  { title: "Review & Apply", href: "/work/employment/review", icon: ClipboardCheck, step: 8 },
  { title: "Payment", href: "/work/employment/payment", icon: CreditCard },
  { title: "Confirmation", href: "/work/employment/confirmation", icon: BadgeCheck },
  { title: "Submission", href: "/work/employment/submission", icon: Send },
  { title: "Receipt", href: "/work/employment/receipt", icon: Receipt },
  // Tracking
  { title: "Tracker", href: "/work/employment/tracker", icon: Map, step: 9 },
];
