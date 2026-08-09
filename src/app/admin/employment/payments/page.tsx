import { Suspense } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { EmploymentCrudClient } from "@/components/admin/employment-crud-client";
import { employmentPaymentWhere } from "@/lib/admin/employment-queries";

export default async function EmploymentPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const pick = (k: string) =>
    typeof params[k] === "string" ? (params[k] as string) : undefined;

  const q = pick("q")?.trim();
  const status = pick("status")?.trim();
  const provider = pick("provider")?.trim();
  const from = pick("from");
  const to = pick("to");

  const where = employmentPaymentWhere({
    ...(status ? { status: status as never } : {}),
    ...(provider ? { provider: provider as never } : {}),
    ...(from || to
      ? {
          createdAt: {
            ...(from ? { gte: new Date(from) } : {}),
            ...(to ? { lte: new Date(to) } : {}),
          },
        }
      : {}),
  });

  if (q) {
    (where as Prisma.PaymentWhereInput).OR = [
      { description: { contains: q, mode: "insensitive" } },
      { providerRef: { contains: q, mode: "insensitive" } },
      { user: { email: { contains: q, mode: "insensitive" } } },
    ];
  }

  const payments = await prisma.payment.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      invoice: true,
    },
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  const rows = payments.map((p) => ({
    id: p.id,
    user: p.user.name ?? p.user.email,
    email: p.user.email,
    amount: `${Number(p.amount).toLocaleString()} ${p.currency}`,
    provider: p.provider,
    status: p.status,
    invoice: p.invoice?.invoiceNumber ?? "—",
    paidAt: p.paidAt ? new Date(p.paidAt).toLocaleString() : "—",
    createdAt: new Date(p.createdAt).toLocaleString(),
    description: p.description ?? "—",
  }));

  return (
    <Suspense>
      <EmploymentCrudClient
        title="Employment Payments"
        description="Payments where metadata.source = employment, with invoices."
        rows={rows}
        columns={[
          { key: "user", header: "User" },
          { key: "email", header: "Email" },
          { key: "amount", header: "Amount" },
          { key: "provider", header: "Provider" },
          { key: "invoice", header: "Invoice" },
          { key: "status", header: "Status", badge: true },
          { key: "paidAt", header: "Paid at" },
        ]}
        filters={[
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "COMPLETED", label: "Completed" },
              { value: "PENDING", label: "Pending" },
              { value: "PROCESSING", label: "Processing" },
              { value: "FAILED", label: "Failed" },
              { value: "CANCELLED", label: "Cancelled" },
            ],
          },
          {
            key: "provider",
            label: "Provider",
            type: "select",
            options: [
              { value: "STRIPE", label: "Stripe" },
              { value: "SSLCOMMERZ", label: "SSLCommerz" },
              { value: "BKASH", label: "bKash" },
              { value: "NAGAD", label: "Nagad" },
              { value: "MANUAL", label: "Manual" },
            ],
          },
          { key: "from", label: "From", type: "date" },
          { key: "to", label: "To", type: "date" },
        ]}
        canCreate={false}
        canEdit={false}
        deleteEnabled={false}
      />
    </Suspense>
  );
}
