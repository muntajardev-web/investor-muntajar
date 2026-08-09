import { NextRequest } from "next/server";
import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;

    const invoice = await prisma.invoice.findFirst({
      where: {
        OR: [{ id }, { invoiceNumber: id }],
        userId: session.user.id,
        deletedAt: null,
      },
      include: { payment: true },
    });

    if (!invoice) {
      throw new AppError("NOT_FOUND", "Invoice not found", 404);
    }

    return apiSuccess({ invoice });
  } catch (error) {
    return handleApiError(error);
  }
}
