"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, PhoneCall, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/context/lang-context";

export function Navbar({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { lang, setLang } = useLang();
  const pathname = usePathname();

  // Close mobile drawer on route change
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock background scroll when mobile navbar is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinkClass =
    "text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-950 transition-colors py-2 cursor-pointer";

  const isBn = lang === "bn";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/60 shadow-xs",
          className
        )}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* Logo + Investor Badge */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center shrink-0 select-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://i.imgur.com/2JK9HQv.png"
                  alt="Muntajar"
                  className="h-6 sm:h-7 w-auto object-contain"
                />
              </Link>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300/60 text-[10px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-600" />
                {isBn ? "ইনভেস্টর পোর্টাল" : "Investor Relations"}
              </span>
            </div>

            {/* Exactly 3 Navigation Links: Home, Profile, Gallery */}
            <div className="hidden lg:flex items-center gap-10">
              <Link href="/" className={cn(navLinkClass, pathname === "/" && "text-stone-950 font-black")}>
                {isBn ? "হোম" : "Home"}
              </Link>
              <Link href="/profile" className={cn(navLinkClass, pathname === "/profile" && "text-stone-950 font-black")}>
                {isBn ? "প্রোফাইল" : "Profile"}
              </Link>
              <Link href="/gallery" className={cn(navLinkClass, pathname === "/gallery" && "text-stone-950 font-black")}>
                {isBn ? "গ্যালারি" : "Gallery"}
              </Link>
            </div>

            {/* Right Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Language Switcher Toggle */}
              <div className="inline-flex items-center gap-0.5 p-1 rounded-2xl bg-stone-100 border border-stone-200/80 shadow-2xs mr-1">
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer select-none",
                    lang === "en" ? "bg-stone-950 text-white shadow-2xs" : "text-stone-600 hover:text-stone-950"
                  )}
                >
                  <svg className="w-3.5 h-3.5 rounded-full shrink-0 border border-stone-200" viewBox="0 0 640 480">
                    <path fill="#012169" d="M0 0h640v480H0z"/>
                    <path fill="#FFF" d="m0 0 640 480M640 0 0 480" stroke="#FFF" strokeWidth="60"/>
                    <path stroke="#C8102E" strokeWidth="40" d="m0 0 640 480M640 0 0 480"/>
                    <path fill="#FFF" d="M280 0h80v480h-80zM0 200h640v80H0z"/>
                    <path fill="#C8102E" d="M300 0h40v480h-40zM0 220h640v40H0z"/>
                  </svg>
                  <span>EN</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLang("bn")}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer select-none",
                    lang === "bn" ? "bg-stone-950 text-white font-solaimanlipi shadow-2xs" : "text-stone-600 hover:text-stone-950 font-solaimanlipi"
                  )}
                >
                  <svg className="w-3.5 h-3.5 rounded-full shrink-0 border border-stone-200" viewBox="0 0 640 480">
                    <rect width="640" height="480" fill="#006a4e" />
                    <circle cx="280" cy="240" r="160" fill="#f42a41" />
                  </svg>
                  <span>বাংলা</span>
                </button>
              </div>

              <a
                href="#book-call"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-800 hover:text-stone-950 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-2xl transition-all cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-stone-600" />
                <span>{isBn ? "ফাউন্ডার কল" : "Book Call"}</span>
              </a>

              <a
                href="#tiers"
                className="text-xs font-extrabold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 px-5 py-2.5 rounded-2xl transition-all shadow-sm cursor-pointer"
              >
                {isBn ? "ইনভেস্ট করুন" : "Join Community"}
              </a>
            </div>

            {/* Mobile Header Controls */}
            <div className="flex lg:hidden items-center gap-2">
              <div className="inline-flex items-center gap-0.5 p-1 rounded-full bg-stone-100 border border-stone-200/80">
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer",
                    lang === "en" ? "bg-stone-950 text-white" : "text-stone-600"
                  )}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLang("bn")}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer font-solaimanlipi",
                    lang === "bn" ? "bg-stone-950 text-white" : "text-stone-600"
                  )}
                >
                  বাংলা
                </button>
              </div>

              <button
                type="button"
                className="p-2 text-stone-900 rounded-full hover:bg-stone-100 transition-colors cursor-pointer select-none"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? <X className="w-6 h-6 text-stone-900" /> : <Menu className="w-6 h-6 text-stone-900" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-[999] bg-white flex flex-col justify-between overflow-y-auto px-6 py-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between h-14 border-b border-stone-200/80 pb-3">
            <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://i.imgur.com/2JK9HQv.png"
                  alt="Muntajar"
                  className="h-6 w-auto object-contain"
                />
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 text-stone-900 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-stone-900" />
            </button>
          </div>

          <div className="py-6 space-y-3 flex-1">
            <Link
              href="/"
              className="block py-2.5 px-4 rounded-xl text-base font-bold text-stone-900 hover:bg-stone-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {isBn ? "হোম" : "Home"}
            </Link>

            <Link
              href="/profile"
              className="block py-2.5 px-4 rounded-xl text-base font-bold text-stone-900 hover:bg-stone-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {isBn ? "প্রোফাইল" : "Profile"}
            </Link>

            <Link
              href="/gallery"
              className="block py-2.5 px-4 rounded-xl text-base font-bold text-stone-900 hover:bg-stone-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {isBn ? "গ্যালারি" : "Gallery"}
            </Link>
          </div>

          <div className="pt-4 border-t border-stone-200/80 space-y-3 shrink-0">
            <a
              href="#tiers"
              className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-extrabold bg-amber-400 text-stone-950 rounded-full shadow-md cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <span>{isBn ? "ইনভেস্ট করুন" : "Join Investor Community"}</span>
            </a>

            <a
              href="#book-call"
              className="w-full block text-center py-3 text-sm font-bold bg-stone-100 text-stone-900 rounded-full hover:bg-stone-200 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {isBn ? "ফাউন্ডার কল সিডিউল করুন" : "Book Founder Call"}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
