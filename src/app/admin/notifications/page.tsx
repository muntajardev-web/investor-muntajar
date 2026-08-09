import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { GenericAdminList } from "@/components/admin/generic-admin-list";
import { StatusBadge } from "@/components/admin/status-badge";

export default async function NotificationsPage() {
  const notifications = await prisma.notification.findMany({
    where: { deletedAt: null },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <PageHeader title="Notifications" description="System and user notifications." />
      <GenericAdminList
        resource="notifications"
        canImport={false}
        data={notifications.map((n) => ({
          id: n.id,
          user: n.user.name ?? n.user.email,
          type: n.type,
          title: n.title,
          read: n.readAt ? "Read" : "Unread",
          status: n.status,
          date: new Date(n.createdAt).toLocaleString(),
        }))}
        columns={[
          { key: "user", header: "User", accessor: "user" },
          { key: "type", header: "Type", accessor: "type" },
          { key: "title", header: "Title", accessor: "title" },
          { key: "read", header: "Read", accessor: "read" },
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
