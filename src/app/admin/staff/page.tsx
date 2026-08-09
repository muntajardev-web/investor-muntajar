import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { GenericAdminList } from "@/components/admin/generic-admin-list";
import { StatusBadge } from "@/components/admin/status-badge";

export default async function StaffPage() {
  const staff = await prisma.adminUser.findMany({
    where: { deletedAt: null },
    include: { user: { select: { name: true, email: true, role: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Staff" description="Admin users and role permissions." />
      <GenericAdminList
        resource="staff"
        canImport={false}
        data={staff.map((s) => ({
          id: s.id,
          name: s.user.name ?? s.user.email,
          email: s.user.email,
          department: s.department ?? "—",
          title: s.title ?? "—",
          role: s.user.role,
          status: s.status,
        }))}
        columns={[
          { key: "name", header: "Name", accessor: "name" },
          { key: "email", header: "Email", accessor: "email" },
          { key: "department", header: "Department", accessor: "department" },
          { key: "role", header: "Role", accessor: "role" },
          {
            key: "status",
            header: "Status",
            render: (r) => <StatusBadge status={r.status as string} />,
          },
        ]}
      />
    </div>
  );
}
