import type { UserRole } from "@prisma/client";

export interface AuthUser {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  role: UserRole;
}

export interface AuthSession {
  user: AuthUser;
  clerkUserId: string;
}
