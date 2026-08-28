import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { GenericAdminList } from "@/components/admin/generic-admin-list";
import { StatusBadge } from "@/components/admin/status-badge";

export default async function ProgramsPage() {
  const programs = await prisma.program.findMany({
    where: { deletedAt: null },
    include: { university: { select: { name: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader title="Programs" description="Manage degree programs and courses." />
      <GenericAdminList
        resource="programs"
        searchPlaceholder="Search programs..."
        data={programs.map((p) => ({
          id: p.id,
          name: p.name,
          university: p.university.name,
          field: p.field ?? "—",
          degreeLevel: p.degreeLevel,
          tuition: p.tuitionFee ? `${p.tuitionFee} ${p.currency}` : "—",
          status: p.status,
        }))}
        columns={[
          { key: "name", header: "Program", accessor: "name" },
          { key: "university", header: "University", accessor: "university" },
          { key: "field", header: "Field", accessor: "field" },
          { key: "degree", header: "Level", accessor: "degreeLevel" },
          { key: "tuition", header: "Tuition", accessor: "tuition" },
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
