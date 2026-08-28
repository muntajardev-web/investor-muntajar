import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireAuth();
    const documents = await prisma.employmentDocument.findMany({
      where: { userId: session.user.id, deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess({ documents });
  } catch (error) {
    return handleApiError(error);
  }
}
