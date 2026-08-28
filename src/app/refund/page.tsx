import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Return & Refund Policy | Muntajar Global Ltd.",
  description: "Muntajar Global Ltd.'s complete Return and Refund Policy with standard 7–10 working day processing timeline.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-black text-stone-900 border-l-4 border-orange-500 pl-4">{title}</h2>
      <div className="text-stone-600 leading-relaxed space-y-2 text-sm">{children}</div>
    </div>
  );
}

export default function RefundPage() {
  return (
    <PageLayout showCta={false}>
      <PageHero title="Return & Refund Policy" />
      <section className="py-16">
        <Container className="max-w-3xl space-y-10">

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-900">
            <strong>Effective Date:</strong> 1 January 2025 &nbsp;|&nbsp;
            <strong>Company:</strong> Muntajar Global Ltd. &nbsp;|&nbsp;
            <strong>Trade License:</strong> TRAD/DSCC/003932/2025
          </div>

          {/* Highlight box */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0 text-2xl">⏱</div>
            <div>
              <p className="text-emerald-900 font-black text-base">Standard Refund Timeline</p>
              <p className="text-emerald-800 text-sm mt-1 leading-relaxed">
                Approved refunds are processed and credited back to the original payment method within{" "}
                <strong>7 to 10 working days</strong> from the date of approval.
              </p>
            </div>
          </div>

          <Section title="1. Eligibility for Refund">
            <p>A refund request may be eligible under the following conditions:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Duplicate payment was made for the same transaction.</li>
              <li>Payment was processed but the service was not delivered within the committed timeframe.</li>
              <li>A technical error caused an incorrect amount to be charged.</li>
              <li>The investment ticket purchase is cancelled within 24 hours of payment, provided no equity documents have been issued.</li>
            </ul>
            <p>Refunds are <strong>not applicable</strong> once the official partner deed or equity certificate has been issued and signed.</p>
          </Section>

          <Section title="2. How to Request a Refund">
            <p>To initiate a refund, send an email to <a href="mailto:investors@muntajar.com" className="text-orange-600 font-bold hover:underline">investors@muntajar.com</a> with the subject line <em>"Refund Request — [Transaction ID]"</em> and include:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Full name and registered email address</li>
              <li>Transaction ID (e.g., MJR-INV-XXXXXXXX)</li>
              <li>SSLCommerz payment reference / Val ID</li>
              <li>Reason for refund request</li>
              <li>Bank account details for refund transfer (if applicable)</li>
            </ul>
          </Section>

          <Section title="3. Refund Processing Timeline">
            <p>Once a refund request is received and verified:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Review &amp; Approval:</strong> 1–2 working days</li>
              <li><strong>Bank / Gateway Processing:</strong> 5–8 working days</li>
              <li><strong>Total Timeline:</strong> <strong>7 to 10 working days</strong> from approval date</li>
            </ul>
            <p>Refunds are credited to the same payment method (card, mobile banking, or bank account) used during the original transaction.</p>
          </Section>

          <Section title="4. Delivery & Return of Physical Items">
            <p>For physical documents, certificates, or printed materials:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Inside Dhaka:</strong> Delivered within 5 working days</li>
              <li><strong>Outside Dhaka:</strong> Delivered within 10 working days</li>
            </ul>
            <p>If a physical document must be returned for replacement, the return courier cost is borne by Muntajar for verified defects.</p>
          </Section>

          <Section title="5. Non-Refundable Items">
            <ul className="list-disc pl-5 space-y-1">
              <li>Signed and issued equity/partner deed documents</li>
              <li>Platform subscription fees after 24 hours of activation</li>
              <li>Consultation or advisory fees for completed sessions</li>
            </ul>
          </Section>

          <Section title="6. Contact for Refund Queries">
            <p>
              Email: <a href="mailto:investors@muntajar.com" className="text-orange-600 font-bold hover:underline">investors@muntajar.com</a><br />
              Phone: <a href="tel:+8801712345678" className="text-orange-600 font-bold hover:underline">+880 1712-345678</a><br />
              Address: 332/A, Khilgaon, Tilpapara, Khilgaon, Dhaka-1219, Bangladesh
            </p>
          </Section>

        </Container>
      </section>
    </PageLayout>
  );
}
