import { recommendationEngineService } from "@/services/recommendation/recommendation-engine.service";
import { recommendationInputSchema } from "@/types/recommendation-engine";
import { logger } from "@/lib";
import type { GenerateRecommendationsPayload } from "./types";

export async function processRecommendationJob(
  payload: GenerateRecommendationsPayload,
): Promise<void> {
  logger.info("Processing recommendation job", { userId: payload.userId });

  const input = recommendationInputSchema.parse({
    budgetCurrency: "USD",
    workWhileStudying: false,
    ...payload,
  });

  await recommendationEngineService.generate(input);

  logger.info("Recommendation job completed", { userId: payload.userId });
}
