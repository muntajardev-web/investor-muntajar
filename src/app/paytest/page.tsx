import type { Metadata } from "next";
import { PayTestContent } from "@/components/investors/paytest-content";

export const metadata: Metadata = {
  title: "Payment Gateway Test | Muntajar",
  description: "Internal test page for SSLCommerz payment integration.",
  robots: { index: false, follow: false }, // don't index this test page
};

export default function PayTestPage() {
  return <PayTestContent />;
}
