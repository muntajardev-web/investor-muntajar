import { NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/server/api";
import { withAdminAuth } from "@/lib/admin/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await withAdminAuth("employment:workers:write");
    const { id } = await params;
    const body = await request.json();

    const worker = await prisma.workerProfile.update({
      where: { id },
      data: {
        fullName: body.fullName ?? undefined,
        email: body.email ?? undefined,
        phone: body.phone ?? undefined,
        nationality: body.nationality ?? undefined,
        currentCountry: body.currentCountry ?? undefined,
        currentCity: body.currentCity ?? undefined,
        isComplete:
          typeof body.isComplete === "boolean" ? body.isComplete : undefined,
        preferredCountries: Array.isArray(body.preferredCountries)
          ? body.preferredCountries
          : undefined,
        preferredIndustries: Array.isArray(body.preferredIndustries)
          ? body.preferredIndustries
          : undefined,
      },
    });
    return apiSuccess({ worker });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await withAdminAuth("employment:workers:write");
    const { id } = await params;
    await prisma.workerProfile.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return apiSuccess({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
