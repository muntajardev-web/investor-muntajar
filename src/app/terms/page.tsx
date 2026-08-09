import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <PageLayout showCta={false}>
      <PageHero title="Terms of Service" />
      <section className="section-padding-sm">
        <Container className="max-w-3xl">
          <p className="text-stone-600 leading-relaxed">By using Muntajar&apos;s platform and services, you agree to our transparent fee structure, honest communication standards, and document verification processes. Muntajar provides guidance and platform access — visa and admission outcomes depend on embassy, university, and employer decisions.</p>
          <p className="text-stone-600 leading-relaxed mt-4">All fees are disclosed before payment. Refund policies are explained at the time of enrollment for each service track.</p>
        </Container>
      </section>
    </PageLayout>
  );
}
