import { Suspense } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { EmploymentCrudClient } from "@/components/admin/employment-crud-client";

export default async function EmploymentCountriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const pick = (k: string) =>
    typeof params[k] === "string" ? (params[k] as string) : undefined;

  const q = pick("q")?.trim();
  const status = pick("status")?.trim();

  const where: Prisma.CountryWhereInput = { deletedAt: null };
  if (status) where.status = status as never;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { code: { contains: q, mode: "insensitive" } },
    ];
  }

  const [countries, jobCounts] = await Promise.all([
    prisma.country.findMany({
      where,
      orderBy: { name: "asc" },
      take: 300,
    }),
    prisma.jobListing.groupBy({
      by: ["country"],
      where: { deletedAt: null },
      _count: { _all: true },
    }),
  ]);

  const jobMap = new Map(
    jobCounts.map((j) => [j.country.toLowerCase(), j._count._all]),
  );

  const rows = countries.map((c) => ({
    id: c.id,
    name: c.name,
    code: c.code,
    jobs: jobMap.get(c.name.toLowerCase()) ?? jobMap.get(c.code.toLowerCase()) ?? 0,
    currency: c.currency ?? "—",
    status: c.status,
  }));

  return (
    <Suspense>
      <EmploymentCrudClient
        title="Employment Countries"
        description="Destination countries from the database, with live job counts."
        rows={rows}
        columns={[
          { key: "name", header: "Country" },
          { key: "code", header: "Code" },
          { key: "currency", header: "Currency" },
          { key: "jobs", header: "Jobs" },
          { key: "status", header: "Status", badge: true },
        ]}
        filters={[
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
          { key: "name", label: "Name", required: true },
          { key: "code", label: "Code (2-letter)", required: true },
          { key: "code3", label: "Code3 (3-letter)", required: true },
          { key: "currency", label: "Currency" },
        ]}
        createUrl="/api/admin/countries"
        canCreate={true}
        canEdit={false}
        deleteEnabled={false}
      />
    </Suspense>
  );
}
