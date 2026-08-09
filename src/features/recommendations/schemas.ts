import { z } from "zod";
import {
  financialCapabilitySchema,
  scholarshipPreferenceSchema,
} from "@/types/recommendation-engine";

export const recommendationRequestSchema = z.object({
  sscGpa: z.number().min(0).max(5).optional(),
  hscGpa: z.number().min(0).max(5).optional(),
  ielts: z.number().min(0).max(9).optional(),
  duolingo: z.number().min(0).max(160).optional(),
  sat: z.number().min(400).max(1600).optional(),
  budget: z.number().positive(),
  budgetCurrency: z.string().length(3).default("USD"),
  targetCountry: z.string().min(2).max(2),
  preferredCity: z.string().optional(),
  preferredSubject: z.string().min(1),
  financialCapability: financialCapabilitySchema,
  preferredIntake: z.string().min(1),
  workWhileStudying: z.boolean().default(false),
  scholarshipPreference: scholarshipPreferenceSchema,
  userId: z.string().uuid().optional(),
  topN: z.number().int().min(1).max(50).optional(),
  forceRefresh: z.boolean().optional(),
});

export type RecommendationRequestInput = z.infer<
  typeof recommendationRequestSchema
>;
