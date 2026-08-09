import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/server/api";
import { withAdminAuth } from "@/lib/admin/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await withAdminAuth("employment:jobs:write");
    const { id } = await params;
    const body = await request.json();
    const job = await prisma.jobListing.update({
      where: { id },
      data: {
        title: body.title ?? undefined,
        company: body.company ?? undefined,
        employerId:
          body.employerId === undefined ? undefined : body.employerId || null,
        country: body.country ?? undefined,
        city: body.city ?? undefined,
        salaryMin: body.salaryMin ?? undefined,
        salaryMax: body.salaryMax ?? undefined,
        salaryCurrency: body.salaryCurrency ?? undefined,
        visaSponsorship:
          typeof body.visaSponsorship === "boolean"
            ? body.visaSponsorship
            : undefined,
        requirements: Array.isArray(body.requirements)
          ? body.requirements
          : undefined,
        skills: Array.isArray(body.skills) ? body.skills : undefined,
        jobType: body.jobType ?? undefined,
        description: body.description ?? undefined,
        experienceYears: body.experienceYears ?? undefined,
        educationLevel: body.educationLevel ?? undefined,
        languages: Array.isArray(body.languages) ? body.languages : undefined,
        status: body.status ?? undefined,
      },
    });
    return apiSuccess({ job });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await withAdminAuth("employment:jobs:write");
    const { id } = await params;
    await prisma.jobListing.update({
      where: { id },
      data: { deletedAt: new Date(), status: "INACTIVE" },
    });
    return apiSuccess({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
