import { unstable_cache } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import { userRepository } from "@/repositories";
import { UnauthorizedError } from "@/lib";
import type { AuthSession, AuthUser } from "@/types";

type SessionUser = {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  role: AuthUser["role"];
};

function cachedSessionUser(clerkUserId: string) {
  return unstable_cache(
    () => userRepository.findByClerkIdForSession(clerkUserId),
    [`auth-session-${clerkUserId}`],
    { revalidate: 60, tags: [`auth-session-${clerkUserId}`] },
  )();
}

export const authService = {
  async ensureDemoUser(serviceType: "STUDY" | "EMPLOYMENT" = "STUDY"): Promise<SessionUser> {
    const isWorker = serviceType === "EMPLOYMENT";
    const clerkId = isWorker ? "demo_worker_clerk_id" : "demo_student_clerk_id";
    const email = isWorker ? "worker@muntajar.com" : "student@muntajar.com";
    const name = isWorker ? "Demo Professional" : "Demo Student";

    try {
      const { prisma } = await import("@/lib/prisma");
      const user = await prisma.user.upsert({
        where: { clerkId },
        create: {
          clerkId,
          email,
          name,
          role: "STUDENT",
          serviceType,
          status: "ACTIVE",
        },
        update: {
          serviceType,
        },
      });

      if (!isWorker) {
        await prisma.studentProfile.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            degreeLevel: "BACHELOR",
            isComplete: true,
            targetCountries: ["United Kingdom", "Canada", "Germany"],
            preferredCourses: ["Computer Science", "Business Administration"],
            gpa: 3.8,
          },
          update: {
            isComplete: true,
          },
        });

        const existingPayment = await prisma.payment.findFirst({
          where: { userId: user.id, status: "COMPLETED" },
        });

        if (!existingPayment) {
          await prisma.payment.create({
            data: {
              userId: user.id,
              amount: 99.00,
              currency: "USD",
              provider: "STRIPE",
              status: "COMPLETED",
              providerRef: "demo_tx_" + Date.now(),
            },
          });
        }
      }

      return {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    } catch {
      return {
        id: isWorker ? "00000000-0000-0000-0000-000000000002" : "00000000-0000-0000-0000-000000000001",
        clerkId,
        email,
        name,
        role: "STUDENT",
      };
    }
  },

  async getSession(): Promise<AuthSession> {
    try {
      const { userId: clerkUserId } = await auth();
      if (clerkUserId) {
        let user: SessionUser | null = await cachedSessionUser(clerkUserId);

        if (!user) {
          const synced = await this.syncUserFromClerk(clerkUserId);
          user = {
            id: synced.id,
            clerkId: synced.clerkId,
            email: synced.email,
            name: synced.name,
            role: synced.role,
          };
        }

        return {
          clerkUserId,
          user: this.toAuthUser(user),
        };
      }
    } catch {
      // Ignore Clerk errors when not signed in
    }

    throw new UnauthorizedError("Authentication required");
  },

  /** Create or update a local user record from Clerk profile data. */
  async syncUserFromClerk(clerkUserId: string) {
    const clerkUser = await currentUser();
    if (!clerkUser || clerkUser.id !== clerkUserId) {
      throw new UnauthorizedError("User not synced to database");
    }

    const email =
      clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId,
      )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      throw new UnauthorizedError("Clerk account has no email address");
    }

    return userRepository.upsertByClerkId({
      clerkId: clerkUserId,
      email,
      name:
        [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
        undefined,
      phone: clerkUser.phoneNumbers[0]?.phoneNumber,
      avatarUrl: clerkUser.imageUrl,
    });
  },

  async getSessionOrNull(): Promise<AuthSession | null> {
    try {
      return await this.getSession();
    } catch {
      return null;
    }
  },

  async requireRole(
    session: AuthSession,
    roles: AuthUser["role"][],
  ): Promise<void> {
    if (!roles.includes(session.user.role)) {
      const { ForbiddenError } = await import("@/lib");
      throw new ForbiddenError();
    }
  },

  toAuthUser(user: SessionUser): AuthUser {
    return {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  },
};
