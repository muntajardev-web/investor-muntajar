import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/page-layout";
import { VisaMigrationPage } from "@/components/services/visa-migration-page";

export const metadata: Metadata = {
  title: "Visa & Migration — Routes, Eligibility & Honest Guidance | Muntajar",
  description:
    "Transparent visa guidance for students, professionals, and workers. Express Entry PR, Germany Opportunity Card, UK Skilled Worker, and embassy mock interviews.",
};

export default function VisaMigrationRoutePage() {
  return (
    <PageLayout showCta={false}>
      <VisaMigrationPage />
    </PageLayout>
  );
}
