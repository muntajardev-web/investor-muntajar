import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Privacy Policy | Muntajar Global Ltd.",
  description: "Muntajar Global Ltd.'s Privacy Policy covering data collection, payment security, cookies, and your rights.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-black text-stone-900 border-l-4 border-orange-500 pl-4">{title}</h2>
      <div className="text-stone-600 leading-relaxed space-y-2 text-sm">{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <PageLayout showCta={false}>
      <PageHero title="Privacy Policy" />
      <section className="py-16">
        <Container className="max-w-3xl space-y-10">

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-900">
            <strong>Effective Date:</strong> 1 January 2025 &nbsp;|&nbsp;
            <strong>Company:</strong> Muntajar Global Ltd. &nbsp;|&nbsp;
            <strong>Trade License:</strong> TRAD/DSCC/003932/2025
          </div>

          <Section title="1. Introduction">
            <p>Muntajar Global Ltd. ("Muntajar", "we", "us") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect your data when you use our platform at investor.muntajar.com or muntajar.com.</p>
          </Section>

          <Section title="2. Information We Collect">
            <p>We collect the following categories of information:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Identity data:</strong> Full name, national ID, passport details</li>
              <li><strong>Contact data:</strong> Email address, phone number, mailing address</li>
              <li><strong>Financial data:</strong> Payment transaction records (processed through SSLCommerz — we do not store card numbers)</li>
              <li><strong>Usage data:</strong> Pages visited, browser type, IP address, session duration</li>
              <li><strong>Document data:</strong> Academic transcripts, work experience documents uploaded for advisory services</li>
            </ul>
          </Section>

          <Section title="3. Payment Security">
            <p>All payment transactions are processed through <strong>SSLCommerz</strong>, a licensed and PCI-DSS compliant payment gateway in Bangladesh. Muntajar does <strong>not</strong> store, process, or transmit your credit/debit card details on our servers. All payment data is encrypted using 256-bit SSL (TLS 1.2+) technology.</p>
            <p>SSLCommerz's privacy and security policy can be viewed at <a href="https://www.sslcommerz.com/privacy-policy/" target="_blank" rel="noreferrer" className="text-orange-600 font-bold hover:underline">sslcommerz.com/privacy-policy</a>.</p>
          </Section>

          <Section title="4. How We Use Your Information">
            <ul className="list-disc pl-5 space-y-1">
              <li>To process investment payments and issue equity/partner certificates</li>
              <li>To deliver advisory services and platform access</li>
              <li>To send payment receipts and investment confirmation emails</li>
              <li>To comply with legal obligations under Bangladesh law</li>
              <li>To improve our platform and user experience</li>
            </ul>
          </Section>

          <Section title="5. Cookies Policy">
            <p>Muntajar uses cookies to enhance your experience:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Essential cookies:</strong> Required for login sessions and security (cannot be disabled)</li>
              <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our platform (can be opted out)</li>
              <li><strong>Preference cookies:</strong> Remember your language and display settings</li>
            </ul>
            <p>You can manage cookie preferences through your browser settings at any time. Disabling cookies may affect platform functionality.</p>
          </Section>

          <Section title="6. Data Sharing">
            <p>We do <strong>not</strong> sell, rent, or trade your personal data to third parties. Data may be shared with:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>SSLCommerz (payment processing only)</li>
              <li>Partner universities or employers (only with your explicit consent)</li>
              <li>Government authorities (when legally required)</li>
            </ul>
          </Section>

          <Section title="7. Data Retention">
            <p>We retain personal data for as long as necessary to fulfil the purposes described above, and in accordance with applicable Bangladesh laws. Financial records are retained for a minimum of 5 years. You may request deletion of non-legally-required data at any time.</p>
          </Section>

          <Section title="8. Your Rights">
            <p>You have the right to: access your data, correct inaccurate data, request deletion, withdraw consent, and lodge a complaint. Contact us at <a href="mailto:investors@muntajar.com" className="text-orange-600 font-bold hover:underline">investors@muntajar.com</a>.</p>
          </Section>

          <Section title="9. Contact">
            <p>
              Muntajar Global Ltd.<br />
              332/A, Khilgaon, Tilpapara, Khilgaon, Dhaka-1219, Bangladesh<br />
              Email: <a href="mailto:investors@muntajar.com" className="text-orange-600 font-bold hover:underline">investors@muntajar.com</a><br />
              Phone: <a href="tel:+8801712345678" className="text-orange-600 font-bold hover:underline">+880 1712-345678</a>
            </p>
          </Section>

        </Container>
      </section>
    </PageLayout>
  );
}
