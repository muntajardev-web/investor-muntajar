import { Suspense } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { EmploymentCrudClient } from "@/components/admin/employment-crud-client";

export default async function EmploymentCompaniesPage({
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

  const where: Prisma.EmployerWhereInput = {
    deletedAt: null,
    kind: "COMPANY",
  };
  if (country) where.country = { contains: country, mode: "insensitive" };
  if (status) where.status = status as never;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { industry: { contains: q, mode: "insensitive" } },
    ];
  }

  const companies = await prisma.employer.findMany({
    where,
    include: { _count: { select: { jobs: true } } },
    orderBy: { updatedAt: "desc" },
    take: 300,
  });

  const rows = companies.map((e) => ({
    id: e.id,
    name: e.name,
    kind: "COMPANY",
    country: e.country ?? "—",
    city: e.city ?? "—",
    industry: e.industry ?? "—",
    email: e.email ?? "—",
    phone: e.phone ?? "—",
    website: e.website ?? "—",
    jobs: e._count.jobs,
    status: e.status,
    description: e.description ?? "",
  }));

  return (
    <Suspense>
      <EmploymentCrudClient
        title="Companies"
        description="Hiring companies stored in the employers table (kind=COMPANY)."
        rows={rows}
        columns={[
          { key: "name", header: "Company" },
          { key: "country", header: "Country" },
          { key: "city", header: "City" },
          { key: "industry", header: "Industry" },
          { key: "email", header: "Email" },
          { key: "jobs", header: "Jobs" },
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
          { key: "name", label: "Company name", required: true },
          { key: "kind", label: "Kind", type: "select", options: [{ value: "COMPANY", label: "Company" }] },
          { key: "country", label: "Country" },
          { key: "city", label: "City" },
          { key: "industry", label: "Industry" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "website", label: "Website" },
          { key: "description", label: "Description", type: "textarea" },
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
        createUrl="/api/admin/employment/employers"
        updateUrl={(id) => `/api/admin/employment/employers/${id}`}
      />
    </Suspense>
  );
}
