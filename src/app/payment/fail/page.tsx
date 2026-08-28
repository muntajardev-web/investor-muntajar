import { Suspense } from "react";
import type { Metadata } from "next";
import { PaymentFailContent } from "@/components/investors/payment-fail-content";

export const metadata: Metadata = {
  title: "Payment Failed | Muntajar Investor Portal",
  description: "Your payment could not be processed. Please try again.",
};

export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentFailContent />
    </Suspense>
  );
}
