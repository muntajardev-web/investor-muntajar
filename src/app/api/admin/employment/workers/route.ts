import { NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/server/api";
import { withAdminAuth } from "@/lib/admin/auth";

export async function GET(request: NextRequest) {
  try {
    await withAdminAuth("employment:workers:read");
    const sp = request.nextUrl.searchParams;
    const q = sp.get("q")?.trim();
    const country = sp.get("country")?.trim();
    const complete = sp.get("complete");

    const where: Prisma.WorkerProfileWhereInput = { deletedAt: null };
    if (country) where.currentCountry = { contains: country, mode: "insensitive" };
    if (complete === "true") where.isComplete = true;
    if (complete === "false") where.isComplete = false;
    if (q) {
      where.OR = [
        { fullName: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
        { nationality: { contains: q, mode: "insensitive" } },
        { user: { email: { contains: q, mode: "insensitive" } } },
      ];
    }

    const workers = await prisma.workerProfile.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, name: true, status: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 300,
    });
    return apiSuccess({ workers });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await withAdminAuth("employment:workers:write");
    const body = await request.json();
    if (!body.id) throw new Error("id required");

    const worker = await prisma.workerProfile.update({
      where: { id: body.id },
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
      },
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
    });
    return apiSuccess({ worker });
  } catch (error) {
    return handleApiError(error);
  }
}
