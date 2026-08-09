import { NextRequest } from "next/server";
import type { EmployerKind, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/server/api";
import { withAdminAuth } from "@/lib/admin/auth";

export async function GET(request: NextRequest) {
  try {
    await withAdminAuth("employment:employers:read");
    const sp = request.nextUrl.searchParams;
    const q = sp.get("q")?.trim();
    const kind = sp.get("kind") as EmployerKind | null;
    const country = sp.get("country")?.trim();
    const status = sp.get("status")?.trim();

    const where: Prisma.EmployerWhereInput = { deletedAt: null };
    if (kind === "EMPLOYER" || kind === "COMPANY") where.kind = kind;
    if (country) where.country = { contains: country, mode: "insensitive" };
    if (status) where.status = status as never;
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { industry: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
      ];
    }

    const employers = await prisma.employer.findMany({
      where,
      include: { _count: { select: { jobs: true } } },
      orderBy: { updatedAt: "desc" },
      take: 300,
    });
    return apiSuccess({ employers });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await withAdminAuth("employment:employers:write");
    const body = await request.json();
    const employer = await prisma.employer.create({
      data: {
        name: body.name,
        kind: body.kind === "EMPLOYER" ? "EMPLOYER" : "COMPANY",
        country: body.country ?? null,
        city: body.city ?? null,
        website: body.website ?? null,
        email: body.email ?? null,
        phone: body.phone ?? null,
        industry: body.industry ?? null,
        description: body.description ?? null,
        status: body.status ?? "ACTIVE",
      },
    });
    return apiSuccess({ employer }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
