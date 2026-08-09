import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/page-layout";
import { StudyAbroadPage } from "@/components/services/study-abroad-page";

export const metadata: Metadata = {
  title: "Study Abroad for Students — Universities & Scholarships | Muntajar",
  description:
    "End-to-end AI platform for international students. University shortlisting, 100% scholarship finder, SOP writing, and guaranteed visa guidance in UK, USA, Canada, Australia & Germany.",
};

export default function StudyAbroadRoutePage() {
  return (
    <PageLayout showCta={false}>
      <StudyAbroadPage />
    </PageLayout>
  );
}
