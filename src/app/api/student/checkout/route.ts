import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { revalidateStudentShell } from "@/lib/student/shell";

const ONBOARDING_PLANS = {
  proguide: {
    name: "ProGuide",
    amount: 20000,
    currency: "BDT",
    description: "ProGuide student plan — monthly",
  },
  starter: {
    name: "Starter",
    amount: 20000,
    currency: "BDT",
    description: "Starter professionals plan — monthly",
  },
  elite: {
    name: "Elite",
    amount: 15000,
    currency: "BDT",
    description: "Elite workforce plan — monthly",
  },
} as const;

const bodySchema = z.object({
  planId: z.enum(["proguide", "starter", "elite"]).default("proguide"),
});

export async function GET() {
  try {
    const session = await requireAuth();
    const paid = await prisma.payment.findFirst({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
        deletedAt: null,
      },
      orderBy: { paidAt: "desc" },
      select: { id: true, amount: true, currency: true, paidAt: true, metadata: true },
    });

    return apiSuccess({
      hasPaid: !!paid,
      payment: paid,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = bodySchema.parse(await request.json().catch(() => ({})));
    const plan = ONBOARDING_PLANS[body.planId];

    const existing = await prisma.payment.findFirst({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
        deletedAt: null,
      },
    });

    if (existing) {
      revalidateStudentShell(session.user.id);
      return apiSuccess({ alreadyPaid: true, payment: existing });
    }

    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        amount: plan.amount,
        currency: plan.currency,
        provider: "MANUAL",
        providerRef: `onboarding_${body.planId}_${Date.now()}`,
        description: plan.description,
        status: "COMPLETED",
        paidAt: new Date(),
        metadata: {
          planId: body.planId,
          planName: plan.name,
          source: "onboarding",
        },
      },
    });

    await prisma.notification.createMany({
      data: [
        {
          userId: session.user.id,
          type: "PAYMENT",
          title: "Payment received",
          body: `Your ${plan.name} plan is active. You can now use the full student dashboard.`,
        },
        {
          userId: session.user.id,
          type: "RECOMMENDATION",
          title: "University analysis started",
          body: "We're scoring schools against your profile. Your shortlist will appear under Recommendations.",
        },
        {
          userId: session.user.id,
          type: "APPLICATION_UPDATE",
          title: "Next step: upload documents",
          body: "Add your passport and transcripts so applications can move faster.",
        },
      ],
    });

    revalidateStudentShell(session.user.id);
    return apiSuccess({ alreadyPaid: false, payment });
  } catch (error) {
    return handleApiError(error);
  }
}
