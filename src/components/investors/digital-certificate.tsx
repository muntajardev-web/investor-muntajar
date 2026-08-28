"use client";

import React, { useRef } from "react";
import { ShieldCheck, Award, Download, Printer, CheckCircle2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DigitalCertificateProps {
  investorName?: string;
  tickets?: number;
  totalAmount?: number;
  amount?: number;
  investorId?: string;
  serialNumber?: string;
  certificateId?: string;
  issueDate?: string;
}

export function DigitalCertificate({
  investorName = "Valued Angel Partner",
  tickets = 1,
  totalAmount,
  amount,
  investorId = "MJR-INV-8842",
  serialNumber,
  certificateId,
  issueDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
}: DigitalCertificateProps) {
  const finalAmount = totalAmount ?? amount ?? 20000;
  const finalCertId = certificateId ?? serialNumber ?? "CERT-2026-9910-MJR";
  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-stone-900 text-white rounded-2xl print:hidden">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-bold">Official Investor Share Deed Certificate</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePrint}
            size="sm"
            className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs uppercase tracking-wider"
          >
            <Printer className="w-4 h-4 mr-1.5" />
            Print / Save PDF
          </Button>
        </div>
      </div>

      {/* Printable Certificate Box */}
      <div
        ref={certRef}
        id="digital-certificate-print"
        className="relative bg-amber-50/40 border-8 border-double border-amber-800/60 p-8 sm:p-12 rounded-3xl shadow-xl overflow-hidden print:border-amber-900 print:shadow-none print:bg-white"
      >
        {/* Background Watermark Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
          <Building2 className="w-[500px] h-[500px] text-amber-950" />
        </div>

        {/* Outer Frame Lines */}
        <div className="border border-amber-900/30 p-6 sm:p-10 rounded-2xl relative z-10 bg-white/80 backdrop-blur-xs">
          {/* Header */}
          <div className="text-center space-y-3 pb-6 border-b-2 border-amber-800/20">
            <div className="inline-flex items-center justify-center gap-2 px-3 py-1 bg-amber-100/80 border border-amber-300 rounded-full text-amber-900 text-xs font-black uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              Muntajar Global Equity Deed
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-black text-stone-950 tracking-tight">
              CERTIFICATE OF ANGEL INVESTMENT
            </h1>
            <p className="text-xs sm:text-sm font-sans font-semibold text-stone-600 tracking-wide uppercase">
              Registered Under Companies Act 1994 • Muntajar International Platform
            </p>
          </div>

          {/* Certificate Body */}
          <div className="py-8 text-center space-y-6">
            <p className="text-xs sm:text-sm text-stone-600 font-sans italic">
              This official deed hereby certifies that
            </p>

            <div className="py-2 border-b-2 border-amber-700/30 inline-block min-w-[280px] sm:min-w-[400px]">
              <span className="text-xl sm:text-3xl font-serif font-black text-stone-900 uppercase tracking-wide">
                {investorName}
              </span>
            </div>

            <p className="text-xs sm:text-base text-stone-700 font-sans max-w-xl mx-auto leading-relaxed">
              is recognized as an official <strong className="text-amber-900 font-bold">Angel Partner & Shareholder</strong> in Muntajar Platform, having successfully committed equity capital of
            </p>

            {/* Financial Details Box */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto bg-amber-100/40 p-4 rounded-xl border border-amber-300/60 text-stone-900">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-amber-900/70 uppercase tracking-wider block">
                  Capital Invested
                </span>
                <span className="text-base sm:text-xl font-black font-mono text-stone-950">
                  ৳{finalAmount.toLocaleString()} BDT
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-amber-900/70 uppercase tracking-wider block">
                  Angel Tickets
                </span>
                <span className="text-base sm:text-xl font-black font-mono text-amber-700">
                  {tickets} {tickets > 1 ? "Tickets" : "Ticket"}
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 space-y-0.5">
                <span className="text-[10px] font-bold text-amber-900/70 uppercase tracking-wider block">
                  Platform Privileges
                </span>
                <span className="text-xs font-extrabold text-emerald-700 block">
                  Lifetime Free
                </span>
              </div>
            </div>

            <p className="text-[11px] sm:text-xs text-stone-500 max-w-lg mx-auto leading-relaxed">
              This certificate entitles the holder to quarterly dividend distributions, founding partner network rights, lifetime free platform utility access, and company equity governance notices.
            </p>
          </div>

          {/* Footer Seals & Signatures */}
          <div className="pt-6 border-t-2 border-amber-800/20 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-stone-800">
            {/* Left Metadata */}
            <div className="space-y-1 text-left text-[11px] font-mono">
              <div><strong className="text-stone-900">Certificate ID:</strong> {finalCertId}</div>
              <div><strong className="text-stone-900">Investor ID:</strong> {investorId}</div>
              <div><strong className="text-stone-900">Issue Date:</strong> {issueDate}</div>
            </div>

            {/* Center Official Gold Badge / Seal */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 border-4 border-white shadow-lg flex items-center justify-center text-amber-950 font-serif font-black text-xs text-center p-2 uppercase leading-tight">
                Official Seal
              </div>
              <span className="text-[9px] font-bold text-amber-900 uppercase tracking-wider">
                Muntajar Equity Registry
              </span>
            </div>

            {/* Right Signature */}
            <div className="text-right space-y-1">
              <div className="font-serif italic text-lg sm:text-xl text-stone-900 font-bold border-b border-stone-400 pb-1 inline-block px-4">
                Tashin & Founders
              </div>
              <div className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                Managing Director & Founder
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
