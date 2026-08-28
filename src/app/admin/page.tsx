import { PageHeader } from "@/components/admin/page-header";
import { getAdminStats, getRecentActivity } from "@/lib/admin/queries";
import { DashboardClient } from "./dashboard-client";

export default async function AdminDashboardPage() {
  const [stats, activity] = await Promise.all([
    getAdminStats(),
    getRecentActivity(),
  ]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of platform activity and key metrics."
      />
      <DashboardClient stats={stats} activity={activity} />
    </div>
  );
}
