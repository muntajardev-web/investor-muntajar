import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { GenericAdminList } from "@/components/admin/generic-admin-list";
import { StatusBadge } from "@/components/admin/status-badge";

export default async function ScholarshipsPage() {
  const scholarships = await prisma.scholarship.findMany({
    where: { deletedAt: null },
    include: { university: { select: { name: true } } },
    orderBy: { deadline: "asc" },
  });

  return (
    <div>
      <PageHeader title="Scholarships" description="Manage scholarship catalog." />
      <GenericAdminList
        resource="scholarships"
        data={scholarships.map((s) => ({
          id: s.id,
          name: s.name,
          university: s.university?.name ?? "—",
          type: s.type,
          amount: s.amount ? `${s.amount} ${s.currency}` : "—",
          deadline: s.deadline?.toLocaleDateString() ?? "—",
          status: s.status,
        }))}
        columns={[
          { key: "name", header: "Name", accessor: "name" },
          { key: "university", header: "University", accessor: "university" },
          { key: "type", header: "Type", accessor: "type" },
          { key: "amount", header: "Amount", accessor: "amount" },
          { key: "deadline", header: "Deadline", accessor: "deadline" },
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
