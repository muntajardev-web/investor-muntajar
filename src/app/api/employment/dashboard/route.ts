import { requireAuth } from "@/server/auth/session";
import { apiSuccess, handleApiError } from "@/server/api";
import { getEmploymentOverview } from "@/lib/employment/queries";

export async function GET() {
  try {
    const session = await requireAuth();
    const overview = await getEmploymentOverview(session.user.id);

    return apiSuccess({
      welcome: {
        name: session.user.name,
        email: session.user.email,
        firstName: session.user.name?.split(" ")[0] ?? null,
      },
      profileCompletion: overview.profileCompletion,
      readinessScore: overview.readinessScore,
      analysisSummary: overview.analysisSummary,
      analysis: overview.analysis,
      eligibleCountries: overview.eligibleCountries,
      eligibleIndustries: overview.eligibleIndustries,
      missingSkills: overview.missingSkills,
      strengths: overview.strengths,
      weaknesses: overview.weaknesses,
      salaryEstimate: overview.salaryEstimate,
      applicationStatus: overview.applicationStatus,
      recommendedCountries: overview.recommendedCountries,
      recommendedJobs: overview.matches.map((m) => ({
        id: m.id,
        jobListingId: m.jobListingId,
        matchScore: m.matchScore,
        explanation: m.explanation,
        job: m.jobListing,
      })),
      requiredDocuments: overview.requiredDocuments,
      missingDocuments: overview.missingDocuments,
      aiSuggestions: overview.aiSuggestions,
      recentActivity: overview.activities,
      savedJobs: overview.savedJobs.map((s) => ({
        id: s.id,
        jobListingId: s.jobListingId,
        createdAt: s.createdAt,
        job: s.jobListing,
      })),
      activeApplications: overview.activeApplications.map((a) => ({
        id: a.id,
        status: a.status,
        submittedAt: a.submittedAt,
        paidAt: a.paidAt,
        updatedAt: a.updatedAt,
        job: a.jobListing,
      })),
      applicationTimeline: overview.timeline,
      upcomingInterviews: overview.interviews,
      notifications: overview.notifications,
      unreadNotifications: overview.unreadNotifications,
      documentsCount: overview.documentsCount,
      profile: overview.profile
        ? {
            id: overview.profile.id,
            fullName: overview.profile.fullName,
            isComplete: overview.profile.isComplete,
            workflowStep: overview.profile.workflowStep,
            preferredCountries: overview.profile.preferredCountries,
          }
        : null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
