import { Suspense } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { EmploymentCrudClient } from "@/components/admin/employment-crud-client";

export default async function EmploymentVisaProgramsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const pick = (k: string) =>
    typeof params[k] === "string" ? (params[k] as string) : undefined;

  const q = pick("q")?.trim();
  const country = pick("country")?.trim();
  const status = pick("status")?.trim();

  const where: Prisma.VisaProgramWhereInput = { deletedAt: null };
  if (status) where.status = status as never;
  if (country) {
    where.OR = [
      { countryCode: { equals: country.toUpperCase() } },
      { countryName: { contains: country, mode: "insensitive" } },
    ];
  }
  if (q) {
    where.AND = [
      {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { countryName: { contains: q, mode: "insensitive" } },
        ],
      },
    ];
  }

  const programs = await prisma.visaProgram.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: 300,
  });

  const rows = programs.map((p) => ({
    id: p.id,
    name: p.name,
    countryCode: p.countryCode,
    countryName: p.countryName,
    processingDays: p.processingDays ?? "—",
    fees:
      p.fees != null
        ? `${Number(p.fees).toLocaleString()} ${p.feesCurrency ?? ""}`
        : "—",
    feesCurrency: p.feesCurrency ?? "USD",
    successRate: p.successRate != null ? `${p.successRate}%` : "—",
    visaSponsorship: p.visaSponsorship ? "Yes" : "No",
    validityPeriod: p.validityPeriod ?? "—",
    description: p.description ?? "",
    status: p.status,
  }));

  return (
    <Suspense>
      <EmploymentCrudClient
        title="Visa Programs"
        description="Work visa programs for overseas employment destinations."
        rows={rows}
        columns={[
          { key: "name", header: "Program" },
          { key: "countryName", header: "Country" },
          { key: "countryCode", header: "Code" },
          { key: "processingDays", header: "Processing days" },
          { key: "fees", header: "Fees" },
          { key: "visaSponsorship", header: "Sponsorship" },
          { key: "status", header: "Status", badge: true },
        ]}
        filters={[
          { key: "country", label: "Country", type: "text" },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Inactive" },
            ],
          },
        ]}
        formFields={[
          { key: "name", label: "Program name", required: true },
          { key: "countryCode", label: "Country code (e.g. AE)", required: true },
          { key: "countryName", label: "Country name", required: true },
          { key: "description", label: "Description", type: "textarea" },
          { key: "processingDays", label: "Processing days", type: "number" },
          { key: "fees", label: "Fees", type: "number" },
          { key: "feesCurrency", label: "Fees currency" },
          { key: "successRate", label: "Success rate %", type: "number" },
          { key: "validityPeriod", label: "Validity period" },
          {
            key: "visaSponsorship",
            label: "Visa sponsorship (true/false)",
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Inactive" },
            ],
          },
        ]}
        createUrl="/api/admin/employment/visa-programs"
        updateUrl={(id) => `/api/admin/employment/visa-programs/${id}`}
      />
    </Suspense>
  );
}
