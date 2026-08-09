import type { Country } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const countryRepository = {
  async findByCode(code: string): Promise<Country | null> {
    return prisma.country.findFirst({
      where: { code, deletedAt: null, status: "ACTIVE" },
    });
  },

  async findByCodes(codes: string[]): Promise<Country[]> {
    return prisma.country.findMany({
      where: { code: { in: codes }, deletedAt: null, status: "ACTIVE" },
    });
  },

  async findAll(): Promise<Country[]> {
    return prisma.country.findMany({
      where: { deletedAt: null, status: "ACTIVE" },
      orderBy: { name: "asc" },
    });
  },
};
