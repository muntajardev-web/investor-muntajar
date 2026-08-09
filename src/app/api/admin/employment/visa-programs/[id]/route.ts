import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/server/api";
import { withAdminAuth } from "@/lib/admin/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await withAdminAuth("employment:visa:write");
    const { id } = await params;
    const body = await request.json();
    const program = await prisma.visaProgram.update({
      where: { id },
      data: {
        countryCode: body.countryCode
          ? String(body.countryCode).slice(0, 2).toUpperCase()
          : undefined,
        countryName: body.countryName ?? undefined,
        name: body.name ?? undefined,
        description: body.description ?? undefined,
        processingDays: body.processingDays ?? undefined,
        successRate: body.successRate ?? undefined,
        fees: body.fees ?? undefined,
        feesCurrency: body.feesCurrency ?? undefined,
        validityPeriod: body.validityPeriod ?? undefined,
        visaSponsorship:
          typeof body.visaSponsorship === "boolean"
            ? body.visaSponsorship
            : undefined,
        status: body.status ?? undefined,
      },
    });
    return apiSuccess({ program });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await withAdminAuth("employment:visa:write");
    const { id } = await params;
    await prisma.visaProgram.update({
      where: { id },
      data: { deletedAt: new Date(), status: "INACTIVE" },
    });
    return apiSuccess({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
