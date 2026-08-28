import {
  BookOpen,
  Briefcase,
  CircleHelp,
  Globe,
  GraduationCap,
  Star,
  CircleCheck,
  type LucideIcon,
} from "lucide-react";

export const contact = {
  email: "info@muntajar.com",
  phone: "+8801886728855",
  whatsapp: "+8801886728855",
  address: "Taltola, Khilgaon, Dhaka, Bangladesh",
};

/** Set true for dark full-bleed hero (white nav text). False for light split hero. */
export const homeHeroDark = true;

export type NavItem = {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const servicesNav: NavItem[] = [
  {
    label: "Study Abroad",
    href: "/services/study-abroad",
    description: "Universities & scholarships",
    icon: GraduationCap,
  },
  {
    label: "Overseas Jobs",
    href: "/services/workforce",
    description: "Verified employers abroad",
    icon: Briefcase,
  },
  {
    label: "Visa & Migration",
    href: "/services/visa-migration",
    description: "Routes & eligibility",
    icon: Globe,
  },
];

export const resourcesNav: NavItem[] = [
  {
    label: "Guides",
    href: "/guides",
    description: "Country & visa guides",
    icon: BookOpen,
  },
  {
    label: "Success Stories",
    href: "/success-stories",
    description: "Real journeys",
    icon: Star,
  },
  {
    label: "FAQ",
    href: "/faq",
    description: "Common questions",
    icon: CircleHelp,
  },
  {
    label: "Check Eligibility",
    href: "/check-eligibility",
    description: "Quick assessment",
    icon: CircleCheck,
  },
];

export const aboutNav: NavItem[] = [
  { label: "About Us", href: "/about", description: "Our mission" },
  { label: "Investors", href: "/investors", description: "Partner with us" },
  { label: "Contact", href: "/contact", description: "Get in touch" },
];

export const mainNavLinks = [
  { label: "Destinations", href: "/destinations" },
  { label: "Pricing", href: "/pricing" },
  { label: "Investors", href: "/investors" },
];

export const footerLinks = {
  services: [
    { label: "Study Abroad", href: "/services/study-abroad" },
    { label: "Skilled Professionals", href: "/services/skilled-professionals" },
    { label: "Workforce", href: "/services/workforce" },
    { label: "Visa & Migration", href: "/services/visa-migration" },
    { label: "Check Eligibility", href: "/check-eligibility" },
  ],
  explore: [
    { label: "Destinations", href: "/destinations" },
    { label: "Country Guides", href: "/guides" },
    { label: "Success Stories", href: "/success-stories" },
    { label: "FAQ", href: "/faq" },
    { label: "Pricing", href: "/pricing" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Investors", href: "/investors" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};
