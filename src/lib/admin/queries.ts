import { prisma } from "@/lib/prisma";

export async function getAdminStats() {
  const [
    students,
    applications,
    universities,
    programs,
    consultations,
    pendingDocs,
    recommendations,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT", deletedAt: null } }),
    prisma.application.count({ where: { deletedAt: null } }),
    prisma.university.count({ where: { deletedAt: null, status: "ACTIVE" } }),
    prisma.program.count({ where: { deletedAt: null, status: "ACTIVE" } }),
    prisma.consultationBooking.count({
      where: { deletedAt: null, status: "SCHEDULED" },
    }),
    prisma.documentVerification.count({
      where: { status: "PENDING", deletedAt: null },
    }),
    prisma.recommendationHistory.count({ where: { deletedAt: null } }),
  ]);

  return {
    students,
    applications,
    universities,
    programs,
    consultations,
    pendingDocs,
    recommendations,
  };
}

export async function getRecentActivity() {
  const [audits, applications] = await Promise.all([
    prisma.auditLog.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.application.findMany({
      where: { deletedAt: null },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: {
        user: { select: { name: true, email: true } },
        university: { select: { name: true } },
      },
    }),
  ]);

  return { audits, applications };
}
