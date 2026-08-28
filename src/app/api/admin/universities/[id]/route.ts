import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/server/api";
import { withAdminAuth } from "@/lib/admin/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await withAdminAuth("universities:write");
    const { id } = await params;
    const body = await request.json();

    const university = await prisma.university.update({
      where: { id },
      data: {
        name: body.name,
        city: body.city,
        website: body.website,
        acceptanceRate: body.acceptanceRate,
        status: body.status,
      },
      include: { country: true },
    });

    return apiSuccess(university);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await withAdminAuth("universities:write");
    const { id } = await params;

    await prisma.university.update({
      where: { id },
      data: { deletedAt: new Date(), status: "ARCHIVED" },
    });

    return apiSuccess({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
