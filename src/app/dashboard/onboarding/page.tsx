import { redirect } from "next/navigation";

/** Legacy path — onboarding lives at /get-started */
export default function DashboardOnboardingRedirect() {
  redirect("/get-started");
}
