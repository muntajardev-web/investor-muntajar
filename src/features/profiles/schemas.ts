import { z } from "zod";

const degreeLevel = z.enum([
  "FOUNDATION",
  "BACHELOR",
  "MASTER",
  "PHD",
  "DIPLOMA",
]);

const boardType = z.enum(["HSC", "A_LEVEL", "IB", "CBSE", "OTHER"]);

export const profileSchema = z.object({
  gpa: z.number().min(0).max(5).optional(),
  gpaScale: z.number().min(1).max(10).optional(),
  board: boardType.optional(),
  targetCountries: z.array(z.string().length(2)).min(1),
  budget: z.number().positive().optional(),
  budgetCurrency: z.string().length(3).default("USD"),
  degreeLevel,
  preferredCourses: z.array(z.string()).default([]),
  ieltsOverall: z.number().min(0).max(9).optional(),
  ieltsReading: z.number().min(0).max(9).optional(),
  ieltsWriting: z.number().min(0).max(9).optional(),
  ieltsListening: z.number().min(0).max(9).optional(),
  ieltsSpeaking: z.number().min(0).max(9).optional(),
});

export const updateProfileSchema = profileSchema.partial();

export type ProfileInput = z.infer<typeof profileSchema>;
