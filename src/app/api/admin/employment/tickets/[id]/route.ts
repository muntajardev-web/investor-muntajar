import { NextRequest } from "next/server";
import type { SupportTicketPriority, SupportTicketStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/server/api";
import { withAdminAuth } from "@/lib/admin/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await withAdminAuth("employment:tickets:write");
    const { id } = await params;
    const body = await request.json();
    const status = body.status as SupportTicketStatus | undefined;

    const ticket = await prisma.supportTicket.update({
      where: { id },
      data: {
        subject: body.subject ?? undefined,
        body: body.body ?? undefined,
        status,
        priority: (body.priority as SupportTicketPriority | undefined) ?? undefined,
        assignedToId:
          body.assignedToId === undefined
            ? undefined
            : body.assignedToId || null,
        resolution: body.resolution ?? undefined,
        resolvedAt:
          status === "RESOLVED" || status === "CLOSED"
            ? new Date()
            : undefined,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
    return apiSuccess({ ticket });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await withAdminAuth("employment:tickets:write");
    const { id } = await params;
    await prisma.supportTicket.update({
      where: { id },
      data: { deletedAt: new Date(), status: "CLOSED" },
    });
    return apiSuccess({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
