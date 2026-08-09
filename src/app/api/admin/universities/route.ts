import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/server/api";
import { withAdminAuth } from "@/lib/admin/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    await withAdminAuth("universities:read");
    const universities = await prisma.university.findMany({
      where: { deletedAt: null },
      include: { country: true },
      orderBy: { name: "asc" },
    });
    return apiSuccess(universities);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await withAdminAuth("universities:write");
    const body = await request.json();

    const country = await prisma.country.findFirst({
      where: {
        OR: [{ code: body.countryCode }, { id: body.countryId }],
        deletedAt: null,
      },
    });
    if (!country) throw new Error("Country not found");

    const university = await prisma.university.create({
      data: {
        countryId: country.id,
        name: body.name,
        slug: body.slug || slugify(body.name),
        city: body.city,
        website: body.website,
        type: body.type || "PUBLIC",
        acceptanceRate: body.acceptanceRate,
      },
      include: { country: true },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entityType: "university",
        entityId: university.id,
        metadata: { name: university.name },
      },
    });

    return apiSuccess(university, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
