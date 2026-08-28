import { prisma } from "@/lib/prisma";
import { UniversitiesClient } from "./universities-client";

export default async function UniversitiesPage() {
  const [universities, countries] = await Promise.all([
    prisma.university.findMany({
      where: { deletedAt: null },
      include: { country: true },
      orderBy: { name: "asc" },
    }),
    prisma.country.findMany({
      where: { deletedAt: null, status: "ACTIVE" },
      orderBy: { name: "asc" },
    }),
  ]);

  return <UniversitiesClient universities={universities} countries={countries} />;
}
