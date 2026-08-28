import { z } from "zod";

export const universityFilterSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  country: z.string().optional(),
  countryCode: z.string().length(2).optional(),
  degreeLevel: z
    .enum(["FOUNDATION", "BACHELOR", "MASTER", "PHD", "DIPLOMA"])
    .optional(),
  maxTuition: z.coerce.number().positive().optional(),
  search: z.string().optional(),
});
