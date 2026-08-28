import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { GenericAdminList } from "@/components/admin/generic-admin-list";
import { StatusBadge } from "@/components/admin/status-badge";

export default async function ConsultationsPage() {
  const consultations = await prisma.consultationBooking.findMany({
    where: { deletedAt: null },
    include: {
      student: { select: { name: true, email: true } },
      agent: { include: { user: { select: { name: true } } } },
    },
    orderBy: { scheduledAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Consultations" description="Manage consultation bookings." />
      <GenericAdminList
        resource="consultations"
        canImport={false}
        data={consultations.map((c) => ({
          id: c.id,
          student: c.student.name ?? c.student.email,
          agent: c.agent?.user.name ?? "Unassigned",
          type: c.type,
          scheduled: new Date(c.scheduledAt).toLocaleString(),
          status: c.status,
        }))}
        columns={[
          { key: "student", header: "Student", accessor: "student" },
          { key: "agent", header: "Agent", accessor: "agent" },
          { key: "type", header: "Type", accessor: "type" },
          { key: "scheduled", header: "Scheduled", accessor: "scheduled" },
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
