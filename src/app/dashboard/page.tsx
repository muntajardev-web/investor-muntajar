import { requireAuth } from "@/server/auth/session";
import { StudentDashboardClient } from "@/components/student/student-dashboard-client";

export default async function DashboardOverviewPage() {
  const session = await requireAuth();
  const userName = session?.user?.name ?? "Demo Student";

  return <StudentDashboardClient userName={userName} />;
}
