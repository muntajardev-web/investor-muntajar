import { NextRequest } from "next/server";
import { z } from "zod";
import { requireRole } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { listAiAudits } from "@/services/ai/ai-audit.service";

const querySchema = z.object({
  action: z.string().optional(),
  status: z.string().optional(),
  model: z.string().optional(),
  provider: z.string().optional(),
  userApproval: z.string().optional(),
  userId: z.string().uuid().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  q: z.string().optional(),
  take: z.coerce.number().int().positive().max(500).optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requireRole(["ADMIN", "AGENT"]);
    const raw = Object.fromEntries(request.nextUrl.searchParams.entries());
    const filters = querySchema.parse(raw);

    const result = await listAiAudits({
      action: (filters.action as never) ?? "ALL",
      status: (filters.status as never) ?? "ALL",
      model: filters.model,
      provider: filters.provider,
      userApproval: (filters.userApproval as never) ?? "ALL",
      userId: filters.userId,
      from: filters.from,
      to: filters.to,
      q: filters.q,
      take: filters.take,
    });

    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
