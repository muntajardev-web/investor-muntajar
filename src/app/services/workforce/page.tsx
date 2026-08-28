import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/page-layout";
import { WorkforcePage } from "@/components/services/workforce-page";

export const metadata: Metadata = {
  title: "Overseas Jobs & Workforce Mobility — Verified Employer Placements | Muntajar",
  description:
    "Ethical overseas jobs and work visa placement in Europe, Middle East, Japan, UK, and Canada. ILO compliant contracts with zero middle-man exploitation.",
};

export default function WorkforceRoutePage() {
  return (
    <PageLayout showCta={false}>
      <WorkforcePage />
    </PageLayout>
  );
}
