import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <PageLayout showCta={false}>
      <PageHero title="Privacy Policy" />
      <section className="section-padding-sm">
        <Container className="max-w-3xl prose prose-stone">
          <p className="text-stone-600 leading-relaxed">Muntajar respects your privacy. We collect only the information necessary to provide global mobility guidance — including contact details, academic records, and documents you upload to our platform. We never sell your data to third parties or brokers.</p>
          <p className="text-stone-600 leading-relaxed mt-4">Documents are stored securely and accessed only by your assigned advisor and compliance team. You may request deletion of your data at any time by contacting info@muntajar.com.</p>
        </Container>
      </section>
    </PageLayout>
  );
}
