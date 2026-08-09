import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/server/api";
import { withAdminAuth } from "@/lib/admin/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await withAdminAuth("applications:write");
    const { id } = await params;
    const body = await request.json();

    const application = await prisma.application.update({
      where: { id },
      data: {
        status: body.status,
        agentId: body.agentId,
        ...(body.status === "SUBMITTED" && { submittedAt: new Date() }),
      },
    });

    await prisma.applicationTimeline.create({
      data: {
        applicationId: id,
        eventType: body.agentId ? "AGENT_ASSIGNED" : "STATUS_CHANGED",
        title: body.agentId
          ? "Counselor assigned"
          : `Status changed to ${body.status}`,
        metadata: body,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entityType: "application",
        entityId: id,
        metadata: body,
      },
    });

    return apiSuccess(application);
  } catch (error) {
    return handleApiError(error);
  }
}
