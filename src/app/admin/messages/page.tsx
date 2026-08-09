import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { GenericAdminList } from "@/components/admin/generic-admin-list";
import { StatusBadge } from "@/components/admin/status-badge";

export default async function MessagesPage() {
  const messages = await prisma.message.findMany({
    where: { deletedAt: null },
    include: {
      sender: { select: { name: true, email: true } },
      recipient: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <PageHeader title="Messages" description="Student and agent communications." />
      <GenericAdminList
        resource="messages"
        canImport={false}
        data={messages.map((m) => ({
          id: m.id,
          from: m.sender.name ?? m.sender.email,
          to: m.recipient.name ?? m.recipient.email,
          subject: m.subject ?? "—",
          preview: m.body.slice(0, 60) + (m.body.length > 60 ? "…" : ""),
          status: m.status,
          date: new Date(m.createdAt).toLocaleString(),
        }))}
        columns={[
          { key: "from", header: "From", accessor: "from" },
          { key: "to", header: "To", accessor: "to" },
          { key: "subject", header: "Subject", accessor: "subject" },
          { key: "preview", header: "Preview", accessor: "preview" },
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
