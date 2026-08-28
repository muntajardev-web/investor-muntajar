"use client";

import React, { useRef } from "react";
import { Download, Printer, ShieldCheck, CheckCircle2, Building2, FileText, QrCode } from "lucide-react";

interface InvestorInvoiceProps {
  invoiceNo?: string;
  transactionId?: string;
  investorName?: string;
  investorEmail?: string;
  investorPhone?: string;
  tickets?: number;
  amount?: number;
  date?: string;
  currency?: string;
  onClose?: () => void;
}

export function InvestorInvoice({
  invoiceNo = "MJR-INV-2026-8842",
  transactionId = "SSL-TXN-994182903",
  investorName = "Valued Angel Partner",
  investorEmail = "investor@example.com",
  investorPhone = "+880 1712-345678",
  tickets = 1,
  amount = 20000,
  date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  currency = "৳",
  onClose,
}: InvestorInvoiceProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const unitPrice = amount / (tickets || 1);

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xl p-6 sm:p-10 max-w-3xl mx-auto text-left font-sans text-stone-900 space-y-8 print:p-0 print:border-none print:shadow-none">
      
      {/* Top Action Bar (Hidden during print) */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-5 print:hidden">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Paid &amp; Registered Official Deed
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer select-none"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Invoice Printable Sheet */}
      <div ref={printRef} className="space-y-8">
        
        {/* Header: Company Info + Invoice Details */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b border-stone-200">
          <div className="space-y-2">
            {/* Real Logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://i.imgur.com/2JK9HQv.png"
              alt="Muntajar Global Ltd."
              className="h-9 w-auto object-contain"
            />
            <p className="text-xs font-bold text-stone-700">Muntajar Global Limited</p>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Trade License: TRAD/DSCC/083932/2025<br />
              332/A, Khilgaon, Tilpapara, Dhaka-1219, Bangladesh<br />
              Email: investors@muntajar.com · Web: muntajar.com
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1 sm:space-y-1.5">
            <span className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight block">
              OFFICIAL INVOICE
            </span>
            <p className="text-xs font-mono font-bold text-[#EA580C]">
              Invoice No: {invoiceNo}
            </p>
            <p className="text-xs text-stone-500 font-medium">
              Date: {date}
            </p>
            <p className="text-[11px] font-mono text-stone-500">
              Txn ID: {transactionId}
            </p>
          </div>
        </div>

        {/* Bill To & Compliance Notice */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#FAF9F7] p-5 rounded-2xl border border-stone-200/80">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 mb-1">
              INVESTOR PARTICULARS (BILL TO)
            </p>
            <h4 className="text-base font-bold text-stone-900">{investorName}</h4>
            <p className="text-xs text-stone-600 mt-0.5">{investorEmail}</p>
            <p className="text-xs text-stone-600">{investorPhone}</p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 mb-1">
              STATUTORY COMPLIANCE
            </p>
            <p className="text-xs font-bold text-stone-900">
              Registered Under Bangladesh Companies Act 1994
            </p>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Issued against Angel Equity Seed Allotment Deed. Certified quarterly dividends and audited reports guaranteed.
            </p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-hidden rounded-2xl border border-stone-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-100/80 text-stone-700 font-bold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Item Description</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-right">Total (BDT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr>
                <td className="py-4 px-4">
                  <span className="font-bold text-stone-900 block text-sm">
                    Muntajar Angel Equity Investment Seed Ticket
                  </span>
                  <span className="text-xs text-stone-500 mt-0.5 block leading-relaxed">
                    Includes Legal Share Deed Allotment, Lifetime 100% Free Platform Access, and Quarterly Dividend Rights.
                  </span>
                </td>
                <td className="py-4 px-4 text-center font-bold text-stone-900">
                  {tickets}
                </td>
                <td className="py-4 px-4 text-right font-medium text-stone-700">
                  {currency}{unitPrice.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right font-bold text-stone-950">
                  {currency}{amount.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals & Stamped Seal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
          
          {/* Official Seal & Legal Clause */}
          <div className="flex items-center gap-3 text-stone-600 max-w-sm">
            <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-stone-300 flex flex-col items-center justify-center text-center p-1 shrink-0 bg-stone-50">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="text-[7px] font-mono font-bold text-stone-600 mt-0.5 uppercase">VERIFIED DEED</span>
            </div>
            <p className="text-[10px] leading-relaxed text-stone-500">
              This invoice serves as an official proof of investment deposit and legal deed allocation in Muntajar Global Ltd.
            </p>
          </div>

          {/* Totals Box */}
          <div className="w-full sm:w-64 space-y-2 bg-[#FAF9F7] p-4 rounded-2xl border border-stone-200/80">
            <div className="flex justify-between text-xs text-stone-600">
              <span>Subtotal:</span>
              <span className="font-medium">{currency}{amount.toLocaleString()} BDT</span>
            </div>
            <div className="flex justify-between text-xs text-stone-600">
              <span>VAT / Tax (0% Exempt Seed):</span>
              <span className="font-medium">{currency}0 BDT</span>
            </div>
            <div className="border-t border-stone-200 pt-2 flex justify-between text-sm sm:text-base font-extrabold text-stone-950">
              <span>Total Paid:</span>
              <span className="text-[#EA580C]">{currency}{amount.toLocaleString()} BDT</span>
            </div>
          </div>
        </div>

        {/* Footer Signoff */}
        <div className="border-t border-stone-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 Muntajar Global Limited. All Rights Reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-stone-700">SSLCommerz 256-Bit Authorized Transaction</span>
          </div>
        </div>

      </div>

    </div>
  );
}
