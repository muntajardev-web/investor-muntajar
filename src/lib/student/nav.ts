import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  User,
  Sparkles,
  Building2,
  FileText,
  FolderOpen,
  Calendar,
  MessageCircle,
  Compass,
  Globe,
  BookOpen,
} from "lucide-react";

export interface StudentNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const studentNavItems: StudentNavItem[] = [
  { title: "Overview", href: "/dashboard", icon: LayoutGrid },
  { title: "My Profile", href: "/dashboard/profile", icon: User },
  { title: "Recommendations", href: "/dashboard/recommendations", icon: Sparkles },
  { title: "Universities", href: "/dashboard/recommendations", icon: Building2 },
  { title: "Applications", href: "/dashboard/applications", icon: FileText },
  { title: "Documents", href: "/dashboard/documents", icon: FolderOpen },
  { title: "Appointments", href: "/dashboard/appointments", icon: Calendar },
  { title: "Messages", href: "/dashboard/messages", icon: MessageCircle },
  { title: "Scholarships", href: "/dashboard/recommendations", icon: Compass },
  { title: "Visa Guidance", href: "/dashboard/eligibility", icon: Globe },
  { title: "Resources", href: "/dashboard/eligibility", icon: BookOpen },
];

export const studentNavSecondary: StudentNavItem[] = [
  { title: "Universities", href: "/dashboard/recommendations", icon: Building2 },
];
