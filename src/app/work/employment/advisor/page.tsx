import { PageHeader, Panel } from "@/components/employment";
import { CareerAdvisorChat } from "@/components/employment/career-advisor-chat";
import { requireAuth } from "@/server/auth/session";
import {
  getCareerAdvice,
  getJobMatches,
  getWorkerProfile,
} from "@/lib/employment/queries";

export default async function EmploymentAdvisorPage() {
  const session = await requireAuth();
  const [messages, profile, matches] = await Promise.all([
    getCareerAdvice(session.user.id),
    getWorkerProfile(session.user.id),
    getJobMatches(session.user.id),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Career Coach"
        description="Step 9 — Asks using your profile, analysis, and matches. Won't invent visas or salaries. Chat history is stored."
      />
      <Panel>
        <CareerAdvisorChat
          profileName={profile?.fullName}
          hasAnalysis={!!profile?.aiAnalysis}
          matchCount={matches.length}
          initialMessages={messages.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
          }))}
        />
      </Panel>
    </div>
  );
}
