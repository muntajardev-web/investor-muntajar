import type { Metadata } from "next";
import { StudentOnboardingWizard } from "@/components/student/student-onboarding-wizard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Get Started | Muntajar — Global Mobility Platform",
  description: "Start your application profile on Muntajar.",
};

export default function GetStartedPage() {
  return <StudentOnboardingWizard />;
}
