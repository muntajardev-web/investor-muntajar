import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { revalidateEmploymentShell } from "@/lib/employment/shell";
import { revalidateStudentShell } from "@/lib/student/shell";

const bodySchema = z.object({
  serviceType: z.enum(["STUDY", "EMPLOYMENT"]),
});

export async function GET() {
  try {
    const session = await requireAuth();
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { serviceType: true },
    });
    return apiSuccess({ serviceType: user?.serviceType ?? null });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = bodySchema.parse(await request.json());

    await prisma.user.update({
      where: { id: session.user.id },
      data: { serviceType: body.serviceType },
    });

    if (body.serviceType === "EMPLOYMENT") {
      await prisma.workerProfile.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          email: session.user.email,
          fullName: session.user.name,
        },
        update: {},
      });

      await prisma.employmentActivity.create({
        data: {
          userId: session.user.id,
          title: "Selected Overseas Employment",
          description: "Started the overseas employment pathway.",
        },
      });

      revalidateEmploymentShell(session.user.id);
      return apiSuccess({
        serviceType: body.serviceType,
        redirectTo: "/work/employment",
      });
    }

    revalidateStudentShell(session.user.id);
    return apiSuccess({
      serviceType: body.serviceType,
      redirectTo: "/get-started",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
