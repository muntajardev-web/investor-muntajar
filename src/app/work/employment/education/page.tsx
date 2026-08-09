import { PageHeader } from "@/components/employment";
import { EducationForm } from "@/components/employment/education-form";
import { requireAuth } from "@/server/auth/session";
import { getWorkerProfile } from "@/lib/employment/queries";

export default async function EmploymentEducationPage() {
  const session = await requireAuth();
  const profile = await getWorkerProfile(session.user.id);
  const education = Array.isArray(profile?.education)
    ? (profile.education as Array<{
        level?: string;
        institution?: string;
        graduationYear?: string | number;
        gpa?: string | number;
      }>)
    : [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Education"
        description="Step 2 — Add academic and technical qualifications."
      />
      <EducationForm
        initial={education.map((e) => ({
          level: e.level ?? "",
          institution: e.institution ?? "",
          graduationYear: String(e.graduationYear ?? ""),
          gpa: String(e.gpa ?? ""),
        }))}
      />
    </div>
  );
}
