import { Suspense } from "react";
import type { EmploymentApplicationStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { EmploymentApplicationsClient } from "./applications-client";
import { formatEmploymentStatus } from "@/lib/employment/format";

export default async function EmploymentApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const pick = (k: string) =>
    typeof params[k] === "string" ? (params[k] as string) : undefined;

  const q = pick("q")?.trim();
  const status = pick("status")?.trim();
  const country = pick("country")?.trim();

  const where: Prisma.EmploymentApplicationWhereInput = { deletedAt: null };
  if (status) where.status = status as EmploymentApplicationStatus;
  if (country) {
    where.jobListing = {
      country: { contains: country, mode: "insensitive" },
    };
  }
  if (q) {
    where.OR = [
      { user: { email: { contains: q, mode: "insensitive" } } },
      { user: { name: { contains: q, mode: "insensitive" } } },
      { jobListing: { title: { contains: q, mode: "insensitive" } } },
      { jobListing: { company: { contains: q, mode: "insensitive" } } },
    ];
  }

  const applications = await prisma.employmentApplication.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      jobListing: {
        select: { title: true, company: true, country: true },
      },
      timeline: {
        where: { deletedAt: null },
        orderBy: { occurredAt: "desc" },
        take: 20,
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 300,
  });

  const rows = applications.map((a) => ({
    id: a.id,
    worker: a.user.name ?? "—",
    email: a.user.email,
    job: a.jobListing?.title ?? "General package",
    company: a.jobListing?.company ?? "—",
    country: a.jobListing?.country ?? "—",
    status: a.status,
    paidAt: a.paidAt ? new Date(a.paidAt).toLocaleString() : "—",
    submittedAt: a.submittedAt
      ? new Date(a.submittedAt).toLocaleString()
      : "—",
    notes: a.notes ?? "—",
    timeline: a.timeline.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      occurredAt: new Date(t.occurredAt).toLocaleString(),
    })),
    label: formatEmploymentStatus(a.status),
  }));

  return (
    <Suspense>
      <EmploymentApplicationsClient applications={rows} />
    </Suspense>
  );
}
