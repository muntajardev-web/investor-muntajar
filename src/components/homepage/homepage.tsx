import dynamic from "next/dynamic";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { HeroSection } from "@/components/homepage/hero-section";
import { WhatWeDoSection } from "@/components/homepage/what-we-do-section";
import { LangProvider } from "@/context/lang-context";

const ComparisonSection = dynamic(
  () => import("@/components/homepage/comparison-section").then((m) => m.ComparisonSection),
  { ssr: true },
);
const WhySection = dynamic(
  () => import("@/components/homepage/why-section").then((m) => m.WhySection),
  { ssr: true },
);
const PathwaysSection = dynamic(
  () =>
    import("@/components/homepage/pathways-section").then(
      (m) => m.PathwaysSection,
    ),
  { ssr: true },
);
const HowItWorksSection = dynamic(
  () =>
    import("@/components/homepage/how-it-works-section").then(
      (m) => m.HowItWorksSection,
    ),
  { ssr: true },
);
const DestinationsSection = dynamic(
  () =>
    import("@/components/homepage/destinations-section").then(
      (m) => m.DestinationsSection,
    ),
  { ssr: true },
);
const PlatformSection = dynamic(
  () =>
    import("@/components/homepage/platform-section").then(
      (m) => m.PlatformSection,
    ),
  { ssr: true },
);
const StoriesSection = dynamic(
  () =>
    import("@/components/homepage/stories-section").then((m) => m.StoriesSection),
  { ssr: true },
);
const PricingSection = dynamic(
  () =>
    import("@/components/homepage/pricing-section").then(
      (m) => m.PricingSection,
    ),
  { ssr: true },
);
const FaqSection = dynamic(
  () => import("@/components/homepage/faq-section").then((m) => m.FaqSection),
  { ssr: true },
);
const CtaSection = dynamic(
  () => import("@/components/homepage/cta-section").then((m) => m.CtaSection),
  { ssr: true },
);

export function Homepage() {
  return (
    <LangProvider>
      <Navbar />
      <main>
        <HeroSection />
        <WhatWeDoSection />
        <ComparisonSection />
        <WhySection />
        <PathwaysSection />
        <HowItWorksSection />
        <DestinationsSection />
        <StoriesSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </LangProvider>
  );
}
