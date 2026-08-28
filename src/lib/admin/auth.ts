import type { UserRole } from "@prisma/client";
import { requireRole } from "@/server/auth/session";
import { ForbiddenError } from "@/lib";
import {
  hasPermission,
  type AdminPermission,
  ADMIN_ROLES,
} from "./permissions";

export async function withAdminAuth(permission?: AdminPermission) {
  const session = await requireRole(ADMIN_ROLES);

  if (permission && !hasPermission(session.user.role, permission)) {
    throw new ForbiddenError();
  }

  return session;
}

export function canAccess(role: UserRole, permission: AdminPermission) {
  return hasPermission(role, permission);
}
