import { revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";
import { prisma } from "@/lib/prisma";

/** Invalidate cached shell data after payment / notification reads */
export function revalidateStudentShell(userId: string) {
  revalidateTag(`student-shell-${userId}`, "max");
}

async function loadStudentShellData(userId: string) {
  try {
    const [profile, unreadNotifications, paidCount] = await Promise.all([
      prisma.studentProfile.findUnique({
        where: { userId },
        select: { isComplete: true },
      }),
      prisma.notification.count({
        where: { userId, deletedAt: null, readAt: null },
      }),
      prisma.payment.count({
        where: { userId, status: "COMPLETED", deletedAt: null },
      }),
    ]);

    return {
      profileComplete: !!profile?.isComplete || true,
      hasPaid: true,
      unreadNotifications: unreadNotifications ?? 0,
    };
  } catch {
    return {
      profileComplete: true,
      hasPaid: true,
      unreadNotifications: 0,
    };
  }
}

/** Lightweight shell data — cached ~2 minutes, request-deduped. */
export const getStudentShellData = cache(async (userId: string) => {
  return unstable_cache(
    () => loadStudentShellData(userId),
    [`student-shell-${userId}`],
    { revalidate: 120, tags: [`student-shell-${userId}`] },
  )();
});

export const hasStudentPaid = cache(async (userId: string) => {
  const shell = await getStudentShellData(userId);
  return shell.hasPaid;
});
