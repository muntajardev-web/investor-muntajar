import type { Metadata } from "next";
import { UnderConstructionView } from "@/components/common/under-construction-view";

export const metadata: Metadata = {
  title: "Portal Sign In | Muntajar — Global Mobility Platform",
  description: "Sign in to your Muntajar Student, Worker, or Investor portal.",
};

export default function LoginPage() {
  return (
    <UnderConstructionView
      title="Portal Sign In Restricted"
      subtitle="The Muntajar candidate & advisor portal is currently in private preview. Account sign-in is restricted to verified beta partners."
      pageContext="login"
    />
  );
}
