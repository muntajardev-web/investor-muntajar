import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { employmentTrackingService } from "@/services/employment/tracking.service";
import {
  EMPLOYMENT_STATUS_FLOW,
  STATUS_DESCRIPTIONS,
  formatEmploymentStatus,
  employmentProgressPercent,
} from "@/lib/employment/format";

export async function GET() {
  try {
    const session = await requireAuth();
    const tracking = await employmentTrackingService.getApplicationTracking(
      session.user.id,
    );

    return apiSuccess({
      ...tracking,
      statusFlow: EMPLOYMENT_STATUS_FLOW.map((status) => ({
        status,
        label: formatEmploymentStatus(status),
        description: STATUS_DESCRIPTIONS[status],
        progress: employmentProgressPercent(status),
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
