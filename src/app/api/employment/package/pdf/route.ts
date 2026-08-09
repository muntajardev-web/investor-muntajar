import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/server/auth/session";
import { handleApiError } from "@/server/api";
import { employmentPackageService } from "@/services/employment/package.service";
import { AppError } from "@/lib";

const querySchema = z.object({
  variant: z
    .enum(["professional", "ats", "country", "cover"])
    .default("professional"),
});

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

/**
 * Download PDF of the saved (possibly edited) resume variant.
 * Does not regenerate or invent content.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const { variant } = querySchema.parse({
      variant: searchParams.get("variant") ?? "professional",
    });

    const profile = await prisma.workerProfile.findUnique({
      where: { userId: session.user.id },
      select: { fullName: true, applicationPackage: true },
    });

    const pkg = employmentPackageService.parseStored(
      profile?.applicationPackage,
    );
    if (!pkg) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Generate and save a resume before downloading PDF.",
        400,
      );
    }

    const map = {
      professional: {
        title: "Professional Resume",
        body: pkg.professionalCv,
        file: "professional-resume",
      },
      ats: {
        title: "ATS Resume",
        body: pkg.atsResume,
        file: "ats-resume",
      },
      country: {
        title: `${pkg.countryLabel} Resume`,
        body: pkg.countryResume,
        file: `${pkg.countryVariant}-resume`,
      },
      cover: {
        title: "Cover Letter",
        body: pkg.coverLetter,
        file: "cover-letter",
      },
    } as const;

    const selected = map[variant];
    if (!selected.body?.trim()) {
      throw new AppError(
        "VALIDATION_ERROR",
        "This resume variant is empty. Edit or regenerate from your profile first.",
        400,
      );
    }

    const bytes = await employmentPackageService.toPdf(
      selected.title,
      selected.body,
      selected.file,
    );

    const who = slugify(profile?.fullName ?? "worker") || "worker";
    const filename = `${who}-${selected.file}.pdf`;

    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
