"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { PageLayout } from "@/components/layout/page-layout";
import { ImageIcon, Sparkles, ArrowRight, Compass, ShieldCheck } from "lucide-react";
import { useLang } from "@/context/lang-context";

const GALLERY_ITEMS = [
  {
    title: "Muntajar AI Document Engine Lab",
    category: "Technology",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    desc: "Engineers deploying direct university API integrations and automated eligibility verification pipelines.",
  },
  {
    title: "Global Mobility Leadership Summit 2026",
    category: "Leadership",
    url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    desc: "Keynote presentation with international education delegates and licensed employment agency directors.",
  },
  {
    title: "Investor Community Partner Meetup",
    category: "Investor Relations",
    url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
    desc: "Quarterly dividend distribution briefing and asset protection certificate handover for partner investors.",
  },
  {
    title: "Global University Partner Audit",
    category: "Operations",
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    desc: "On-site verification of admissions workflows with UK & North American institution representatives.",
  },
  {
    title: "Workforce Placement Verification Center",
    category: "Compliance",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    desc: "Ensuring 100% zero candidate broker fee compliance under ILO Fair Recruitment guidelines.",
  },
  {
    title: "Muntajar Founder & Advisory Board Session",
    category: "Governance",
    url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80",
    desc: "Strategic planning for scaling platform reach across 150+ global partner institutions.",
  },
];

export default function GalleryPage() {
  const { lang } = useLang();
  const isBn = lang === "bn";
  const [activeCategory, setActiveCategory] = React.useState("All");

  const categories = ["All", "Technology", "Leadership", "Investor Relations", "Operations", "Compliance"];

  const filteredItems = activeCategory === "All" 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  return (
    <PageLayout showCta={false}>
      <div className="bg-[#FAF9F7] min-h-screen pt-24 pb-32">
        {/* Header Breadcrumb Banner */}
        <section className="bg-stone-900 text-white py-16 md:py-24 border-b border-stone-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-400 mb-6 uppercase tracking-wider">
              <Link href="/" className="hover:text-amber-400 transition-colors">
                {isBn ? "হোম" : "Home"}
              </Link>
              <span>/</span>
              <span className="text-amber-400">{isBn ? "মিডিয়া গ্যালারি" : "Media Gallery"}</span>
            </div>

            <div className="max-w-3xl space-y-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold uppercase tracking-widest">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                {isBn ? "মিডিয়া ও ফটো গ্যালারি" : "Media & Operations Showcase"}
              </span>
              <h1 className="font-sans font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
                {isBn
                  ? "মুনতাজারের সাম্প্রতিক ইভেন্ট ও কার্যক্রম গ্যালারি"
                  : "Inside Muntajar Operations & Leadership Events"}
              </h1>
              <p className="text-stone-300 text-base sm:text-lg leading-relaxed font-normal">
                {isBn
                  ? "আমাদের প্ল্যাটফর্ম ডেভলপমেন্ট, ইনভেস্টর সামিট, বিশ্ববিদ্যালয় পার্টনারশিপ এবং কমপ্লায়েন্স ট্র্যাকিংয়ের বাস্তব চিত্র।"
                  : "Highlights from our technology labs, international leadership summits, university audit sessions, and investor partner meetups."}
              </p>
            </div>
          </div>
        </section>

        {/* Gallery Content Area */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16 space-y-12">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer select-none ${
                  activeCategory === cat
                    ? "bg-stone-950 text-white shadow-md"
                    : "bg-white text-stone-600 hover:text-stone-950 border border-stone-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery Media Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((img) => (
              <div
                key={img.title}
                className="group relative rounded-3xl overflow-hidden bg-stone-950 border border-stone-200/80 shadow-md h-80 flex flex-col justify-end"
              >
                <Image
                  src={img.url}
                  alt={img.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent p-6 flex flex-col justify-end">
                  <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">
                    {img.category}
                  </span>
                  <h3 className="text-lg font-extrabold text-white mt-1 group-hover:text-amber-300 transition-colors">
                    {img.title}
                  </h3>
                  <p className="text-xs text-stone-300 mt-2 line-clamp-2 leading-relaxed opacity-90">
                    {img.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA Banner */}
          <div className="mt-16 bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 rounded-3xl p-8 sm:p-12 text-white border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-extrabold">
                {isBn ? "মুনতাজারের সাথে ইনভেস্ট করতে আগ্রহী?" : "Ready to Join Muntajar Investor Community?"}
              </h3>
              <p className="text-stone-400 text-sm">
                {isBn
                  ? "মাত্র ২০,০০০ টাকা থেকে ইনভেস্টর পার্টনার হিসেবে যোগ দিন।"
                  : "Secure your investor ticket starting at ৳20,000 BDT and receive lifetime free platform perks."}
              </p>
            </div>
            <Link
              href="/#tiers"
              className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all shrink-0 shadow-lg"
            >
              {isBn ? "ইনভেস্টমেন্ট টিয়ার দেখুন" : "View Investment Tiers"}
            </Link>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
