import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { PricingPageContent } from "@/components/pricing/pricing-page-content";

export const metadata: Metadata = {
  title: "Transparent Pricing & Membership Plans | Muntajar",
  description: "Explore 100% transparent no-broker pricing for study abroad, skilled professionals, and workforce mobility tracks.",
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main>
        <PricingPageContent />
      </main>
      <Footer />
    </>
  );
}
