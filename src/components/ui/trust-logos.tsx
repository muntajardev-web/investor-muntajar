"use client";

import React from "react";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";

export function TrustLogosCard({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-200/70 p-5 space-y-4 text-left ${className}`}>
      
      {/* Top Security Perks Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
        <div className="flex items-center gap-1.5 text-stone-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="text-[11px] font-bold">RJSC Registered</span>
        </div>
        <div className="flex items-center gap-1.5 text-stone-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="text-[11px] font-bold">Bank Escrow Protected</span>
        </div>
        <div className="flex items-center gap-1.5 text-stone-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="text-[11px] font-bold">Transferable Equity</span>
        </div>
      </div>

      {/* Uniform Logos Alignment */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center justify-between opacity-80 hover:opacity-100 transition-opacity">
        
        {/* 1. AWS Cloud */}
        <div className="flex items-center justify-start h-6">
          <img
            src="/images/aws.svg"
            alt="AWS"
            className="h-5 w-auto object-contain select-none grayscale hover:grayscale-0 transition-all"
          />
        </div>

        {/* 2. Stripe */}
        <div className="flex items-center justify-start h-6">
          <img
            src="/images/stripe.svg"
            alt="Stripe"
            className="h-4.5 w-auto object-contain select-none grayscale hover:grayscale-0 transition-all"
          />
        </div>

        {/* 3. VFS GLOBAL */}
        <div className="flex items-center justify-start gap-1.5 h-6">
          <div className="w-4.5 h-4.5 rounded-full border border-stone-700 flex items-center justify-center font-serif text-[7.5px] font-bold text-stone-800 shrink-0 select-none">
            vfs.
          </div>
          <span className="font-sans font-black text-[11px] tracking-tight text-stone-800 select-none">
            VFS.GLOBAL
          </span>
        </div>

        {/* 4. BSEC */}
        <div className="flex flex-col justify-center text-left h-6 select-none">
          <span className="font-sans font-black text-[11px] tracking-wide text-stone-900 leading-none">
            BSEC
          </span>
          <span className="text-[7.5px] font-semibold text-stone-400 leading-tight mt-0.5 whitespace-nowrap">
            Securities &amp; Exchange Comm.
          </span>
        </div>

      </div>
    </div>
  );
}
