"use client";

import React from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/layout/container";

const COMPANY = {
  name: "Muntajar Global Ltd.",
  tradeLicense: "TRAD/DSCC/083932/2025",
  address: "332/A, Khilgaon, Tilpapara, Khilgaon, Dhaka-1219, Bangladesh",
  email: "investors@muntajar.com",
  phone: "+880 1712-345678",
};

export function Footer() {
  return (
    <footer className="bg-[#FAF9F7] text-stone-600 border-t border-stone-200/80 pt-20 pb-14 font-sans">
      <Container>
        
        {/* ── Centered Brand & Header Section ── */}
        <div className="max-w-2xl mx-auto text-center space-y-5 pb-12 border-b border-stone-200/70">
          
          {/* Centered Brand Logo */}
          <Link href="/" className="inline-block select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://i.imgur.com/2JK9HQv.png"
              alt="Muntajar"
              className="h-10 w-auto object-contain mx-auto"
            />
          </Link>

          <p className="text-xs sm:text-sm font-bold text-[#EA580C]">
            Global mobility. Limitless opportunities.
          </p>

          <p className="text-xs sm:text-sm leading-relaxed text-stone-600 max-w-lg mx-auto font-normal">
            Bangladesh&apos;s first broker-free digital ecosystem for global education, workforce, and migration mobility. Connecting ambition with global opportunities.
          </p>

          {/* Social Links Centered */}
          <div className="flex items-center justify-center gap-2.5 pt-1">
            {[
              {
                icon: (props: React.SVGProps<SVGSVGElement>) => (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                ),
                href: "https://facebook.com/muntajarglobal",
              },
              {
                icon: (props: React.SVGProps<SVGSVGElement>) => (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                ),
                href: "https://linkedin.com/company/muntajar",
              },
              {
                icon: (props: React.SVGProps<SVGSVGElement>) => (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                ),
                href: "https://instagram.com/muntajar.global",
              },
              {
                icon: (props: React.SVGProps<SVGSVGElement>) => (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
                    <polygon points="10 15 15 12 10 9 10 15" />
                  </svg>
                ),
                href: "https://youtube.com/@muntajar",
              },
            ].map((social, idx) => {
              const Icon = social.icon;
              return (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full border border-stone-200 bg-white hover:bg-[#EA580C] hover:border-[#EA580C] hover:text-white flex items-center justify-center text-stone-500 transition-all cursor-pointer shadow-2xs"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>

        </div>

        {/* ── Centered Links Grid ── */}
        <div className="py-12 border-b border-stone-200/70">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto text-center sm:text-left">
            
            {/* Column 1: Platform */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-stone-950">
                Platform
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/#overview" className="hover:text-[#EA580C] transition-colors">Overview</Link></li>
                <li><Link href="/#pitch-deck" className="hover:text-[#EA580C] transition-colors">Pitch Deck</Link></li>
                <li><Link href="/#market" className="hover:text-[#EA580C] transition-colors">Market Size</Link></li>
                <li><Link href="/#tiers" className="hover:text-[#EA580C] transition-colors">Calculator</Link></li>
                <li><Link href="/investor-dashboard" className="hover:text-[#EA580C] transition-colors font-semibold text-[#EA580C]">Investor Portal ↗</Link></li>
              </ul>
            </div>

            {/* Column 2: Due Diligence */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-stone-950">
                Due Diligence
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/#how-it-works" className="hover:text-[#EA580C] transition-colors">How It Works</Link></li>
                <li><Link href="/#funds" className="hover:text-[#EA580C] transition-colors">Use of Funds</Link></li>
                <li><Link href="/#faq" className="hover:text-[#EA580C] transition-colors">24 Investor FAQs</Link></li>
                <li><Link href="/#team" className="hover:text-[#EA580C] transition-colors">Founding Team</Link></li>
              </ul>
            </div>

            {/* Column 3: Legal & Governance */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-stone-950">
                Legal &amp; Trust
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/privacy" className="hover:text-[#EA580C] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#EA580C] transition-colors">Terms of Service</Link></li>
                <li><Link href="/risk" className="hover:text-[#EA580C] transition-colors">Risk Disclosure</Link></li>
                <li><Link href="/disclaimer" className="hover:text-[#EA580C] transition-colors">Companies Act 1994</Link></li>
              </ul>
            </div>

            {/* Column 4: Investor Concierge */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-stone-950">
                Direct Contact
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href={`mailto:${COMPANY.email}`} className="hover:text-[#EA580C] transition-colors flex items-center justify-center sm:justify-start gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                    <span>{COMPANY.email}</span>
                  </a>
                </li>
                <li>
                  <a href={`tel:${COMPANY.phone}`} className="hover:text-[#EA580C] transition-colors flex items-center justify-center sm:justify-start gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                    <span>{COMPANY.phone}</span>
                  </a>
                </li>
                <li className="pt-1">
                  <a
                    href="https://chat.whatsapp.com/BuyZDTg3CSe89U1pnAbWgv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#EA580C] hover:bg-[#D94E06] text-white px-3 py-1.5 rounded-lg transition-all shadow-2xs"
                  >
                    <span>WhatsApp Concierge</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* ── Centered Payment & Escrow Partner Bar ── */}
        <div className="py-8 border-b border-stone-200/70 space-y-3 text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400">
            INSTITUTIONAL BANKING &amp; SECURE ESCROWS POWERED BY
          </p>

          <div className="flex justify-center items-center px-4">
            <div className="bg-white rounded-2xl p-3 border border-stone-200/80 shadow-2xs inline-flex items-center justify-center max-w-4xl w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/sslcommerz-banner.png"
                alt="Pay with VISA, Mastercard, AMEX, bKash, Nagad, Rocket, Upay, Bank Asia, Brac Bank, City Bank - Verified by SSLCOMMERZ"
                className="w-full h-auto object-contain select-none"
              />
            </div>
          </div>
        </div>

        {/* ── Centered Corporate Details & Copyright ── */}
        <div className="pt-8 text-center space-y-2 text-xs text-stone-500 font-normal">
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span className="font-bold text-stone-800">{COMPANY.name}</span>
            <span>•</span>
            <span>Trade License: <strong className="font-mono text-stone-800">{COMPANY.tradeLicense}</strong></span>
            <span>•</span>
            <span>{COMPANY.address}</span>
          </p>

          <p className="text-[11px] text-stone-400">
            &copy; {new Date().getFullYear()} {COMPANY.name} All rights reserved.
          </p>
        </div>

      </Container>
    </footer>
  );
}
