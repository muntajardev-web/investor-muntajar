import { Suspense } from "react";
import type { Prisma, SupportTicketPriority, SupportTicketStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { EmploymentCrudClient } from "@/components/admin/employment-crud-client";

export default async function EmploymentTicketsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const pick = (k: string) =>
    typeof params[k] === "string" ? (params[k] as string) : undefined;

  const q = pick("q")?.trim();
  const status = pick("status")?.trim();
  const priority = pick("priority")?.trim();

  const where: Prisma.SupportTicketWhereInput = {
    deletedAt: null,
    category: "employment",
  };
  if (status) where.status = status as SupportTicketStatus;
  if (priority) where.priority = priority as SupportTicketPriority;
  if (q) {
    where.OR = [
      { subject: { contains: q, mode: "insensitive" } },
      { body: { contains: q, mode: "insensitive" } },
      { user: { email: { contains: q, mode: "insensitive" } } },
    ];
  }

  const [tickets, workers] = await Promise.all([
    prisma.supportTicket.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
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

  const rows = tickets.map((t) => ({
    id: t.id,
    userId: t.userId,
    subject: t.subject,
    body: t.body,
    user: t.user.name ?? t.user.email,
    email: t.user.email,
    assignedTo: t.assignedTo?.name ?? t.assignedTo?.email ?? "—",
    status: t.status,
    priority: t.priority,
    resolution: t.resolution ?? "",
    createdAt: new Date(t.createdAt).toLocaleString(),
  }));

  return (
    <Suspense>
      <EmploymentCrudClient
        title="Support Tickets"
        description="Employment support tickets with status, priority, and assignment."
        rows={rows}
        columns={[
          { key: "subject", header: "Subject" },
          { key: "user", header: "Requester" },
          { key: "priority", header: "Priority", badge: true },
          { key: "status", header: "Status", badge: true },
          { key: "assignedTo", header: "Assignee" },
          { key: "createdAt", header: "Created" },
        ]}
        filters={[
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "OPEN", label: "Open" },
              { value: "IN_PROGRESS", label: "In progress" },
              { value: "WAITING_USER", label: "Waiting user" },
              { value: "RESOLVED", label: "Resolved" },
              { value: "CLOSED", label: "Closed" },
            ],
          },
          {
            key: "priority",
            label: "Priority",
            type: "select",
            options: [
              { value: "LOW", label: "Low" },
              { value: "MEDIUM", label: "Medium" },
              { value: "HIGH", label: "High" },
              { value: "URGENT", label: "Urgent" },
            ],
          },
        ]}
        formFields={[
          {
            key: "userId",
            label: "Requester",
            type: "select",
            options: workers.map((w) => ({
              value: w.userId,
              label: `${w.fullName ?? w.user.email} (${w.user.email})`,
            })),
            required: true,
          },
          { key: "subject", label: "Subject", required: true },
          { key: "body", label: "Body", type: "textarea", required: true },
          {
            key: "priority",
            label: "Priority",
            type: "select",
            options: [
              { value: "LOW", label: "Low" },
              { value: "MEDIUM", label: "Medium" },
              { value: "HIGH", label: "High" },
              { value: "URGENT", label: "Urgent" },
            ],
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "OPEN", label: "Open" },
              { value: "IN_PROGRESS", label: "In progress" },
              { value: "WAITING_USER", label: "Waiting user" },
              { value: "RESOLVED", label: "Resolved" },
              { value: "CLOSED", label: "Closed" },
            ],
          },
          { key: "resolution", label: "Resolution", type: "textarea" },
        ]}
        createUrl="/api/admin/employment/tickets"
        updateUrl={(id) => `/api/admin/employment/tickets/${id}`}
      />
    </Suspense>
  );
}
