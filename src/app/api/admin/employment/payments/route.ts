import { NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/server/api";
import { withAdminAuth } from "@/lib/admin/auth";
import { employmentPaymentWhere } from "@/lib/admin/employment-queries";

export async function GET(request: NextRequest) {
  try {
    await withAdminAuth("employment:payments:read");
    const sp = request.nextUrl.searchParams;
    const q = sp.get("q")?.trim();
    const status = sp.get("status")?.trim();
    const provider = sp.get("provider")?.trim();
    const from = sp.get("from");
    const to = sp.get("to");

    const where = employmentPaymentWhere({
      ...(status ? { status: status as never } : {}),
      ...(provider ? { provider: provider as never } : {}),
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    });

    if (q) {
      (where as Prisma.PaymentWhereInput).OR = [
        { description: { contains: q, mode: "insensitive" } },
        { providerRef: { contains: q, mode: "insensitive" } },
        { user: { email: { contains: q, mode: "insensitive" } } },
        { user: { name: { contains: q, mode: "insensitive" } } },
      ];
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        invoice: true,
      },
      orderBy: { createdAt: "desc" },
      take: 300,
    });
    return apiSuccess({ payments });
  } catch (error) {
    return handleApiError(error);
  }
}
