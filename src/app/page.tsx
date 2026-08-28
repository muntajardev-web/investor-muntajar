import type { Metadata } from "next";
import { Toaster } from "sonner";
import { PageLayout } from "@/components/layout/page-layout";
import { InvestorsPageContent } from "@/components/investors/investors-page-content";

export const metadata: Metadata = {
  title: "Invest in Muntajar — Equity, Perks & Early Access",
  description:
    "Partner with Muntajar — the broker-free global mobility platform for Bangladesh. Investors get equity, free lifetime subscriptions, referral rewards, giveaway access, and more.",
};

export default function Home() {
  return (
    <PageLayout showCta={false}>
      <Toaster position="top-center" />
      <InvestorsPageContent />
    </PageLayout>
  );
}

