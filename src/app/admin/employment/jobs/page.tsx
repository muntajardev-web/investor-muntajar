import { Suspense } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { EmploymentCrudClient } from "@/components/admin/employment-crud-client";

export default async function EmploymentJobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const pick = (k: string) =>
    typeof params[k] === "string" ? (params[k] as string) : undefined;

  const q = pick("q")?.trim();
  const country = pick("country")?.trim();
  const company = pick("company")?.trim();
  const status = pick("status")?.trim();
  const visa = pick("visa");

  const where: Prisma.JobListingWhereInput = { deletedAt: null };
  if (country) where.country = { contains: country, mode: "insensitive" };
  if (company) where.company = { contains: company, mode: "insensitive" };
  if (status) where.status = status as never;
  if (visa === "true") where.visaSponsorship = true;
  if (visa === "false") where.visaSponsorship = false;
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { company: { contains: q, mode: "insensitive" } },
      { country: { contains: q, mode: "insensitive" } },
    ];
  }

  const [jobs, employers] = await Promise.all([
    prisma.jobListing.findMany({
      where,
      include: {
        employer: true,
        _count: { select: { applications: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 300,
    }),
    prisma.employer.findMany({
      where: { deletedAt: null, status: "ACTIVE" },
      orderBy: { name: "asc" },
      take: 200,
    }),
  ]);

  const rows = jobs.map((j) => ({
    id: j.id,
    title: j.title,
    company: j.company,
    employerId: j.employerId ?? "",
    country: j.country,
    city: j.city ?? "—",
    salary:
      j.salaryMin != null || j.salaryMax != null
        ? `${j.salaryMin ?? "?"}–${j.salaryMax ?? "?"} ${j.salaryCurrency}`
        : "—",
    salaryMin: j.salaryMin != null ? Number(j.salaryMin) : "",
    salaryMax: j.salaryMax != null ? Number(j.salaryMax) : "",
    salaryCurrency: j.salaryCurrency,
    visaSponsorship: j.visaSponsorship ? "Yes" : "No",
    jobType: j.jobType,
    applications: j._count.applications,
    skills: j.skills,
    requirements: j.requirements,
    languages: j.languages,
    description: j.description ?? "",
    experienceYears: j.experienceYears ?? "",
    educationLevel: j.educationLevel ?? "",
    status: j.status,
  }));

  return (
    <Suspense>
      <EmploymentCrudClient
        title="Jobs"
        description="Job listings from the database with full CRUD."
        rows={rows}
        columns={[
          { key: "title", header: "Title" },
          { key: "company", header: "Company" },
          { key: "country", header: "Country" },
          { key: "city", header: "City" },
          { key: "salary", header: "Salary" },
          { key: "visaSponsorship", header: "Visa" },
          { key: "applications", header: "Apps" },
          { key: "status", header: "Status", badge: true },
        ]}
        filters={[
          { key: "country", label: "Country", type: "text" },
          { key: "company", label: "Company", type: "text" },
          {
            key: "visa",
            label: "Visa sponsorship",
            type: "select",
            options: [
              { value: "true", label: "Yes" },
              { value: "false", label: "No" },
            ],
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
        formFields={[
          { key: "title", label: "Title", required: true },
          { key: "company", label: "Company", required: true },
          {
            key: "employerId",
            label: "Employer / company record",
            type: "select",
            options: employers.map((e) => ({
              value: e.id,
              label: `${e.name} (${e.kind})`,
            })),
          },
          { key: "country", label: "Country", required: true },
          { key: "city", label: "City" },
          { key: "salaryMin", label: "Salary min", type: "number" },
          { key: "salaryMax", label: "Salary max", type: "number" },
          { key: "salaryCurrency", label: "Currency" },
          {
            key: "visaSponsorship",
            label: "Visa sponsorship (true/false)",
          },
          {
            key: "jobType",
            label: "Job type",
            type: "select",
            options: [
              { value: "FULL_TIME", label: "Full time" },
              { value: "PART_TIME", label: "Part time" },
              { value: "CONTRACT", label: "Contract" },
              { value: "TEMPORARY", label: "Temporary" },
            ],
          },
          { key: "skills", label: "Skills (comma-separated)" },
          { key: "requirements", label: "Requirements (comma-separated)" },
          { key: "languages", label: "Languages (comma-separated)" },
          { key: "experienceYears", label: "Experience years", type: "number" },
          { key: "educationLevel", label: "Education level" },
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
        createUrl="/api/admin/employment/jobs"
        updateUrl={(id) => `/api/admin/employment/jobs/${id}`}
      />
    </Suspense>
  );
}
