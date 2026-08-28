import { requireAuth } from "@/server/auth/session";
import { StudentDashboardClient } from "@/components/student/student-dashboard-client";

export default async function StudentDashboardPage() {
  let session;
  try {
    session = await requireAuth();
  } catch {
    session = { user: { name: "Demo Student" } };
  }

  const userName = session?.user?.name ?? "Demo Student";
  return <StudentDashboardClient userName={userName} />;
}
