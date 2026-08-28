import type { Metadata } from "next";
import { WorkerProfessionalPortalShell } from "@/components/portal/worker-professional/portal-shell";
import { WorkerProfessionalPortalDashboardView } from "@/components/portal/worker-professional/portal-dashboard-view";

export const metadata: Metadata = {
  title: "Worker & Professional Portal — Command Center | Muntajar",
  description: "Handcrafted Worker & Professional Portal command center built with Stripe & Linear design aesthetics.",
};

export default function WorkerPortalPage() {
  return (
    <WorkerProfessionalPortalShell activeTab="overview">
      <WorkerProfessionalPortalDashboardView />
    </WorkerProfessionalPortalShell>
  );
}
