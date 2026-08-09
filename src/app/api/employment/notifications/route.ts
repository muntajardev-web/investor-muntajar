import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { revalidateEmploymentShell } from "@/lib/employment/shell";

const bodySchema = z.object({
  id: z.string().uuid().optional(),
  all: z.boolean().optional(),
});

export async function GET() {
  try {
    const session = await requireAuth();
    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id, deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    const unreadCount = notifications.filter((n) => !n.readAt).length;
    return apiSuccess({ notifications, unreadCount });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = bodySchema.parse(await request.json());

    if (body.all) {
      await prisma.notification.updateMany({
        where: { userId: session.user.id, readAt: null, deletedAt: null },
        data: { readAt: new Date() },
      });
    } else if (body.id) {
      await prisma.notification.updateMany({
        where: {
          id: body.id,
          userId: session.user.id,
          deletedAt: null,
        },
        data: { readAt: new Date() },
      });
    } else {
      return NextResponse.json(
        { error: "Provide id or all: true" },
        { status: 400 },
      );
    }

    revalidateEmploymentShell(session.user.id);
    return apiSuccess({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
