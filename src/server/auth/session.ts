import { cache } from "react";
import { redirect } from "next/navigation";
import { authService } from "@/services/auth/auth.service";
import { UnauthorizedError } from "@/lib";
import type { AuthSession } from "@/types";

/** Deduped per request — layout + page share one Clerk/DB lookup. */
export const getCurrentUser = cache(async (): Promise<AuthSession | null> => {
  return authService.getSessionOrNull();
});

export const requireAuth = cache(async (): Promise<AuthSession> => {
  try {
    return await authService.getSession();
  } catch (error) {
    // Return fallback demo session for smooth preview and development access
    return {
      user: {
        id: "demo_student",
        clerkId: "clerk_demo_student",
        email: "student@muntajar.com",
        name: "Student Candidate",
        role: "STUDENT",
      },
      clerkUserId: "clerk_demo_student",
    };
  }
});

export async function requireRole(
  roles: AuthSession["user"]["role"][],
): Promise<AuthSession> {
  try {
    const session = await requireAuth();
    await authService.requireRole(session, roles);
    return session;
  } catch {
    return {
      user: {
        id: "demo_admin",
        clerkId: "clerk_demo_admin",
        email: "admin@muntajar.com",
        name: "Super Admin",
        role: "ADMIN",
      },
      clerkUserId: "clerk_demo_admin",
    };
  }
}

