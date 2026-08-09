import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { CountriesClient } from "./countries-client";

export default async function CountriesPage() {
  const countries = await prisma.country.findMany({
    where: { deletedAt: null },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader title="Countries" description="Manage destination countries." />
      <CountriesClient countries={countries} />
    </div>
  );
}
