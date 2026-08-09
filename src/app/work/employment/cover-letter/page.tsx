import { PageHeader } from "@/components/employment";
import { CoverLetterGenerator } from "@/components/employment/cover-letter-generator";
import { requireAuth } from "@/server/auth/session";
import { prisma } from "@/lib/prisma";

export default async function CoverLetterPage() {
  const session = await requireAuth();

  const [versions, matches] = await Promise.all([
    prisma.coverLetterVersion.findMany({
      where: { userId: session.user.id, deletedAt: null },
      orderBy: { version: "desc" },
      take: 30,
    }),
    prisma.jobMatch.findMany({
      where: { userId: session.user.id, deletedAt: null },
      include: { jobListing: true },
      orderBy: { matchScore: "desc" },
      take: 15,
    }),
  ]);

  const jobs = matches.map((m) => ({
    id: m.jobListingId,
    title: m.jobListing.title,
    company: m.jobListing.company,
    country: m.jobListing.country,
  }));

  // Dedupe by listing id
  const uniqueJobs = Array.from(
    new Map(jobs.map((j) => [j.id, j])).values(),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Cover Letter Generator"
        description="Personalized letters from your profile, job, company, country, and language. Edit, download PDF, and keep every version."
      />
      <CoverLetterGenerator
        initialVersions={versions.map((v) => ({
          id: v.id,
          version: v.version,
          template: v.template,
          language: v.language,
          jobTitle: v.jobTitle,
          company: v.company,
          country: v.country,
          content: v.content,
          userEdited: v.userEdited,
          isActive: v.isActive,
          createdAt: v.createdAt,
        }))}
        jobs={uniqueJobs}
      />
    </div>
  );
}
