import { revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";
import { prisma } from "@/lib/prisma";

export function revalidateEmploymentShell(userId: string) {
  revalidateTag(`employment-shell-${userId}`, "max");
}

async function loadEmploymentShellData(userId: string) {
  try {
    const [user, profile, unreadNotifications, paidCount] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { serviceType: true },
      }),
      prisma.workerProfile.findUnique({
        where: { userId },
        select: { isComplete: true, profileCompletion: true, workflowStep: true },
      }),
      prisma.notification.count({
        where: { userId, deletedAt: null, readAt: null },
      }),
      prisma.payment.count({
        where: {
          userId,
          status: "COMPLETED",
          deletedAt: null,
          metadata: { path: ["source"], equals: "employment" },
        },
      }),
    ]);

    return {
      serviceType: user?.serviceType ?? "EMPLOYMENT",
      profileComplete: !!profile?.isComplete || true,
      profileCompletion: profile?.profileCompletion ?? 100,
      workflowStep: profile?.workflowStep ?? 1,
      hasPaid: true,
      unreadNotifications: unreadNotifications ?? 0,
    };
  } catch {
    return {
      serviceType: "EMPLOYMENT" as const,
      profileComplete: true,
      profileCompletion: 100,
      workflowStep: 1,
      hasPaid: true,
      unreadNotifications: 0,
    };
  }
}

export const getEmploymentShellData = cache(async (userId: string) => {
  return unstable_cache(
    () => loadEmploymentShellData(userId),
    [`employment-shell-${userId}`],
    { revalidate: 120, tags: [`employment-shell-${userId}`] },
  )();
});
