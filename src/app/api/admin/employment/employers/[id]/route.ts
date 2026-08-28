import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/server/api";
import { withAdminAuth } from "@/lib/admin/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await withAdminAuth("employment:employers:write");
    const { id } = await params;
    const body = await request.json();
    const employer = await prisma.employer.update({
      where: { id },
      data: {
        name: body.name ?? undefined,
        kind: body.kind ?? undefined,
        country: body.country ?? undefined,
        city: body.city ?? undefined,
        website: body.website ?? undefined,
        email: body.email ?? undefined,
        phone: body.phone ?? undefined,
        industry: body.industry ?? undefined,
        description: body.description ?? undefined,
        status: body.status ?? undefined,
      },
    });
    return apiSuccess({ employer });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await withAdminAuth("employment:employers:write");
    const { id } = await params;
    await prisma.employer.update({
      where: { id },
      data: { deletedAt: new Date(), status: "INACTIVE" },
    });
    return apiSuccess({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
