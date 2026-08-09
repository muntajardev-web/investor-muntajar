import { NextRequest } from "next/server";
import type { EmploymentApplicationStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/server/api";
import { withAdminAuth } from "@/lib/admin/auth";

export async function GET(request: NextRequest) {
  try {
    await withAdminAuth("employment:applications:read");
    const sp = request.nextUrl.searchParams;
    const q = sp.get("q")?.trim();
    const status = sp.get("status")?.trim();
    const country = sp.get("country")?.trim();

    const where: Prisma.EmploymentApplicationWhereInput = { deletedAt: null };
    if (status) where.status = status as EmploymentApplicationStatus;
    if (country) {
      where.jobListing = {
        country: { contains: country, mode: "insensitive" },
      };
    }
    if (q) {
      where.OR = [
        { notes: { contains: q, mode: "insensitive" } },
        { user: { email: { contains: q, mode: "insensitive" } } },
        { user: { name: { contains: q, mode: "insensitive" } } },
        { jobListing: { title: { contains: q, mode: "insensitive" } } },
        { jobListing: { company: { contains: q, mode: "insensitive" } } },
      ];
    }

    const applications = await prisma.employmentApplication.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        jobListing: {
          select: { id: true, title: true, company: true, country: true },
        },
        timeline: {
          where: { deletedAt: null },
          orderBy: { occurredAt: "desc" },
          take: 20,
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 300,
    });
    return apiSuccess({ applications });
  } catch (error) {
    return handleApiError(error);
  }
}
