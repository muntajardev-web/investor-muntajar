import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { contact } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="bg-[#0D0C0A] text-stone-400 border-t border-stone-900">
      <Container className="pt-16 pb-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 pb-12 border-b border-stone-900">
          
          {/* Logo & Description */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <Image
              src="/images/logo.png"
              alt="Muntajar"
              width={160}
              height={40}
              className="h-8 w-auto mb-4 brightness-0 invert"
            />
            <span className="text-[9px] tracking-[0.16em] font-extrabold uppercase text-amber-500 mb-4">
              Muntajar Investor Relations — Equity & Growth Platform
            </span>
            <p className="text-xs leading-relaxed max-w-sm mb-5 text-stone-400">
              Bangladesh’s first broker-free digital platform for global education, workforce, and migration mobility. Partner with us to scale borderless opportunities.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-2.5 mt-2">
              {[
                { icon: (props: React.SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>), href: "https://facebook.com/muntajarglobal" },
                { icon: (props: React.SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>), href: "https://linkedin.com/company/muntajar" },
                { icon: (props: React.SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>), href: "https://instagram.com/muntajar.global" },
                { icon: (props: React.SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><polygon points="10 15 15 12 10 9 10 15"/></svg>), href: "https://youtube.com/@muntajar" },
              ].map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full border border-stone-800 bg-stone-900/50 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-500/50 transition-colors cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
                Investor Portal
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Overview", href: "#overview" },
                  { label: "Investor Perks", href: "#perks" },
                  { label: "Market Data & TAM", href: "#market" },
                  { label: "Investment Tiers", href: "#tiers" },
                  { label: "Pitch Deck & Financials", href: "#pitch-deck" },
                  { label: "FAQ (30 Questions)", href: "#faq" },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-[13px] font-normal text-stone-400 hover:text-amber-400 transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
                Legal & Governance
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Disclaimer", href: "/disclaimer" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[13px] font-normal text-stone-400 hover:text-amber-400 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
                Investor Relations
              </h4>
              <ul className="space-y-3.5 text-[13px]">
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-2.5 text-stone-400 hover:text-amber-400 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                    investors@muntajar.com
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${contact.phone}`}
                    className="inline-flex items-center gap-2.5 text-stone-400 hover:text-amber-400 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                    +880 1712-345678
                  </a>
                </li>
                <li className="flex items-start gap-2.5 text-stone-400">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>Dhaka, Bangladesh</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-medium text-stone-500">
          <p>&copy; {new Date().getFullYear()} Muntajar. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/disclaimer" className="hover:text-white transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>

      </Container>
    </footer>
  );
}
