import { NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/server/api";
import { withAdminAuth } from "@/lib/admin/auth";

export async function GET(request: NextRequest) {
  try {
    await withAdminAuth("employment:jobs:read");
    const sp = request.nextUrl.searchParams;
    const q = sp.get("q")?.trim();
    const country = sp.get("country")?.trim();
    const company = sp.get("company")?.trim();
    const status = sp.get("status")?.trim();
    const visa = sp.get("visa");

    const where: Prisma.JobListingWhereInput = { deletedAt: null };
    if (country) where.country = { contains: country, mode: "insensitive" };
    if (company) where.company = { contains: company, mode: "insensitive" };
    if (status) where.status = status as never;
    if (visa === "true") where.visaSponsorship = true;
    if (visa === "false") where.visaSponsorship = false;
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { company: { contains: q, mode: "insensitive" } },
        { country: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    const jobs = await prisma.jobListing.findMany({
      where,
      include: {
        employer: true,
        _count: { select: { applications: true, matches: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 300,
    });
    return apiSuccess({ jobs });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await withAdminAuth("employment:jobs:write");
    const body = await request.json();
    const visaSponsorship =
      body.visaSponsorship === true ||
      body.visaSponsorship === "true" ||
      body.visaSponsorship === "Yes";
    const job = await prisma.jobListing.create({
      data: {
        title: body.title,
        company: body.company,
        employerId: body.employerId || null,
        country: body.country,
        city: body.city ?? null,
        salaryMin: body.salaryMin ?? null,
        salaryMax: body.salaryMax ?? null,
        salaryCurrency: body.salaryCurrency ?? "USD",
        visaSponsorship,
        requirements: Array.isArray(body.requirements) ? body.requirements : [],
        skills: Array.isArray(body.skills) ? body.skills : [],
        jobType: body.jobType ?? "FULL_TIME",
        description: body.description ?? null,
        experienceYears: body.experienceYears ?? null,
        educationLevel: body.educationLevel ?? null,
        languages: Array.isArray(body.languages) ? body.languages : [],
        status: body.status ?? "ACTIVE",
      },
    });
    return apiSuccess({ job }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
