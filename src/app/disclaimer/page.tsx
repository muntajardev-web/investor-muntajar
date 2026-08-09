import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = { title: "Disclaimer" };

export default function DisclaimerPage() {
  return (
    <PageLayout showCta={false}>
      <PageHero title="Disclaimer" />
      <section className="section-padding-sm">
        <Container className="max-w-3xl">
          <p className="text-stone-600 leading-relaxed">Muntajar is a global mobility platform providing guidance, coaching, and digital tools. We are not a government agency and do not guarantee visa approvals, university admissions, or job placements. All outcomes depend on individual eligibility, documentation, and third-party decisions.</p>
          <p className="text-stone-600 leading-relaxed mt-4">Information on this website is for general guidance. Always verify requirements with official embassy, university, and employer sources.</p>
        </Container>
      </section>
    </PageLayout>
  );
}
