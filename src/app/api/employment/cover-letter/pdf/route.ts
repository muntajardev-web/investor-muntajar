import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/server/auth/session";
import { handleApiError } from "@/server/api";
import { coverLetterService } from "@/services/employment/cover-letter.service";
import { AppError } from "@/lib";

const querySchema = z.object({
  id: z.string().uuid().optional(),
});

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

/** Download PDF of a stored cover letter version (active if id omitted) */
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const { id } = querySchema.parse({
      id: searchParams.get("id") ?? undefined,
    });

    const version = id
      ? await prisma.coverLetterVersion.findFirst({
          where: { id, userId: session.user.id, deletedAt: null },
        })
      : await prisma.coverLetterVersion.findFirst({
          where: { userId: session.user.id, deletedAt: null, isActive: true },
          orderBy: { version: "desc" },
        });

    if (!version?.content?.trim()) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Generate or select a cover letter before downloading PDF.",
        400,
      );
    }

    const profile = await prisma.workerProfile.findUnique({
      where: { userId: session.user.id },
      select: { fullName: true },
    });

    const title = [
      "Cover Letter",
      version.jobTitle,
      version.company,
    ]
      .filter(Boolean)
      .join(" — ");

    const bytes = await coverLetterService.toPdf(title, version.content);
    const who = slugify(profile?.fullName ?? "worker") || "worker";
    const filename = `${who}-cover-letter-v${version.version}.pdf`;

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
