import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/page-layout";
import { WorkforcePage } from "@/components/services/workforce-page";

export const metadata: Metadata = {
  title: "Skilled Professionals & Overseas Career Mobility | Muntajar",
  description:
    "Career growth, direct employer placement, and work visa migration for engineers, IT professionals, nurses, and skilled specialists worldwide.",
};

export default function SkilledProfessionalsRoutePage() {
  return (
    <PageLayout showCta={false}>
      <WorkforcePage />
    </PageLayout>
  );
}
