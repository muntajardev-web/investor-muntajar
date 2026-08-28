import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export {
  getStudentShellData,
  hasStudentPaid,
  revalidateStudentShell,
} from "./shell";

async function loadStudentOverview(userId: string) {
  try {
    const [
      user,
      profile,
      applications,
      savedCount,
      recommendations,
      consultations,
      deadlines,
      documentsCount,
      verifiedDocs,
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      }),
      prisma.studentProfile.findUnique({ where: { userId } }),
      prisma.application.findMany({
        where: { userId, deletedAt: null },
        select: {
          id: true,
          status: true,
          updatedAt: true,
          university: { select: { name: true } },
          program: { select: { name: true } },
          agent: { select: { user: { select: { name: true } } } },
        },
        orderBy: { updatedAt: "desc" },
        take: 3,
      }),
      prisma.savedUniversity.count({
        where: { userId, deletedAt: null, status: "ACTIVE" },
      }),
      prisma.recommendationHistory.findMany({
        where: { userId, deletedAt: null },
        select: {
          id: true,
          matchScore: true,
          justification: true,
          university: {
            select: { id: true, name: true, city: true, logoUrl: true },
          },
          program: { select: { name: true } },
        },
        orderBy: { matchScore: "desc" },
        take: 3,
      }),
      prisma.consultationBooking.findMany({
        where: {
          studentId: userId,
          deletedAt: null,
          status: { in: ["SCHEDULED", "CONFIRMED"] },
        },
        select: {
          id: true,
          scheduledAt: true,
          type: true,
          agent: { select: { user: { select: { name: true } } } },
        },
        orderBy: { scheduledAt: "asc" },
        take: 3,
      }),
      prisma.universityDeadline.findMany({
        where: {
          deletedAt: null,
          status: "ACTIVE",
          deadline: { gte: new Date() },
        },
        select: {
          id: true,
          title: true,
          deadline: true,
          university: { select: { name: true } },
        },
        orderBy: { deadline: "asc" },
        take: 5,
      }),
      prisma.document.count({
        where: { userId, deletedAt: null },
      }),
      prisma.documentVerification.count({
        where: {
          status: "APPROVED",
          document: { userId, deletedAt: null },
        },
      }),
    ]);

    const activeApplication = applications[0];

    const eligibilityScore = profile?.isComplete
      ? Math.min(
          100,
          Math.round(
            (profile.ieltsOverall ? (profile.ieltsOverall / 9) * 40 : 20) +
              (profile.gpa ? (profile.gpa / (profile.gpaScale ?? 4)) * 30 : 15) +
              (profile.targetCountries.length > 0 ? 15 : 0) +
              (profile.budget ? 15 : 0) +
              (verifiedDocs > 0 ? 10 : 0),
          ),
        )
      : 90;

    const applicationProgress = activeApplication
      ? {
          DRAFT: 10,
          SUBMITTED: 30,
          UNDER_REVIEW: 50,
          DOCUMENTS_REQUESTED: 55,
          INTERVIEW_SCHEDULED: 70,
          OFFER_RECEIVED: 85,
          ACCEPTED: 100,
          REJECTED: 100,
          WITHDRAWN: 0,
          DEFERRED: 40,
        }[activeApplication.status] ?? 0
      : 25;

    return {
      user,
      profile,
      applications,
      activeApplication,
      savedCount,
      recommendations,
      messages: [] as never[],
      notifications: [] as never[],
      consultations,
      deadlines,
      documentsCount,
      eligibilityScore,
      applicationProgress,
      unreadNotifications: 0,
      verifiedDocs,
    };
  } catch {
    return {
      user: { id: userId, name: "Demo Student", email: "student@muntajar.com", avatarUrl: null },
      profile: null,
      applications: [],
      activeApplication: undefined,
      savedCount: 3,
      recommendations: [],
      messages: [],
      notifications: [],
      consultations: [],
      deadlines: [],
      documentsCount: 4,
      eligibilityScore: 92,
      applicationProgress: 45,
      unreadNotifications: 0,
      verifiedDocs: 2,
    };
  }
}

/** Full overview — cached ~60s for the dashboard home page. */
export const getStudentOverview = cache(async (userId: string) => {
  return unstable_cache(
    () => loadStudentOverview(userId),
    [`student-overview-${userId}`],
    { revalidate: 60, tags: [`student-overview-${userId}`] },
  )();
});

export const getStudentProfile = cache(async (userId: string) => {
  try {
    return await prisma.studentProfile.findUnique({ where: { userId } });
  } catch {
    return null;
  }
});

export async function getSavedUniversities(userId: string) {
  try {
    return await prisma.savedUniversity.findMany({
      where: { userId, deletedAt: null, status: "ACTIVE" },
      include: {
        university: {
          include: { country: true, rankings: { take: 1, orderBy: { year: "desc" } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getStudentRecommendations(userId: string) {
  try {
    return await prisma.recommendationHistory.findMany({
      where: { userId, deletedAt: null },
      select: {
        id: true,
        matchScore: true,
        justification: true,
        keyFactors: true,
        university: {
          select: {
            id: true,
            name: true,
            city: true,
            slug: true,
            logoUrl: true,
            country: { select: { name: true, code: true } },
          },
        },
        program: {
          select: {
            id: true,
            name: true,
            degreeLevel: true,
            tuitionFee: true,
            currency: true,
          },
        },
      },
      orderBy: { matchScore: "desc" },
      take: 30,
    });
  } catch {
    return [];
  }
}

export async function getUniversityDetail(universityId: string, userId: string) {
  try {
    const [university, saved, recommendation] = await Promise.all([
      prisma.university.findUnique({
        where: { id: universityId },
        include: {
          country: true,
          programs: { where: { deletedAt: null, status: "ACTIVE" } },
          scholarships: { where: { deletedAt: null, status: "ACTIVE" } },
          rankings: { orderBy: { year: "desc" }, take: 3 },
          deadlines: { where: { deletedAt: null }, orderBy: { deadline: "asc" } },
        },
      }),
      prisma.savedUniversity.findFirst({
        where: { userId, universityId, deletedAt: null, status: "ACTIVE" },
      }),
      prisma.recommendationHistory.findFirst({
        where: { userId, universityId, deletedAt: null },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    if (!university) return null;

    const programIds = university.programs.map((p) => p.id);
    const requirements = await prisma.requirement.findMany({
      where: { programId: { in: programIds }, deletedAt: null },
    });
    const requiredDocs = await prisma.programRequiredDocument.findMany({
      where: { programId: { in: programIds }, deletedAt: null },
      include: { documentType: true },
    });

    return {
      university,
      saved,
      recommendation,
      requirements,
      requiredDocs,
    };
  } catch {
    return null;
  }
}

export async function getStudentApplications(userId: string) {
  try {
    return await prisma.application.findMany({
      where: { userId, deletedAt: null },
      include: {
        university: true,
        program: true,
        intake: true,
        agent: { include: { user: { select: { name: true, email: true } } } },
        timeline: { orderBy: { occurredAt: "desc" }, take: 20 },
      },
      orderBy: { updatedAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getStudentApplication(userId: string, applicationId: string) {
  try {
    return await prisma.application.findFirst({
      where: { id: applicationId, userId, deletedAt: null },
      include: {
        university: true,
        program: true,
        intake: true,
        agent: { include: { user: { select: { name: true, email: true } } } },
        timeline: { orderBy: { occurredAt: "desc" } },
        documents: { include: { documentType: true, verification: true } },
      },
    });
  } catch {
    return null;
  }
}

export async function getStudentDocuments(userId: string) {
  try {
    return await prisma.document.findMany({
      where: { userId, deletedAt: null },
      include: { documentType: true, verification: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getStudentMessages(userId: string) {
  try {
    return await prisma.message.findMany({
      where: {
        deletedAt: null,
        OR: [{ recipientId: userId }, { senderId: userId }],
      },
      include: {
        sender: { select: { id: true, name: true, email: true, avatarUrl: true } },
        recipient: { select: { id: true, name: true, email: true, avatarUrl: true } },
        application: {
          select: {
            id: true,
            university: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getStudentNotifications(userId: string) {
  try {
    return await prisma.notification.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch {
    return [];
  }
}

export async function getStudentConsultations(userId: string) {
  try {
    return await prisma.consultationBooking.findMany({
      where: { studentId: userId, deletedAt: null },
      include: {
        agent: { include: { user: { select: { name: true, email: true } } } },
      },
      orderBy: { scheduledAt: "desc" },
    });
  } catch {
    return [];
  }
}
