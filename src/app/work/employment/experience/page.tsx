import { PageHeader } from "@/components/employment";
import { ExperienceForm } from "@/components/employment/experience-form";
import { requireAuth } from "@/server/auth/session";
import { getWorkerProfile } from "@/lib/employment/queries";

export default async function EmploymentExperiencePage() {
  const session = await requireAuth();
  const profile = await getWorkerProfile(session.user.id);
  const experience = Array.isArray(profile?.experience)
    ? (profile.experience as Array<{
        employer?: string;
        position?: string;
        years?: string | number;
        responsibilities?: string;
        isCurrent?: boolean;
        hasCertificate?: boolean;
        hasReference?: boolean;
      }>)
    : [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Work Experience"
        description="Step 3 — Current and previous jobs, certificates, and references."
      />
      <ExperienceForm
        initial={experience.map((e) => ({
          employer: e.employer ?? "",
          position: e.position ?? "",
          years: String(e.years ?? ""),
          responsibilities: e.responsibilities ?? "",
          isCurrent: !!e.isCurrent,
          hasCertificate: !!e.hasCertificate,
          hasReference: !!e.hasReference,
        }))}
      />
    </div>
  );
}
