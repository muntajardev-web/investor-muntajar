import type { BoardType, DegreeLevel } from "@prisma/client";

export interface UserProfileDTO {
  id: string;
  userId: string;
  gpa: number | null;
  gpaScale: number | null;
  board: BoardType | null;
  targetCountries: string[];
  budget: number | null;
  budgetCurrency: string;
  degreeLevel: DegreeLevel;
  preferredCourses: string[];
  ieltsOverall: number | null;
  ieltsReading: number | null;
  ieltsWriting: number | null;
  ieltsListening: number | null;
  ieltsSpeaking: number | null;
  otherPreferences: Record<string, unknown> | null;
  isComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserProfileInput {
  userId: string;
  gpa?: number;
  gpaScale?: number;
  board?: BoardType;
  targetCountries?: string[];
  budget?: number;
  budgetCurrency?: string;
  degreeLevel: DegreeLevel;
  preferredCourses?: string[];
  ieltsOverall?: number;
  ieltsReading?: number;
  ieltsWriting?: number;
  ieltsListening?: number;
  ieltsSpeaking?: number;
  otherPreferences?: Record<string, unknown>;
}

export type UpdateUserProfileInput = Partial<
  Omit<CreateUserProfileInput, "userId">
>;
