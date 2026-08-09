import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Building2,
  GraduationCap,
  Award,
  FileText,
  Users,
  Calendar,
  Globe,
  Stamp,
  UserCog,
  Shield,
  MessageSquare,
  Bell,
  FolderOpen,
  BarChart3,
  Settings,
  Sparkles,
  Briefcase,
  Building,
  CreditCard,
  LineChart,
  ClipboardList,
  LifeBuoy,
  MapPinned,
  Wallet,
  Factory,
} from "lucide-react";
import type { AdminPermission } from "./permissions";

export interface AdminNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  permission?: AdminPermission;
}

export interface AdminNavGroup {
  label?: string;
  items: AdminNavItem[];
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        permission: "dashboard:view",
      },
      {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
        permission: "analytics:view",
      },
    ],
  },
  {
    label: "Employment",
    items: [
      {
        title: "Overview",
        href: "/admin/employment",
        icon: Briefcase,
        permission: "employment:dashboard",
      },
      {
        title: "Workers",
        href: "/admin/employment/workers",
        icon: Users,
        permission: "employment:workers:read",
      },
      {
        title: "Employers",
        href: "/admin/employment/employers",
        icon: Building,
        permission: "employment:employers:read",
      },
      {
        title: "Companies",
        href: "/admin/employment/companies",
        icon: Factory,
        permission: "employment:employers:read",
      },
      {
        title: "Jobs",
        href: "/admin/employment/jobs",
        icon: Briefcase,
        permission: "employment:jobs:read",
      },
      {
        title: "Countries",
        href: "/admin/employment/countries",
        icon: Globe,
        permission: "countries:read",
      },
      {
        title: "Visa Programs",
        href: "/admin/employment/visa-programs",
        icon: MapPinned,
        permission: "employment:visa:read",
      },
      {
        title: "Applications",
        href: "/admin/employment/applications",
        icon: FileText,
        permission: "employment:applications:read",
      },
      {
        title: "Payments",
        href: "/admin/employment/payments",
        icon: CreditCard,
        permission: "employment:payments:read",
      },
      {
        title: "AI Costs",
        href: "/admin/employment/ai-costs",
        icon: Wallet,
        permission: "audit:view",
      },
      {
        title: "Analytics",
        href: "/admin/employment/analytics",
        icon: LineChart,
        permission: "employment:analytics:view",
      },
      {
        title: "Reports",
        href: "/admin/employment/reports",
        icon: ClipboardList,
        permission: "employment:reports:view",
      },
      {
        title: "Notifications",
        href: "/admin/employment/notifications",
        icon: Bell,
        permission: "notifications:read",
      },
      {
        title: "Support Tickets",
        href: "/admin/employment/tickets",
        icon: LifeBuoy,
        permission: "employment:tickets:read",
      },
    ],
  },
  {
    label: "Catalog",
    items: [
      {
        title: "Universities",
        href: "/admin/universities",
        icon: Building2,
        permission: "universities:read",
      },
      {
        title: "Programs",
        href: "/admin/programs",
        icon: GraduationCap,
        permission: "programs:read",
      },
      {
        title: "Scholarships",
        href: "/admin/scholarships",
        icon: Award,
        permission: "scholarships:read",
      },
      {
        title: "Countries",
        href: "/admin/countries",
        icon: Globe,
        permission: "countries:read",
      },
      {
        title: "Visa Rules",
        href: "/admin/visa-rules",
        icon: Stamp,
        permission: "visa_rules:read",
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        title: "Applications",
        href: "/admin/applications",
        icon: FileText,
        permission: "applications:read",
      },
      {
        title: "Students",
        href: "/admin/students",
        icon: Users,
        permission: "students:read",
      },
      {
        title: "Consultations",
        href: "/admin/consultations",
        icon: Calendar,
        permission: "consultations:read",
      },
      {
        title: "Documents",
        href: "/admin/documents",
        icon: FolderOpen,
        permission: "documents:read",
      },
      {
        title: "AI Audit",
        href: "/admin/ai-logs",
        icon: Sparkles,
        permission: "audit:view",
      },
    ],
  },
  {
    label: "Team",
    items: [
      {
        title: "Agents",
        href: "/admin/agents",
        icon: UserCog,
        permission: "agents:read",
      },
      {
        title: "Staff",
        href: "/admin/staff",
        icon: Shield,
        permission: "staff:read",
      },
      {
        title: "Messages",
        href: "/admin/messages",
        icon: MessageSquare,
        permission: "messages:read",
      },
      {
        title: "Notifications",
        href: "/admin/notifications",
        icon: Bell,
        permission: "notifications:read",
      },
    ],
  },
  {
    items: [
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
        permission: "settings:read",
      },
    ],
  },
];

export const adminSearchItems = adminNavGroups.flatMap((g) => g.items);
