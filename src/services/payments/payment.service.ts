import type { Invoice, Payment, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib";
import { env } from "@/config/env";
import { createProviderSession } from "./providers";
import type {
  CheckoutSessionResult,
  CreateCheckoutInput,
  InvoiceLineItem,
  PaymentSource,
} from "./types";

function asMeta(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

export function paymentSourceFilter(
  source: PaymentSource,
): Prisma.PaymentWhereInput {
  return {
    deletedAt: null,
    metadata: { path: ["source"], equals: source },
  };
}

export async function findCompletedPayment(
  userId: string,
  source: PaymentSource,
) {
  return prisma.payment.findFirst({
    where: {
      userId,
      status: "COMPLETED",
      ...paymentSourceFilter(source),
    },
    include: { invoice: true },
    orderBy: { paidAt: "desc" },
  });
}

export async function listPaymentHistory(
  userId: string,
  source: PaymentSource,
) {
  return prisma.payment.findMany({
    where: {
      userId,
      ...paymentSourceFilter(source),
    },
    include: { invoice: true },
    orderBy: { createdAt: "desc" },
  });
}

function nextInvoiceNumber() {
  const stamp = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `INV-EMP-${stamp}-${rand}`;
}

export async function createInvoiceForPayment(
  payment: Payment,
  lineItems?: InvoiceLineItem[],
): Promise<Invoice> {
  const existing = await prisma.invoice.findUnique({
    where: { paymentId: payment.id },
  });
  if (existing) {
    if (payment.status === "COMPLETED" && existing.status !== "PAID") {
      return prisma.invoice.update({
        where: { id: existing.id },
        data: {
          status: "PAID",
          paidAt: payment.paidAt ?? new Date(),
        },
      });
    }
    return existing;
  }

  const items: InvoiceLineItem[] = lineItems ?? [
    {
      description: payment.description ?? "Application fee",
      quantity: 1,
      unitAmount: Number(payment.amount),
      total: Number(payment.amount),
    },
  ];

  return prisma.invoice.create({
    data: {
      paymentId: payment.id,
      userId: payment.userId,
      invoiceNumber: nextInvoiceNumber(),
      amount: payment.amount,
      currency: payment.currency,
      lineItems: items as unknown as Prisma.InputJsonValue,
      status: payment.status === "COMPLETED" ? "PAID" : "ISSUED",
      issuedAt: new Date(),
      paidAt: payment.paidAt,
      metadata: {
        source: asMeta(payment.metadata).source ?? "employment",
        provider: payment.provider,
        providerRef: payment.providerRef,
      } as Prisma.InputJsonValue,
    },
  });
}

export async function createCheckoutSession(
  input: CreateCheckoutInput,
): Promise<CheckoutSessionResult> {
  const existing = await findCompletedPayment(input.userId, input.source);
  if (existing) {
    return {
      paymentId: existing.id,
      provider: existing.provider,
      status: existing.status,
      demoMode: false,
      checkoutUrl: null,
      alreadyPaid: true,
    };
  }

  // Cancel stale pending sessions for this source
  await prisma.payment.updateMany({
    where: {
      userId: input.userId,
      status: { in: ["PENDING", "PROCESSING"] },
      ...paymentSourceFilter(input.source),
    },
    data: { status: "CANCELLED" },
  });

  const payment = await prisma.payment.create({
    data: {
      userId: input.userId,
      amount: input.amount,
      currency: input.currency,
      provider: input.provider,
      description: input.description,
      status: "PENDING",
      metadata: {
        source: input.source,
        planName: input.planName ?? input.description,
        demoMode: false,
      },
    },
  });

  const base = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  const successUrl = `${base}${input.successPath}${input.successPath.includes("?") ? "&" : "?"}paymentId=${payment.id}`;
  const cancelUrl = `${base}${input.cancelPath}${input.cancelPath.includes("?") ? "&" : "?"}paymentId=${payment.id}&cancelled=1`;

  const session = await createProviderSession(input.provider, {
    paymentId: payment.id,
    amount: input.amount,
    currency: input.currency,
    description: input.description,
    successUrl,
    cancelUrl,
    customerEmail: input.customerEmail,
    customerName: input.customerName,
  });

  const updated = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      providerRef: session.providerRef,
      status: "PROCESSING",
      metadata: {
        source: input.source,
        planName: input.planName ?? input.description,
        demoMode: session.demoMode,
        providerRaw: session.raw ?? null,
      } as Prisma.InputJsonValue,
    },
  });

  await createInvoiceForPayment(updated);

  return {
    paymentId: updated.id,
    provider: updated.provider,
    status: updated.status,
    demoMode: session.demoMode,
    checkoutUrl: session.checkoutUrl,
    clientSecret: session.clientSecret ?? null,
    alreadyPaid: false,
  };
}

export async function markPaymentFailed(
  paymentId: string,
  reason?: string,
) {
  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, deletedAt: null },
  });
  if (!payment) {
    throw new AppError("NOT_FOUND", "Payment not found", 404);
  }
  if (payment.status === "COMPLETED") return payment;

  return prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: "FAILED",
      metadata: {
        ...asMeta(payment.metadata),
        failReason: reason ?? "Payment failed",
      } as Prisma.InputJsonValue,
    },
  });
}

export async function markPaymentCancelled(paymentId: string) {
  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, deletedAt: null },
  });
  if (!payment) {
    throw new AppError("NOT_FOUND", "Payment not found", 404);
  }
  if (payment.status === "COMPLETED") return payment;

  return prisma.payment.update({
    where: { id: paymentId },
    data: { status: "CANCELLED" },
  });
}

export async function completePayment(
  paymentId: string,
  opts?: { providerRef?: string; raw?: Record<string, unknown> },
): Promise<{ payment: Payment; invoice: Invoice; alreadyCompleted: boolean }> {
  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, deletedAt: null },
    include: { invoice: true },
  });

  if (!payment) {
    throw new AppError("NOT_FOUND", "Payment not found", 404);
  }

  if (payment.status === "COMPLETED") {
    const invoice =
      payment.invoice ?? (await createInvoiceForPayment(payment));
    return { payment, invoice, alreadyCompleted: true };
  }

  if (payment.status === "CANCELLED" || payment.status === "REFUNDED") {
    throw new AppError(
      "VALIDATION_ERROR",
      `Cannot complete a ${payment.status.toLowerCase()} payment`,
      400,
    );
  }

  const updated = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: "COMPLETED",
      paidAt: new Date(),
      providerRef: opts?.providerRef ?? payment.providerRef,
      metadata: {
        ...asMeta(payment.metadata),
        completedRaw: (opts?.raw ?? null) as Prisma.InputJsonValue,
      } as Prisma.InputJsonValue,
    },
  });

  const invoice = await createInvoiceForPayment(updated);

  return { payment: updated, invoice, alreadyCompleted: false };
}

export const paymentService = {
  findCompletedPayment,
  listPaymentHistory,
  createCheckoutSession,
  completePayment,
  markPaymentFailed,
  markPaymentCancelled,
  createInvoiceForPayment,
  paymentSourceFilter,
};
