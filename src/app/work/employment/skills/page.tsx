import { PageHeader, Panel } from "@/components/employment";
import { SkillsForm } from "@/components/employment/skills-form";
import { requireAuth } from "@/server/auth/session";
import { getWorkerProfile } from "@/lib/employment/queries";

export default async function EmploymentSkillsPage() {
  const session = await requireAuth();
  const profile = await getWorkerProfile(session.user.id);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Skills"
        description="Step 4 — Select trade and professional skills, or add your own."
      />
      <Panel>
        <SkillsForm
          initialSkills={profile?.skills ?? []}
          initialCustom={profile?.customSkills ?? []}
        />
      </Panel>
    </div>
  );
}
