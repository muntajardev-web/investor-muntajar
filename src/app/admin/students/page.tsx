import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { GenericAdminList } from "@/components/admin/generic-admin-list";
import { StatusBadge } from "@/components/admin/status-badge";

export default async function StudentsPage() {
  const students = await prisma.user.findMany({
    where: { role: "STUDENT", deletedAt: null },
    include: { studentProfile: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Students" description="Manage student accounts and profiles." />
      <GenericAdminList
        resource="students"
        canImport={false}
        data={students.map((s) => ({
          id: s.id,
          name: s.name ?? "—",
          email: s.email,
          degree: s.studentProfile?.degreeLevel ?? "—",
          countries: s.studentProfile?.targetCountries.join(", ") || "—",
          profile: s.studentProfile?.isComplete ? "Complete" : "Incomplete",
          status: s.status,
        }))}
        columns={[
          { key: "name", header: "Name", accessor: "name" },
          { key: "email", header: "Email", accessor: "email" },
          { key: "degree", header: "Degree", accessor: "degree" },
          { key: "countries", header: "Target", accessor: "countries" },
          { key: "profile", header: "Profile", accessor: "profile" },
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
