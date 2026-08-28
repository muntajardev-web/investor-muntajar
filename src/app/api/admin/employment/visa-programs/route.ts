import { NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/server/api";
import { withAdminAuth } from "@/lib/admin/auth";

export async function GET(request: NextRequest) {
  try {
    await withAdminAuth("employment:visa:read");
    const sp = request.nextUrl.searchParams;
    const q = sp.get("q")?.trim();
    const country = sp.get("country")?.trim();
    const status = sp.get("status")?.trim();

    const where: Prisma.VisaProgramWhereInput = { deletedAt: null };
    if (country) {
      where.OR = [
        { countryCode: { equals: country.toUpperCase() } },
        { countryName: { contains: country, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status as never;
    if (q) {
      where.AND = [
        {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { countryName: { contains: q, mode: "insensitive" } },
          ],
        },
      ];
    }

    const programs = await prisma.visaProgram.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: 300,
    });
    return apiSuccess({ programs });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await withAdminAuth("employment:visa:write");
    const body = await request.json();
    const program = await prisma.visaProgram.create({
      data: {
        countryCode: String(body.countryCode ?? "XX").slice(0, 2).toUpperCase(),
        countryName: body.countryName ?? body.countryCode ?? "Unknown",
        name: body.name,
        description: body.description ?? null,
        processingDays: body.processingDays ?? null,
        successRate: body.successRate ?? null,
        fees: body.fees ?? null,
        feesCurrency: body.feesCurrency ?? "USD",
        validityPeriod: body.validityPeriod ?? null,
        visaSponsorship:
          typeof body.visaSponsorship === "boolean"
            ? body.visaSponsorship
            : true,
        status: body.status ?? "ACTIVE",
      },
    });
    return apiSuccess({ program }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
