import { Suspense } from "react";
import type { EmployerKind, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { EmploymentCrudClient } from "@/components/admin/employment-crud-client";

async function EmployersPageInner({
  kind,
  title,
  searchParams,
}: {
  kind: EmployerKind;
  title: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const pick = (k: string) =>
    typeof searchParams[k] === "string" ? (searchParams[k] as string) : undefined;

  const q = pick("q")?.trim();
  const country = pick("country")?.trim();
  const status = pick("status")?.trim();

  const where: Prisma.EmployerWhereInput = { deletedAt: null, kind };
  if (country) where.country = { contains: country, mode: "insensitive" };
  if (status) where.status = status as never;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { industry: { contains: q, mode: "insensitive" } },
    ];
  }

  const employers = await prisma.employer.findMany({
    where,
    include: { _count: { select: { jobs: true } } },
    orderBy: { updatedAt: "desc" },
    take: 300,
  });

  const rows = employers.map((e) => ({
    id: e.id,
    name: e.name,
    kind: e.kind,
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
    <EmploymentCrudClient
      title={title}
      description={`Live ${kind.toLowerCase()} records linked to job listings.`}
      rows={rows}
      columns={[
        { key: "name", header: "Name" },
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
        { key: "name", label: "Name", required: true },
        {
          key: "kind",
          label: "Kind",
          type: "select",
          options: [
            { value: "EMPLOYER", label: "Employer" },
            { value: "COMPANY", label: "Company" },
          ],
        },
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
  );
}

export default async function EmploymentEmployersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  return (
    <Suspense>
      <EmployersPageInner
        kind="EMPLOYER"
        title="Employers"
        searchParams={params}
      />
    </Suspense>
  );
}
