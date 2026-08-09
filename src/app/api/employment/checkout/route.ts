import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { EMPLOYMENT_FEE } from "@/lib/employment/constants";
import { revalidateEmploymentShell } from "@/lib/employment/shell";
import { employmentValidationService } from "@/services/employment/validation.service";
import {
  EMPLOYMENT_CHECKOUT_PROVIDERS,
  paymentService,
} from "@/services/payments";
import { AppError } from "@/lib";

const bodySchema = z.object({
  provider: z
    .enum(["STRIPE", "SSLCOMMERZ", "BKASH", "NAGAD", "MANUAL"])
    .default("SSLCOMMERZ"),
});

export async function GET() {
  try {
    const session = await requireAuth();
    const [paid, history] = await Promise.all([
      paymentService.findCompletedPayment(session.user.id, "employment"),
      paymentService.listPaymentHistory(session.user.id, "employment"),
    ]);

    return apiSuccess({
      hasPaid: !!paid,
      payment: paid,
      fee: EMPLOYMENT_FEE,
      providers: EMPLOYMENT_CHECKOUT_PROVIDERS,
      history,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = bodySchema.parse(await request.json().catch(() => ({})));

    const existing = await paymentService.findCompletedPayment(
      session.user.id,
      "employment",
    );
    if (existing) {
      revalidateEmploymentShell(session.user.id);
      return apiSuccess({
        alreadyPaid: true,
        payment: existing,
        checkoutUrl: null,
        redirectTo: "/work/employment/confirmation",
      });
    }

    const profile = await prisma.workerProfile.findUnique({
      where: { userId: session.user.id },
    });

    const validation = employmentValidationService.parseStored(
      profile?.validationResult,
    );
    if (!validation?.canSubmit) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Application validation must pass before payment. Fix issues on the Review page.",
        400,
      );
    }

    const checkout = await paymentService.createCheckoutSession({
      userId: session.user.id,
      amount: EMPLOYMENT_FEE.amount,
      currency: EMPLOYMENT_FEE.currency,
      description: EMPLOYMENT_FEE.name,
      provider: body.provider,
      source: "employment",
      successPath: `/api/employment/payments/callback?status=success`,
      cancelPath: `/work/employment/payment?cancelled=1`,
      customerEmail: profile?.email ?? null,
      customerName: profile?.fullName,
      planName: EMPLOYMENT_FEE.name,
    });

    revalidateEmploymentShell(session.user.id);

    return apiSuccess({
      alreadyPaid: false,
      ...checkout,
      // Client follows checkoutUrl; demo/live both land on confirmation after callback
      redirectTo: checkout.checkoutUrl
        ? undefined
        : "/work/employment/confirmation",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
