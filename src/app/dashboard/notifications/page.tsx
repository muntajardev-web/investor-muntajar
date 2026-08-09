import { requireAuth } from "@/server/auth/session";
import { getStudentNotifications, hasStudentPaid } from "@/lib/student/queries";
import { PageHeader, EmptyPanel } from "@/components/student";
import { NotificationsList } from "@/components/student/notifications-list";
import { prisma } from "@/lib/prisma";

export default async function NotificationsPage() {
  const session = await requireAuth();
  let notifications = await getStudentNotifications(session.user.id);

  // Ensure paid users have at least a starter feed (e.g. paid before this shipped)
  if (notifications.length === 0 && (await hasStudentPaid(session.user.id))) {
    await prisma.notification.createMany({
      data: [
        {
          userId: session.user.id,
          type: "PAYMENT",
          title: "Welcome to your dashboard",
          body: "Your plan is active. Check Recommendations and finish uploading documents.",
        },
        {
          userId: session.user.id,
          type: "RECOMMENDATION",
          title: "Review your university shortlist",
          body: "Your matches are ranked by profile fit. Open Recommendations to compare options.",
        },
      ],
    });
    notifications = await getStudentNotifications(session.user.id);
  }

  const unread = notifications.filter((n) => !n.readAt);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description={
          unread.length > 0
            ? `${unread.length} unread`
            : notifications.length > 0
              ? "You're all caught up."
              : "Updates about applications and documents show up here."
        }
      />

      {notifications.length > 0 ? (
        <NotificationsList
          initial={notifications.map((n) => ({
            id: n.id,
            type: n.type,
            title: n.title,
            body: n.body,
            createdAt: n.createdAt.toISOString(),
            readAt: n.readAt?.toISOString() ?? null,
          }))}
        />
      ) : (
        <EmptyPanel
          title="No notifications yet"
          description="You'll get updates when you pay, get matches, or change an application."
        />
      )}
    </div>
  );
}
