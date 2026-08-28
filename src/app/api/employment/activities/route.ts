import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireAuth();
    const activities = await prisma.employmentActivity.findMany({
      where: { userId: session.user.id, deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return apiSuccess({ activities });
  } catch (error) {
    return handleApiError(error);
  }
}
