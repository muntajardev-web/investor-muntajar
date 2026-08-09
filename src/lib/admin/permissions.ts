import type { UserRole } from "@prisma/client";

export type AdminPermission =
  | "dashboard:view"
  | "universities:read"
  | "universities:write"
  | "programs:read"
  | "programs:write"
  | "scholarships:read"
  | "scholarships:write"
  | "applications:read"
  | "applications:write"
  | "students:read"
  | "students:write"
  | "consultations:read"
  | "consultations:write"
  | "countries:read"
  | "countries:write"
  | "visa_rules:read"
  | "visa_rules:write"
  | "agents:read"
  | "agents:write"
  | "staff:read"
  | "staff:write"
  | "messages:read"
  | "messages:write"
  | "notifications:read"
  | "notifications:write"
  | "documents:read"
  | "documents:write"
  | "documents:verify"
  | "analytics:view"
  | "settings:read"
  | "settings:write"
  | "import:execute"
  | "audit:view"
  | "recommendations:view"
  | "employment:dashboard"
  | "employment:workers:read"
  | "employment:workers:write"
  | "employment:employers:read"
  | "employment:employers:write"
  | "employment:jobs:read"
  | "employment:jobs:write"
  | "employment:applications:read"
  | "employment:applications:write"
  | "employment:payments:read"
  | "employment:payments:write"
  | "employment:visa:read"
  | "employment:visa:write"
  | "employment:analytics:view"
  | "employment:reports:view"
  | "employment:tickets:read"
  | "employment:tickets:write";

const EMPLOYMENT_PERMISSIONS: AdminPermission[] = [
  "employment:dashboard",
  "employment:workers:read",
  "employment:workers:write",
  "employment:employers:read",
  "employment:employers:write",
  "employment:jobs:read",
  "employment:jobs:write",
  "employment:applications:read",
  "employment:applications:write",
  "employment:payments:read",
  "employment:payments:write",
  "employment:visa:read",
  "employment:visa:write",
  "employment:analytics:view",
  "employment:reports:view",
  "employment:tickets:read",
  "employment:tickets:write",
];

const ALL_PERMISSIONS: AdminPermission[] = [
  "dashboard:view",
  "universities:read",
  "universities:write",
  "programs:read",
  "programs:write",
  "scholarships:read",
  "scholarships:write",
  "applications:read",
  "applications:write",
  "students:read",
  "students:write",
  "consultations:read",
  "consultations:write",
  "countries:read",
  "countries:write",
  "visa_rules:read",
  "visa_rules:write",
  "agents:read",
  "agents:write",
  "staff:read",
  "staff:write",
  "messages:read",
  "messages:write",
  "notifications:read",
  "notifications:write",
  "documents:read",
  "documents:write",
  "documents:verify",
  "analytics:view",
  "settings:read",
  "settings:write",
  "import:execute",
  "audit:view",
  "recommendations:view",
  ...EMPLOYMENT_PERMISSIONS,
];

const ROLE_PERMISSIONS: Record<UserRole, AdminPermission[]> = {
  ADMIN: ALL_PERMISSIONS,
  AGENT: [
    "dashboard:view",
    "applications:read",
    "applications:write",
    "students:read",
    "consultations:read",
    "consultations:write",
    "messages:read",
    "messages:write",
    "documents:read",
    "documents:verify",
    "recommendations:view",
    "audit:view",
    "employment:dashboard",
    "employment:workers:read",
    "employment:employers:read",
    "employment:jobs:read",
    "employment:jobs:write",
    "employment:applications:read",
    "employment:applications:write",
    "employment:payments:read",
    "employment:visa:read",
    "employment:analytics:view",
    "employment:reports:view",
    "employment:tickets:read",
    "employment:tickets:write",
    "notifications:read",
    "notifications:write",
    "countries:read",
  ],
  STUDENT: [],
};

export function hasPermission(
  role: UserRole,
  permission: AdminPermission,
): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getPermissions(role: UserRole): AdminPermission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export const ADMIN_ROLES: UserRole[] = ["ADMIN", "AGENT"];
