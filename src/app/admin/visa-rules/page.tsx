import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { GenericAdminList } from "@/components/admin/generic-admin-list";
import { StatusBadge } from "@/components/admin/status-badge";

export default async function VisaRulesPage() {
  const rules = await prisma.visaRule.findMany({
    where: { deletedAt: null },
    include: { country: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Visa Rules" description="Country visa requirements and success rates." />
      <GenericAdminList
        resource="visa-rules"
        data={rules.map((r) => ({
          id: r.id,
          title: r.title,
          country: r.country.name,
          type: r.visaType,
          processing: r.processingDays ? `${r.processingDays} days` : "—",
          success: r.successRate ? `${r.successRate}%` : "—",
          status: r.status,
        }))}
        columns={[
          { key: "title", header: "Title", accessor: "title" },
          { key: "country", header: "Country", accessor: "country" },
          { key: "type", header: "Type", accessor: "type" },
          { key: "processing", header: "Processing", accessor: "processing" },
          { key: "success", header: "Success Rate", accessor: "success" },
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
