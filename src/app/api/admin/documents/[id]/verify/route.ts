import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/server/api";
import { withAdminAuth } from "@/lib/admin/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await withAdminAuth("documents:verify");
    const { id } = await params;
    const body = await request.json();

    const verification = await prisma.documentVerification.upsert({
      where: { documentId: id },
      create: {
        documentId: id,
        verifiedById: session.user.id,
        status: body.status,
        notes: body.notes,
        verifiedAt: new Date(),
      },
      update: {
        status: body.status,
        verifiedById: session.user.id,
        verifiedAt: new Date(),
        notes: body.notes,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "VERIFY",
        entityType: "document",
        entityId: id,
        metadata: { status: body.status },
      },
    });

    return apiSuccess(verification);
  } catch (error) {
    return handleApiError(error);
  }
}
