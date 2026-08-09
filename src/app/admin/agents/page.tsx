import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { GenericAdminList } from "@/components/admin/generic-admin-list";
import { StatusBadge } from "@/components/admin/status-badge";

export default async function AgentsPage() {
  const agents = await prisma.agent.findMany({
    where: { deletedAt: null },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Agents" description="Manage education agents and counselors." />
      <GenericAdminList
        resource="agents"
        canImport={false}
        data={agents.map((a) => ({
          id: a.id,
          name: a.user.name ?? a.user.email,
          agency: a.agencyName,
          license: a.licenseNumber ?? "—",
          students: a.totalStudents,
          rating: a.rating ?? 0,
          status: a.status,
        }))}
        columns={[
          { key: "name", header: "Name", accessor: "name" },
          { key: "agency", header: "Agency", accessor: "agency" },
          { key: "license", header: "License", accessor: "license" },
          { key: "students", header: "Students", accessor: "students" },
          { key: "rating", header: "Rating", accessor: "rating" },
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
