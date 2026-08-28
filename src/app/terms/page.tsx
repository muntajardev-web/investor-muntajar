import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Terms & Conditions | Muntajar Global Ltd.",
  description: "Read Muntajar Global Ltd.'s full Terms and Conditions covering investor agreements, platform usage, payment, refund, and liability.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-black text-stone-900 border-l-4 border-orange-500 pl-4">{title}</h2>
      <div className="text-stone-600 leading-relaxed space-y-2 text-sm">{children}</div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <PageLayout showCta={false}>
      <PageHero title="Terms & Conditions" />
      <section className="py-16">
        <Container className="max-w-3xl space-y-10">

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-900">
            <strong>Effective Date:</strong> 1 January 2025 &nbsp;|&nbsp;
            <strong>Company:</strong> Muntajar Global Ltd. &nbsp;|&nbsp;
            <strong>Trade License:</strong> TRAD/DSCC/003932/2025 &nbsp;|&nbsp;
            <strong>Address:</strong> 332/A, Khilgaon, Tilpapara, Khilgaon, Dhaka-1219, Bangladesh
          </div>

          <Section title="1. Acceptance of Terms">
            <p>By accessing or using the Muntajar platform (investor.muntajar.com or muntajar.com), you confirm that you have read, understood, and agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree, you must discontinue use immediately.</p>
          </Section>

          <Section title="2. About Muntajar">
            <p>Muntajar Global Ltd. is a registered company in Bangladesh (Trade License No. TRAD/DSCC/003932/2025) operating as a broker-free digital platform for global education, workforce placement, and migration services. Our registered office is at 332/A, Khilgaon, Tilpapara, Khilgaon, Dhaka-1219.</p>
          </Section>

          <Section title="3. Investment & Payment">
            <p>All investment transactions are processed securely through SSLCommerz, a licensed payment gateway provider in Bangladesh. Payments are made in Bangladeshi Taka (BDT). All fees and amounts are clearly disclosed before payment is confirmed.</p>
            <p>Angel Investor Tickets (minimum ৳20,000 per ticket) represent equity participation in Muntajar Global Ltd. as outlined in the partner deed agreement provided post-payment.</p>
          </Section>

          <Section title="4. Return & Refund">
            <p>Please review our <a href="/refund" className="text-orange-600 font-bold hover:underline">Return & Refund Policy</a> for full details. In general, refunds are processed within <strong>7 to 10 working days</strong> after a verified refund request is approved.</p>
          </Section>

          <Section title="5. Delivery of Services">
            <p><strong>Inside Dhaka:</strong> Physical documents and certificates are delivered within 5 working days of payment confirmation.</p>
            <p><strong>Outside Dhaka:</strong> Delivery takes up to 10 working days. Digital certificates and partner deeds are issued electronically within 48 hours.</p>
          </Section>

          <Section title="6. Platform Usage">
            <p>You agree not to misuse the platform, attempt unauthorized access, transmit harmful content, or use the platform for any unlawful purpose. Muntajar reserves the right to suspend or terminate accounts that violate these terms.</p>
          </Section>

          <Section title="7. Intellectual Property">
            <p>All content on the Muntajar platform — including text, graphics, logos, and software — is the property of Muntajar Global Ltd. and protected under applicable intellectual property laws. No content may be reproduced without written permission.</p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>Muntajar provides guidance and platform access. Visa, admission, and employment outcomes are subject to the decisions of embassies, universities, and employers respectively. Muntajar is not liable for third-party decisions beyond our control.</p>
          </Section>

          <Section title="9. Governing Law">
            <p>These Terms are governed by the laws of the People's Republic of Bangladesh. Any disputes shall be settled in the courts of Dhaka, Bangladesh.</p>
          </Section>

          <Section title="10. Contact">
            <p>For any queries regarding these Terms, contact us at <a href="mailto:investors@muntajar.com" className="text-orange-600 font-bold hover:underline">investors@muntajar.com</a> or call <a href="tel:+8801712345678" className="text-orange-600 font-bold hover:underline">+880 1712-345678</a>.</p>
          </Section>

        </Container>
      </section>
    </PageLayout>
  );
}
