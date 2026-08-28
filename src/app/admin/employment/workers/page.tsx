import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { EmploymentCrudClient } from "@/components/admin/employment-crud-client";
import type { Prisma } from "@prisma/client";

export default async function EmploymentWorkersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const pick = (k: string) =>
    typeof params[k] === "string" ? (params[k] as string) : undefined;

  const q = pick("q")?.trim();
  const country = pick("country")?.trim();
  const complete = pick("complete");

  const where: Prisma.WorkerProfileWhereInput = { deletedAt: null };
  if (country) where.currentCountry = { contains: country, mode: "insensitive" };
  if (complete === "true") where.isComplete = true;
  if (complete === "false") where.isComplete = false;
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
      { user: { email: { contains: q, mode: "insensitive" } } },
    ];
  }

  const workers = await prisma.workerProfile.findMany({
    where,
    include: {
      user: { select: { email: true, name: true, status: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 300,
  });

  const rows = workers.map((w) => ({
    id: w.id,
    fullName: w.fullName ?? w.user.name ?? "—",
    email: w.email ?? w.user.email,
    phone: w.phone ?? "—",
    nationality: w.nationality ?? "—",
    currentCountry: w.currentCountry ?? "—",
    currentCity: w.currentCity ?? "—",
    completion: `${w.profileCompletion}%`,
    isComplete: w.isComplete ? "Complete" : "Incomplete",
    preferredCountries: w.preferredCountries,
    status: w.user.status,
  }));

  return (
    <Suspense>
      <EmploymentCrudClient
        title="Workers"
        description="Overseas employment worker profiles from the database."
        rows={rows}
        columns={[
          { key: "fullName", header: "Name" },
          { key: "email", header: "Email" },
          { key: "phone", header: "Phone" },
          { key: "nationality", header: "Nationality" },
          { key: "currentCountry", header: "Country" },
          { key: "completion", header: "Completion" },
          { key: "isComplete", header: "Profile", badge: true },
          { key: "status", header: "Account", badge: true },
        ]}
        filters={[
          { key: "country", label: "Country", type: "text" },
          {
            key: "complete",
            label: "Profile complete",
            type: "select",
            options: [
              { value: "true", label: "Complete" },
              { value: "false", label: "Incomplete" },
            ],
          },
        ]}
        formFields={[
          { key: "fullName", label: "Full name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "nationality", label: "Nationality" },
          { key: "currentCountry", label: "Current country" },
          { key: "currentCity", label: "City" },
          {
            key: "preferredCountries",
            label: "Preferred countries (comma-separated)",
          },
        ]}
        updateUrl={(id) => `/api/admin/employment/workers/${id}`}
        canCreate={false}
      />
    </Suspense>
  );
}
