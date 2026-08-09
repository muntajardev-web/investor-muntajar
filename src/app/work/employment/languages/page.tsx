import { PageHeader, Panel } from "@/components/employment";
import { LanguagesForm } from "@/components/employment/languages-form";
import { requireAuth } from "@/server/auth/session";
import { getWorkerProfile } from "@/lib/employment/queries";

export default async function EmploymentLanguagesPage() {
  const session = await requireAuth();
  const profile = await getWorkerProfile(session.user.id);
  const languages = Array.isArray(profile?.languages)
    ? (profile.languages as Array<{
        language?: string;
        level?: string;
        score?: string;
      }>)
    : [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Language"
        description="Step 5 — English, IELTS, TOEFL, and other languages."
      />
      <Panel>
        <LanguagesForm
          initial={languages.map((l) => ({
            language: l.language ?? "",
            level: l.level ?? "",
            score: l.score ?? "",
          }))}
        />
      </Panel>
    </div>
  );
}
