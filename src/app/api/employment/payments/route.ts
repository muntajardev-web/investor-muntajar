import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { paymentService } from "@/services/payments";

export async function GET() {
  try {
    const session = await requireAuth();
    const history = await paymentService.listPaymentHistory(
      session.user.id,
      "employment",
    );
    const latest = await paymentService.findCompletedPayment(
      session.user.id,
      "employment",
    );

    return apiSuccess({ history, latest });
  } catch (error) {
    return handleApiError(error);
  }
}
