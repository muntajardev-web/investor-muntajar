import { PageHeader } from "@/components/admin/page-header";
import { SettingsClient } from "./settings-client";
import { getPermissions, ADMIN_ROLES } from "@/lib/admin/permissions";
import type { UserRole } from "@prisma/client";

export default function SettingsPage() {
  const rolePermissions = ADMIN_ROLES.map((role) => ({
    role,
    permissions: getPermissions(role as UserRole),
  }));

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Platform configuration, roles, and preferences."
      />
      <SettingsClient rolePermissions={rolePermissions} />
    </div>
  );
}
