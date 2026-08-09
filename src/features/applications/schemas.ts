import { z } from "zod";

export const applicationSchema = z.object({
  universityId: z.string().cuid(),
  programId: z.string().cuid().optional(),
  intake: z.string().optional(),
  notes: z.string().max(2000).optional(),
});
