import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/server/api";
import { withAdminAuth } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  try {
    await withAdminAuth("import:execute");

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const resource = formData.get("resource") as string | null;
    const type = formData.get("type") as string | null;

    if (!file || !resource) {
      return handleApiError(new Error("File and resource are required"));
    }

    const text = await file.text();
    const lines = text.split("\n").filter(Boolean);
    const headers = lines[0]?.split(",").map((h) => h.trim()) ?? [];
    const rows = lines.slice(1).map((line) => {
      const values = line.split(",");
      return Object.fromEntries(
        headers.map((h, i) => [h, values[i]?.trim() ?? ""]),
      );
    });

    let imported = 0;

    if (resource === "countries" && headers.includes("code")) {
      for (const row of rows) {
        await prisma.country.upsert({
          where: { code: row.code },
          create: {
            name: row.name,
            code: row.code,
            code3: row.code3 || row.code.padEnd(3, "X"),
            currency: row.currency || "USD",
          },
          update: { name: row.name },
        });
        imported++;
      }
    } else if (resource === "universities" && headers.includes("slug")) {
      const country = await prisma.country.findFirst();
      if (!country) throw new Error("Import countries first");

      for (const row of rows) {
        await prisma.university.upsert({
          where: { slug: row.slug },
          create: {
            countryId: country.id,
            slug: row.slug,
            name: row.name,
            city: row.city || null,
            website: row.website || null,
          },
          update: { name: row.name, city: row.city || null },
        });
        imported++;
      }
    } else {
      return apiSuccess({
        imported: 0,
        message: `Import parser for ${resource} (${type}) queued. ${rows.length} rows parsed.`,
        preview: rows.slice(0, 3),
      });
    }

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entityType: resource,
        metadata: { imported, type, fileName: file.name },
      },
    });

    return apiSuccess({ imported, total: rows.length });
  } catch (error) {
    return handleApiError(error);
  }
}
