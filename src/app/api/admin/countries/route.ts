import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/server/api";
import { withAdminAuth } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  try {
    await withAdminAuth("countries:write");
    const body = await request.json();
    const country = await prisma.country.create({
      data: {
        name: body.name,
        code: body.code.toUpperCase(),
        code3: body.code3.toUpperCase(),
        currency: body.currency || "USD",
      },
    });
    return apiSuccess(country, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
