import { Suspense } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { EmploymentCrudClient } from "@/components/admin/employment-crud-client";

export default async function EmploymentNotificationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const pick = (k: string) =>
    typeof params[k] === "string" ? (params[k] as string) : undefined;

  const q = pick("q")?.trim();
  const type = pick("type")?.trim();

  const where: Prisma.NotificationWhereInput = {
    status: "ACTIVE",
    OR: [
      { data: { path: ["source"], equals: "employment" } },
      { title: { contains: "Application", mode: "insensitive" } },
      { title: { contains: "Payment", mode: "insensitive" } },
      { title: { contains: "Document", mode: "insensitive" } },
      { title: { contains: "employment", mode: "insensitive" } },
    ],
  };
  if (type) where.type = type as never;
  if (q) {
    where.AND = [
      {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { body: { contains: q, mode: "insensitive" } },
        ],
      },
    ];
  }

  const [notifications, workers] = await Promise.all([
    prisma.notification.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 300,
    }),
    prisma.workerProfile.findMany({
      where: { deletedAt: null },
      select: {
        userId: true,
        fullName: true,
        user: { select: { email: true } },
      },
      take: 200,
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const rows = notifications.map((n) => ({
    id: n.id,
    userId: n.userId,
    user: n.user.name ?? n.user.email,
    email: n.user.email,
    type: n.type,
    title: n.title,
    body: n.body,
    read: n.readAt ? "Read" : "Unread",
    createdAt: new Date(n.createdAt).toLocaleString(),
  }));

  return (
    <Suspense>
      <EmploymentCrudClient
        title="Employment Notifications"
        description="Employment-related notifications from the database. Create to notify a worker."
        rows={rows}
        columns={[
          { key: "user", header: "User" },
          { key: "type", header: "Type" },
          { key: "title", header: "Title" },
          { key: "read", header: "Read", badge: true },
          { key: "createdAt", header: "Created" },
        ]}
        filters={[
          {
            key: "type",
            label: "Type",
            type: "select",
            options: [
              { value: "APPLICATION_UPDATE", label: "Application update" },
              { value: "PAYMENT", label: "Payment" },
              { value: "DOCUMENT_STATUS", label: "Document status" },
              { value: "MESSAGE", label: "Message" },
            ],
          },
        ]}
        formFields={[
          {
            key: "userId",
            label: "Worker",
            type: "select",
            options: workers.map((w) => ({
              value: w.userId,
              label: `${w.fullName ?? w.user.email} (${w.user.email})`,
            })),
            required: true,
          },
          {
            key: "type",
            label: "Type",
            type: "select",
            options: [
              { value: "APPLICATION_UPDATE", label: "Application update" },
              { value: "PAYMENT", label: "Payment" },
              { value: "DOCUMENT_STATUS", label: "Document status" },
              { value: "MESSAGE", label: "Message" },
            ],
          },
          { key: "title", label: "Title", required: true },
          { key: "body", label: "Body", type: "textarea", required: true },
        ]}
        createUrl="/api/admin/employment/notifications"
        canEdit={false}
        deleteEnabled={false}
      />
    </Suspense>
  );
}
