import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/session";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib";
import {
  fulfillEmploymentPayment,
  paymentService,
} from "@/services/payments";
import {
  verifyBkashPayment,
  verifySslCommerzPayment,
  verifyStripePayment,
} from "@/services/payments/verify";
import { env } from "@/config/env";

function redirect(path: string) {
  const base = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  return NextResponse.redirect(new URL(path, base));
}

async function assertPaymentAuthorized(
  provider: string,
  demoMode: boolean,
  searchParams: URLSearchParams,
  providerRef: string | null | undefined,
) {
  if (demoMode) {
    if (searchParams.get("demo") !== "1") {
      throw new AppError(
        "FORBIDDEN",
        "Demo completion requires demo=1",
        403,
      );
    }
    return;
  }

  let ok = false;
  switch (provider) {
    case "STRIPE":
      ok = await verifyStripePayment(
        searchParams.get("session_id") ?? providerRef,
      );
      break;
    case "SSLCOMMERZ":
      ok = await verifySslCommerzPayment(searchParams.get("val_id"));
      break;
    case "BKASH":
      ok = await verifyBkashPayment(
        searchParams.get("paymentID") ?? providerRef,
      );
      break;
    case "NAGAD":
    case "MANUAL":
      // Live Nagad signing not wired — only demo completions allowed
      ok = false;
      break;
    default:
      ok = false;
  }

  if (!ok) {
    throw new AppError(
      "FORBIDDEN",
      "Could not verify payment with the provider",
      403,
    );
  }
}

/**
 * Gateway return / demo complete handler.
 * Completes the payment, fulfills employment package, then sends user to confirmation.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = request.nextUrl;
    const paymentId = searchParams.get("paymentId");
    const status = searchParams.get("status") ?? "success";
    const cancelled =
      searchParams.get("cancelled") === "1" || status === "cancel";
    const failed = status === "fail" || status === "failed";

    if (!paymentId) {
      throw new AppError("VALIDATION_ERROR", "paymentId is required", 400);
    }

    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        userId: session.user.id,
        deletedAt: null,
      },
    });

    if (!payment) {
      throw new AppError("NOT_FOUND", "Payment not found", 404);
    }

    const meta = (payment.metadata ?? {}) as Record<string, unknown>;
    if (meta.source !== "employment") {
      throw new AppError(
        "VALIDATION_ERROR",
        "This payment is not an employment fee",
        400,
      );
    }

    if (cancelled) {
      await paymentService.markPaymentCancelled(paymentId);
      return redirect("/work/employment/payment?cancelled=1");
    }

    if (failed) {
      await paymentService.markPaymentFailed(
        paymentId,
        "Gateway reported failure",
      );
      return redirect("/work/employment/payment?failed=1");
    }

    if (payment.status !== "COMPLETED") {
      await assertPaymentAuthorized(
        payment.provider,
        meta.demoMode === true,
        searchParams,
        payment.providerRef,
      );
    }

    const { payment: completed, invoice, alreadyCompleted } =
      await paymentService.completePayment(paymentId, {
        providerRef:
          searchParams.get("providerRef") ??
          searchParams.get("paymentID") ??
          searchParams.get("session_id") ??
          searchParams.get("tran_id") ??
          payment.providerRef ??
          undefined,
        raw: Object.fromEntries(searchParams.entries()),
      });

    if (!alreadyCompleted) {
      await fulfillEmploymentPayment(session.user.id, completed, invoice);
    }

    return redirect(
      `/work/employment/confirmation?paymentId=${completed.id}&invoiceId=${invoice.id}`,
    );
  } catch {
    return redirect("/work/employment/payment?error=callback");
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
