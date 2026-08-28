import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { revalidateStudentShell } from "@/lib/student/shell";

const bodySchema = z.object({
  id: z.string().uuid().optional(),
  all: z.boolean().optional(),
});

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

    revalidateStudentShell(session.user.id);
    return apiSuccess({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
