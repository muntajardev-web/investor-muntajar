"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { XCircle, RefreshCw, ArrowLeft, PhoneCall } from "lucide-react";

export function PaymentFailContent() {
  const searchParams = useSearchParams();
  const reason = searchParams?.get("reason") || "unknown_error";

  const reasonMap: Record<string, string> = {
    cancelled: "You cancelled the payment. No amount was deducted.",
    processing_error: "A processing error occurred. Your payment was not completed.",
    unknown_error: "An unexpected error occurred. Your payment was not completed.",
  };

  const message = reasonMap[reason] || "Your payment could not be processed.";

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg bg-white border border-stone-200 rounded-3xl shadow-xl p-8 sm:p-12 text-center space-y-6"
      >
        {/* Icon */}
        <div className="flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight">
            Payment Unsuccessful
          </h1>
          <p className="text-stone-500 text-sm leading-relaxed font-medium">{message}</p>
        </div>

        {/* Info box */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left space-y-1">
          <p className="text-xs font-black text-amber-800 uppercase tracking-wider">
            No charges applied
          </p>
          <p className="text-xs text-amber-700 leading-relaxed">
            Your bank account or card has not been charged. You can safely try again or contact us
            for assistance.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/#tiers"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Link>
          <a
            href="https://wa.me/8801XXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-900 text-xs font-black uppercase tracking-wider transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            Contact Us
          </a>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 font-bold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Investor Page
        </Link>
      </motion.div>
    </div>
  );
}
