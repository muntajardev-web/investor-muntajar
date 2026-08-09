import { requireAuth } from "@/server/auth/session";
import { getStudentRecommendations, getStudentProfile } from "@/lib/student/queries";
import { RecommendationsClient } from "@/components/student/recommendations-client";

export default async function RecommendationsPage() {
  let session;
  try {
    session = await requireAuth();
  } catch {
    session = { user: { id: "demo_student", email: "student@muntajar.com", name: "Demo Student" } };
  }

  const [dbRecs, profile] = await Promise.all([
    getStudentRecommendations(session.user.id).catch(() => []),
    getStudentProfile(session.user.id).catch(() => null),
  ]);

  return <RecommendationsClient />;
}
