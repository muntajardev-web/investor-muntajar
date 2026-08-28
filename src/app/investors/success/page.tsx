import { Suspense } from "react";
import { Metadata } from "next";
import { InvestorSuccessContent } from "@/components/investors/investor-success-content";

export const metadata: Metadata = {
  title: "Investor Confirmation & Welcome Portal | Muntajar",
  description: "Official post-investment portal and digital share deed registry for Muntajar Angel Partners.",
};

export default function InvestorSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] text-stone-900 font-sans">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Loading Investor Welcome Portal…
            </p>
          </div>
        </div>
      }
    >
      <InvestorSuccessContent />
    </Suspense>
  );
}
