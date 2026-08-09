import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/server/api";
import { withAdminAuth } from "@/lib/admin/auth";
import {
  getEmploymentAdminOverview,
  getEmploymentAnalytics,
} from "@/lib/admin/employment-queries";

export async function GET(request: NextRequest) {
  try {
    await withAdminAuth("employment:dashboard");
    const mode = request.nextUrl.searchParams.get("mode");
    if (mode === "analytics") {
      await withAdminAuth("employment:analytics:view");
      return apiSuccess(await getEmploymentAnalytics());
    }
    return apiSuccess(await getEmploymentAdminOverview());
  } catch (error) {
    return handleApiError(error);
  }
}
