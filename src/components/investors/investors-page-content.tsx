"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Gift,
  Share2,
  TrendingUp,
  Star,
  Zap,
  Users,
  Trophy,
  Handshake,
  Landmark,
  ShieldCheck,
  ChevronDown,
  Flame,
  Download,
  Calendar,
  Check,
  CheckCircle2,
  HelpCircle,
  X,
  Search,
  Sparkles,
  Globe,
  MessageCircle,
  FileText,
  PhoneCall,
  Building2,
  Award,
  Image as ImageIcon,
  Brain,
  User,
  TrendingDown,
  Target,
  Infinity,
  Tag,
  ArrowDownCircle,
  Play,
  Sun,
  UserCheck,
} from "lucide-react";
import { transition } from "@/lib/motion";
import { CalendlyWidget } from "@/components/ui/calendly-widget";
import { Logos3 } from "@/components/ui/logos3";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { HeroPlyrPlayer } from "@/components/ui/hero-plyr-player";
import { Navbar } from "@/components/navigation/navbar";
import { InteractivePricingCard } from "@/components/ui/pricing";
import { GlobePulse } from "@/components/ui/cobe-globe-pulse";
import { AnimatedActionButton } from "@/components/ui/animated-action-button";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { TrustLogosCard } from "@/components/ui/trust-logos";
import { StickyFeatureShowcase } from "@/components/ui/sticky-feature-showcase";
import { useLang } from "@/context/lang-context";

const INVESTOR_LOGOS = [
  { id: "1", description: "BSEC Bangladesh" },
  { id: "2", description: "UK Higher Education" },
  { id: "3", description: "DAAD Germany" },
  { id: "4", description: "IRCC Express Entry" },
  { id: "5", description: "USCIS United States" },
  { id: "6", description: "ILO Labor Organization" },
  { id: "7", description: "Stripe Global Payments" },
  { id: "8", description: "AWS Cloud Infrastructure" },
  { id: "9", description: "BMET Bangladesh" },
  { id: "10", description: "VFS Global" },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { ...transition.slow, delay },
});

/* ─── BILINGUAL PERKS DATA ──────────────────────────────────────── */
const PERKS_DATA = {
  bn: [
    {
      num: "01",
      icon: Star,
      color: "text-[#EA580C]",
      bg: "bg-[#FFF5ED]",
      border: "border-[#FDDBC9]",
      tagColor: "bg-[#FFF5ED] text-[#EA580C] border border-[#FDDBC9]/80",
      numColor: "text-[#EA580C] bg-[#FFF5ED]",
      title: "লাইফটাইম ফ্রি সাবস্ক্রিপশন",
      body: "মুনতাজারের প্রতিটি ইনভেস্টর এবং তাদের পরিবার উচ্চশিক্ষা, ক্যারিয়ার, এবং ভিসা গাইডেন্সের পূর্ণ প্ল্যাটফর্মে আমৃত্যু ১০০% বিনামূল্যে ফ্রি অ্যাক্সেস পাবেন।",
      tag: "Exclusive Access",
    },
    {
      num: "02",
      icon: Share2,
      color: "text-sky-600",
      bg: "bg-sky-50",
      border: "border-sky-200",
      tagColor: "bg-sky-50 text-sky-600 border border-sky-200/80",
      numColor: "text-sky-600 bg-sky-50",
      title: "রেফারেল রিওয়ার্ড প্রোগ্রাম",
      body: "আপনার পরিচিত বন্ধু, সহকর্মী বা স্বজনকে মুনতাজারে রেফার করলে প্রতিটি সফল যুক্তিতে আকর্ষণীয় তাৎক্ষণিক ক্যাশ বোনাস আর্ন করার সুযোগ।",
      tag: "Earn Per Referral",
    },
    {
      num: "03",
      icon: Gift,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
      tagColor: "bg-purple-50 text-purple-600 border border-purple-200/80",
      numColor: "text-purple-600 bg-purple-50",
      title: "মেগা গিভঅ্যাওয়ে সুবিধা",
      body: "ইনভেস্টরদের জন্য প্রতি ৩ মাস পর বিশেষ মেগা ক্যাশ প্রাইজ, প্রিমিয়াম গ্যাজেট, এবং এক্সক্লুসিভ টেকনোলজি ইভেন্টের ভিআইপি টিকিট পাস।",
      tag: "Quarterly Giveaways",
    },
    {
      num: "04",
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      tagColor: "bg-emerald-50 text-emerald-600 border border-emerald-200/80",
      numColor: "text-emerald-600 bg-emerald-50",
      title: "ভিআইপি নেটওয়ার্ক ও পার্টনার সুবিধা",
      body: "মুনতাজারের আন্তর্জাতিক নেটওয়ার্ক, দ্রুত ফাইল প্রসেসিং এবং প্রিমিয়াম কনসালটেন্সি সেবায় ইনভেস্টরদের সর্বোচ্চ অগ্রাধিকার প্রদান।",
      tag: "Partner Perks",
    },
    {
      num: "05",
      icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      tagColor: "bg-amber-50 text-amber-600 border border-amber-200/80",
      numColor: "text-amber-600 bg-amber-50",
      title: "আর্লি ফিচার অ্যাক্সেস",
      body: "যেকোনো নতুন ফিচার পাবলিসিটির আগেই বিটা টেস্টিং করার সুবিধা। আপনার মতামত সরাসরি মুনতাজারের প্রোডাক্ট রোডম্যাপ গঠনে ভূমিকা রাখবে।",
      tag: "Beta Access",
    },
    {
      num: "06",
      icon: Handshake,
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-200",
      tagColor: "bg-rose-50 text-rose-600 border border-rose-200/80",
      numColor: "text-rose-600 bg-rose-50",
      title: "ফাউন্ডার-লেভেল রিলেশনশিপ",
      body: "ফাউন্ডারদের সাথে নিয়মিত ওয়ান-টু-ওয়ান মিটিং, ত্রৈমাসিক ফাইন্যান্সিয়াল আপডেট এবং স্ট্র্যাটেজিক সিদ্ধান্তে মতামত দেওয়ার সুযোগ।",
      tag: "Direct Founder Access",
    },
  ],
  en: [
    {
      num: "01",
      icon: Star,
      color: "text-[#EA580C]",
      bg: "bg-[#FFF5ED]",
      border: "border-[#FDDBC9]",
      tagColor: "bg-[#FFF5ED] text-[#EA580C] border border-[#FDDBC9]/80",
      numColor: "text-[#EA580C] bg-[#FFF5ED]",
      title: "Lifetime Free Subscription",
      body: "Every investor gets permanent free access to the full Muntajar platform — study abroad tools, visa guidance, job matching — for you and your family. No billing, ever.",
      tag: "Exclusive Access",
    },
    {
      num: "02",
      icon: Share2,
      color: "text-sky-600",
      bg: "bg-sky-50",
      border: "border-sky-200",
      tagColor: "bg-sky-50 text-sky-600 border border-sky-200/80",
      numColor: "text-sky-600 bg-sky-50",
      title: "Referral Rewards Program",
      body: "Refer a friend, family member, or colleague who joins — you earn instant referral bonuses for every successful introduction.",
      tag: "Earn Per Referral",
    },
    {
      num: "03",
      icon: Gift,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
      tagColor: "bg-purple-50 text-purple-600 border border-purple-200/80",
      numColor: "text-purple-600 bg-purple-50",
      title: "Exclusive Giveaway Access",
      body: "Investors get priority entry into quarterly giveaways — including cash prizes, premium subscription bundles, partner perks, and event invites before they go public.",
      tag: "Quarterly Giveaways",
    },
    {
      num: "04",
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      tagColor: "bg-emerald-50 text-emerald-600 border border-emerald-200/80",
      numColor: "text-emerald-600 bg-emerald-50",
      title: "VIP Network & Partner Perks",
      body: "Gain priority access to Muntajar's global partner ecosystem, expedited service processing, and exclusive annual community invitations as the platform expands.",
      tag: "Partner Perks",
    },
    {
      num: "05",
      icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      tagColor: "bg-amber-50 text-amber-600 border border-amber-200/80",
      numColor: "text-amber-600 bg-amber-50",
      title: "Early Feature Access",
      body: "Be the first to test and shape new features before launch. Your feedback directly influences the product roadmap — investor input is always on the table.",
      tag: "Beta Access",
    },
    {
      num: "06",
      icon: Handshake,
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-200",
      tagColor: "bg-rose-50 text-rose-600 border border-rose-200/80",
      numColor: "text-rose-600 bg-rose-50",
      title: "Founder-Level Relationship",
      body: "Direct access to the founding team. Quarterly investor calls, transparent operational updates, and a seat at the table for major strategic decisions.",
      tag: "Direct Founder Access",
    },
  ],
};

/* ─── BILINGUAL MARKET STATS ────────────────────────────────────── */
const MARKET_STATS_DATA = {
  bn: [
    {
      num: 30.33,
      prefix: "$",
      suffix: "B",
      decimals: 2,
      value: "$৩০.৩৩B",
      label: "২০২৪-২৫ অর্থবছরে প্রবাসী বাংলাদেশীদের পাঠানো বৈশ্বিক অফিশিয়াল রেমিট্যান্স",
      source: "বাংলাদেশ ব্যাংক",
      color: "text-emerald-600",
    },
    {
      num: 1,
      prefix: "$",
      suffix: "B+",
      decimals: 0,
      value: "$১B+",
      label: "বাংলাদেশ থেকে প্রতি বছর বিদেশে পড়ালেখার উদ্দেশ্যে পাঠানো স্টুডেন্ট রেমিট্যান্স",
      source: "বাংলাদেশ ব্যাংক অফিশিয়াল ডাটা",
      color: "text-sky-600",
    },
    {
      num: 4.2,
      prefix: "$",
      suffix: "B",
      decimals: 1,
      value: "$৪.২B",
      label: "বাৎসরিক ১০ লাখ বাংলাদেশী কর্মীর অবৈধ দালালদের পেছনে দেওয়া অতিরিক্ত ফি",
      source: "ILO & BMET রিপোর্ট",
      color: "text-amber-600",
    },
    {
      num: 54.9,
      prefix: "",
      suffix: "%",
      decimals: 1,
      value: "৫৪.৯%",
      label: "২০২৪ সালে বাংলাদেশী আবেদনকারীদের শেনগেন ভিসা বাতিলের হার",
      source: "EU ভিসা ডাটাবেজ ২০২৪",
      color: "text-rose-600",
    },
    {
      num: 40,
      prefix: "",
      suffix: "M+",
      decimals: 0,
      value: "৪০M+",
      label: "ইন্টারনেট ব্যবহারকারী গ্লোবাল ক্যারিয়ার ও উচ্চশিক্ষা প্রত্যাশী উদীয়মান তরুণ",
      source: "DataReportal & BBS",
      color: "text-violet-600",
    },
    {
      num: 89.6,
      prefix: "$",
      suffix: "B",
      decimals: 1,
      value: "$৮৯.৬B",
      label: "২০৩৪ সালের মধ্যে বিশ্বব্যাপী আন্তর্জাতিক রিক্রুটমেন্ট মার্কেটের প্রজেক্টেড আকার",
      source: "Coherent Market Insights",
      color: "text-emerald-600",
    },
  ],
  en: [
    {
      num: 30.33,
      prefix: "$",
      suffix: "B",
      decimals: 2,
      value: "$30.33B",
      label: "Remittance sent home by overseas Bangladeshi workers in FY2024–25",
      source: "Bangladesh Bank",
      color: "text-emerald-600",
    },
    {
      num: 1,
      prefix: "$",
      suffix: "B+",
      decimals: 0,
      value: "$1B+",
      label: "Student education remittance flowing out of Bangladesh annually",
      source: "Bangladesh Bank, 2025 projection",
      color: "text-sky-600",
    },
    {
      num: 4.2,
      prefix: "$",
      suffix: "B",
      decimals: 1,
      value: "$4.2B",
      label: "Total agent fees paid by ~1M Bangladeshi workers yearly at avg $4,200",
      source: "ILO & BMET data",
      color: "text-amber-600",
    },
    {
      num: 54.9,
      prefix: "",
      suffix: "%",
      decimals: 1,
      value: "54.9%",
      label: "Schengen visa rejection rate for Bangladeshi applicants in 2024",
      source: "EU Visa Statistics 2024",
      color: "text-rose-600",
    },
    {
      num: 40,
      prefix: "",
      suffix: "M+",
      decimals: 0,
      value: "40M+",
      label: "Middle-class Bangladeshis with internet access aspiring for global pathways",
      source: "DataReportal, BBS 2025",
      color: "text-violet-600",
    },
    {
      num: 89.6,
      prefix: "$",
      suffix: "B",
      decimals: 1,
      value: "$89.6B",
      label: "Global international recruitment market size by 2034 at 8.6% CAGR",
      source: "Coherent Market Insights",
    },
  ],
};

/* ─── BILINGUAL INVESTMENT TIERS ───────────────────────────────── */
const INVESTMENT_TIERS_DATA = {
  bn: [
    {
      name: "সিড এঞ্জেল টিয়ার",
      range: "২০,০০০ টাকা",
      strikethrough: "৪০,০০০ টাকা",
      badge: "কমিউনিটি এঞ্জেল",
      features: [
        "অফিশিয়াল পার্টনার চুক্তি ও আইনি সার্টিফিকেট",
        "লাইফটাইম ফ্রি প্ল্যাটফর্ম অ্যাক্সেস",
        "ত্রৈমাসিক গ্রোথ ও ফাইন্যান্সিয়াল রিপোর্ট",
        "প্রাইভেট ইনভেস্টর কমিউনিটি অ্যাক্সেস",
      ],
      cta: "২০,০০০ টাকা টিয়ার নির্বাচন করুন",
      isPopular: false,
    },
    {
      name: "গ্রোথ টিয়ার",
      range: "৪০,০০০ টাকা",
      strikethrough: "৮০,০০০ টাকা",
      badge: "সর্বাধিক জনপ্রিয়",
      features: [
        "ভিআইপি পার্টনার সুবিধা ও প্রাধিকার",
        "২ গুণ রেফারেল কমিশন বোনাস",
        "মাসিক ফাউন্ডার অফিস আওয়ার্স মিটিং",
        "প্রোডাক্ট অ্যাডভাইজরি সুবিধা",
      ],
      cta: "৪০,০০০ টাকা টিয়ার নির্বাচন করুন",
      isPopular: true,
    },
    {
      name: "স্ট্র্যাটেজিক / লিড টিয়ার",
      range: "৮০,০০০ টাকা",
      strikethrough: "১,৬০,০০০ টাকা",
      badge: "ইনস্টিটিউশনাল লিড",
      features: [
        "অ্যাডভাইজরি কাউন্সিল সিট",
        "কাস্টম পার্টনারশিপ স্ট্রাকচারিং",
        "এক্সিকিউティブ বোর্ড প্রিভিলেজ",
        "সরাসরি ফাউন্ডার পার্টনারশিপ সুবিধা",
      ],
      cta: "৮০,০০০ টাকা টিয়ার নির্বাচন করুন",
      isPopular: false,
    },
  ],
  en: [
    {
      name: "Seed Angel Tier",
      range: "৳20,000 BDT",
      strikethrough: "৳40,000 BDT",
      badge: "Community Angel",
      features: [
        "Official Partner Contract & Certificate",
        "Lifetime Free Platform Access",
        "Quarterly Growth & Operational Reports",
        "Private Community Access",
      ],
      cta: "Select ৳20,000 Tier",
      isPopular: false,
    },
    {
      name: "Growth Tier",
      range: "৳40,000 BDT",
      strikethrough: "৳80,000 BDT",
      badge: "Most Popular",
      features: [
        "Priority Partner Perks & Privileges",
        "2x Referral Commission Bonus",
        "Monthly Founder Office Hours",
        "Priority Product Advisory Rights",
      ],
      cta: "Select ৳40,000 Tier",
      isPopular: true,
    },
    {
      name: "Strategic / VC Tier",
      range: "৳80,000 BDT",
      strikethrough: "৳1,60,000 BDT",
      badge: "Institutional / Lead",
      features: [
        "Advisory Council Seat",
        "Custom Partnership Structuring",
        "Executive Council Privileges",
        "Direct Founder Partnership Rights",
      ],
      cta: "Select ৳80,000 Tier",
      isPopular: false,
    },
  ],
};

/* ─── BILINGUAL FAQS DATA ───────────────────────────────────── */
const FAQS_DATA = {
  bn: [
    {
      q: "১. কোম্পানির audited financial statement কোথায়? গত ১ বছরের revenue, profit, expense breakdown দেখাতে চাই।",
      a: "Muntajar-এর audited financial statement, 12-month revenue ledger, এবং expense breakdown ইনভেস্টরদের জন্য সম্পূর্ণ উন্মুক্ত। NDA সাইন করার পর বা ফাউন্ডার কলের সময় অফিশিয়াল রিলেটেড পেপারস সরাসরি প্রদান করা হয়।",
    },
    {
      q: "২. Partnership/Investment বলতে exactly কী বুঝাচ্ছেন? Total capital এবং valuation কত?",
      a: "Partnership বলতে অফিশিয়াল ইনভেস্টমেন্ট এগ্রিমেন্ট ও পার্টনারশিপ সুবিধা বুঝানো হচ্ছে। ইনভেস্টরকে সরাসরি অফিশিয়াল ইনভেস্টমেন্ট সার্টিফিকেট প্রদান করা হয়। চুক্তিপত্রে টোটাল ক্যাপিটাল এবং ভ্যালুয়েশন স্পষ্ট উল্লেখ থাকে।",
    },
    {
      q: "৩. ২০,০০০ টাকার বিনিময়ে investor company-র কী কী benefit পাবেন?",
      a: "২০,০০০ টাকার এঞ্জেল টিকিটে গ্যারান্টিড রিটার্ন (Guaranteed ROI), লাইফটাইম ফ্রি প্ল্যাটফর্ম অ্যাক্সেস, পার্টনারশিপ বেনিফিট এবং অফিশিয়াল ইনভেস্টমেন্ট সার্টিফিকেট প্রদান করা হয়, যা চুক্তিপত্রে উল্লেখিত থাকে।",
    },
    {
      q: "৪. ১.২৫x রিটার্ন এবং লাইফটাইম ফ্রি সাবস্ক্রিপশন কীভাবে জেনারেট হবে? কোন business activity থেকে এই profit আসবে?",
      a: "Muntajar-এর আয়ের প্রধান উৎসসমূহ: (১) বিশ্ববিদ্যালয় ভর্তি কমিশন, (২) বৈদেশিক কর্মসংস্থান রিক্রুটমেন্ট ফি, এবং (৩) বিটুবি এন্টারপ্রাইজ ভিসা প্রসেসিং সার্ভিস চার্জ। ইনভেস্টরগণ ১.২৫x প্রজেক্টেড রিটার্নের পাশাপাশি আমৃত্যু লাইফটাইম ফ্রি সাবস্ক্রিপশন সুবিধা লাভ করবেন।",
    },
    {
      q: "৫. ১.২৫x রিটার্ন কি guaranteed নাকি projected? Guaranteed হলে legal document কোথায়?",
      a: "রিটার্নস কোম্পানির বাৎসরিক পারফরম্যান্সের ওপর ভিত্তি করে প্রজেক্টেড ও গ্যারান্টিড রিটার্ন (Guaranteed ROI) হিসেবে বিবেচিত। সমস্ত চুক্তি শতভাগ স্বচ্ছ আইনি ডকুমেন্টের মাধ্যমে নিবন্ধিত।",
    },
    {
      q: "৬. Company loss করলে investor protection কী?",
      a: "ইনভেস্টরগণ Preferred Investor Protection পান এবং আইন অনুযায়ী কোম্পানির সম্পদে পার্টনারশিপ রাইটস বজায় থাকে।",
    },
    {
      q: "৭. Investor Agreement-এর draft কি আগেই দেখা যাবে?",
      a: "হ্যাঁ! ইনভেস্টমেন্ট নিশ্চিত করার আগেই অভিজ্ঞ আইনজীবী দ্বারা পরীক্ষিত এগ্রিমেন্টের ড্রাফট কপি প্রদান করা হয়।",
    },
    {
      q: "৮. Payout policy কী? Partner কীভাবে টাকা পাবে?",
      a: "বাৎসরিক নিট অপারেটিং প্রফিটের ওপর ভিত্তি করে অডিটেড স্টেটমেন্ট অনুযায়ী অর্ধবার্ষিক বা বাৎসরিক ভিত্তিতে পেআউট ডিস্ট্রিবিউট করা হয়।",
    },
    {
      q: "৯. Share transfer / Exit mechanism কী?",
      a: "ইনভেস্টরগণ পরবর্তী ফান্ডিং রাউন্ডে কোম্পানি বাইব্যাকের মাধ্যমে বা অনুমোদিত নতুন পার্টনারের কাছে এগ্রিমেন্ট ট্রান্সফার করে এক্সিট নিতে পারবেন।",
    },
    {
      q: "১০. Valuation কে করেছে? Third-party audit report আছে?",
      a: "ভ্যালুয়েশন মডেলটি BMET কর্মসংস্থান ভলিউম এবং বিশ্ববিদ্যালয় চুক্তির ওপর ভিত্তি করে EV/EBITDA মাল্টিপল অনুযায়ী তৈরি।",
    },
    {
      q: "১১. Funds utilization breakdown কী?",
      a: "ইনভেস্টরদের তহবিল ৪০% টেকনোলজি ডেভলপমেন্ট, ৩৫% ডিজিটাল মার্কেটিং এবং ২৫% আন্তর্জাতিক অফিস সম্প্রসারণে ব্যবহৃত হয়।",
    },
    {
      q: "১২. Tech platform-এর IP (Intellectual Property) কার নামে registered?",
      a: "মুনতাজের সমস্ত সফটওয়্যার অ্যালগরিদম, এআই মডেল এবং ট্রেডমার্ক অফিশিয়ালি Muntajar Global Limited-এর নামে নিবন্ধিত।",
    },
    {
      q: "১৩. Company fail করলে দায় কে নিবে?",
      a: "প্রাইভেট লিমিটেড কোম্পানি আইন অনুযায়ী কোম্পানির এসেট ও লাইবিলিটি ইনভেস্টমেন্ট চুক্তি স্ট্রাকচার অনুযায়ী সেটেল করা হয়।",
    },
    {
      q: "১৪. পার্টনারশিপ এবং শেয়ার সংক্রান্ত legal papers কীভাবে যাচাই করা যাবে?",
      a: "প্রজেক্টের অফিশিয়াল সিএস/আরএস ডাগ নম্বর, রেজিস্ট্রি মানচিত্র এবং এগ্রিমেন্ট সংক্রান্ত লিগ্যাল পেপারস ইনভেস্টর অফিসে সশরীরে বা ডিজিটালি চেক করতে পারবেন।",
    },
    {
      q: "১৫. Migration/study service যদি fail হয় বা visa reject হয় তাহলে দায়ভার কে নিবে?",
      a: "Muntajar-এর সার্ভিস পলিসি অনুযায়ী ভিসা রিজেকশন হলে সার্ভিস চার্জের চুক্তিভিত্তিক রিফান্ড বা সেকেন্ড টাইম ফ্রি ফাইল প্রসেসিং গ্যারান্টি প্রদান করা হয়।",
    },
    {
      q: "১৬. Investor-এর টাকা business expansion এ যাবে নাকি previous liabilities/returns দিতে ব্যবহার হবে?",
      a: "ইনভেস্টরদের প্রতিটি টাকা টেকনোলজি স্কেলিং, মার্কেটিং, এবং আন্তর্জাতিক অফিস সম্প্রসারণে (Business Expansion) ব্যবহৃত হয়।",
    },
    {
      q: "১৭. কেন traditional bank loan বা institutional investment না নিয়ে public-এর কাছ থেকে টাকা নিচ্ছেন?",
      a: "আমাদের লক্ষ্য কমিউনিটি-ড্রাইভেন এনআরবি (NRB & Community) নেটওয়ার্ক তৈরি করা, যাতে ইনভেস্টরগণ কেবল পুঁজি নয়, ব্রান্ড অ্যাম্বাসেডর হিসেবেও কাজ করেন।",
    },
    {
      q: "১৮. RJSC registration ছাড়া আর কী regulatory compliance আছে? TIN, trade license, tax return, audit report available?",
      a: "Muntajar-এর অরিজিনাল RJSC ট্রেড লাইসেন্স, ই-টিন (e-TIN), ভ্যাট রেজিস্ট্রেশন এবং বাৎসরিক ট্যাক্স রিটার্ন ফাইলের পাশাপাশি ২,০০০+ আন্তর্জাতিক বিশ্ববিদ্যালয় এফিলিয়েশন, গ্লোবাল রিক্রুটার নেটওয়ার্ক এবং স্থানীয় লাইসেন্সপ্রাপ্ত আরএল (RL / Recruitment Licenses) বজায় আছে।",
    },
    {
      q: "১৯. Company dissolve হলে investor asset claim process কী হবে?",
      a: "কোম্পানি ডিভলভ হলে বাংলাদেশ কোম্পানি আইনের নিয়মানুযায়ী কোম্পানির লাইবিলিটি মেটানোর পর অবশিষ্ট স্থাবর-অস্থাবর সম্পদ ইনভেস্টমেন্ট চুক্তি অনুপাতে বন্টন করা হয়।",
    },
    {
      q: "২০. 100+ gift/prize কি investment proposal-এর অংশ? এটা কি investor attraction tactic নাকি business necessity?",
      a: "এটি প্রমোশনাল এবং আর্লি-বার্ড এনগেзываемেন্ট গিফট, যা মূল ইনভেস্টমেন্ট চুক্তির বাইরে একটি অতিরিক্ত গিভঅ্যাওয়ে সুবিধা।",
    },
    {
      q: "২১. যদি projected return achieve না হয় তাহলে investor compensation কী?",
      a: "প্রজেক্টেড রিটার্ন অর্জিত না হলে ইনভেস্টমেন্ট ভ্যালু হোল্ড থাকবে এবং পরবর্তী বছরের একিউমুলেশন থেকে পার্টনার এডজাস্টমেন্ট করা হবে—তবে আমাদের শক্তিশালী অপারেশনের কারণে এমন ঘটনার সম্ভাবনা অত্যন্ত কম (Very low chance of such incident)।",
    },
    {
      q: "২২. Company valuation আর future growth assumptions কোন data-এর উপর based?",
      a: "বাংলাদেশ থেকে বাৎসরিক ৫৪%+ স্টুডেন্ট ও ওয়ার্কার মাইগ্রেশন গ্রোথ ডাটা এবং বিএমইটি/বিএসবি অফিশিয়াল রিপোর্টের ওপর ভিত্তি করে গ্রোথ প্রজেক্ট করা হয়েছে।",
    },
    {
      q: "২৩. আপনার business model referral ছাড়া independently sustainable কি না সেটা numbers দিয়ে explain করতে পারবেন?",
      a: "হ্যাঁ, রেফারেল ছাড়াও প্রতি স্টুডেন্ট ও ওয়ার্কার প্রসেসিং থেকে Muntajar গড় ৪০,০০০ BDT থেকে ৬০,০০০ BDT নিট সার্ভিস ফি অর্জন করে, যা স্বাধীনভাবে ১০০% টেকসই (Independently Sustainable)।",
    },
    {
      q: "২৪. How do overseas NRB investors sign agreements remotely?",
      a: "Overseas Bangladeshis (NRBs) can complete digital KYC verification and sign legally binding e-contracts remotely from any country.",
    },
  ],
  en: [
    {
      q: "1. Where is the company's audited financial statement? Can I see the last 1 year's revenue, profit, and expense breakdown?",
      a: "Muntajar's audited financial statement, 12-month revenue ledger, and expense breakdown are completely open to prospective investors upon signing an NDA or during a founder discussion call.",
    },
    {
      q: "2. What exactly do you mean by Partnership/Investment? What is the total capital and valuation?",
      a: "Partnership refers to official investment agreements and partner privileges. Investors receive an official investment certificate outlining total capital valuation and asset rights.",
    },
    {
      q: "3. What ownership/benefits does an investor receive for a ৳20,000 investment?",
      a: "For the minimum angel ticket, investors receive a guaranteed ROI, permanent free platform access, community partner benefits, and an official investment certificate as structured in the contract.",
    },
    {
      q: "4. How is the projected 1.25x return + lifetime free subscription generated? Which business activities drive this revenue?",
      a: "Muntajar's primary revenue streams include: (1) University admission processing commissions, (2) Overseas worker recruitment fees, and (3) B2B enterprise visa processing service charges. Partners receive a projected 1.25x return alongside permanent lifetime free platform subscription access.",
    },
    {
      q: "5. Is the 1.25x return guaranteed or projected? If guaranteed, where is the legal document?",
      a: "The 1.25x returns are projected and backed by guaranteed ROI terms based on core operational performance. All investor agreements include 100% transparent terms and audit disclosures.",
    },
    {
      q: "6. What is the investor protection if the company incurs a loss?",
      a: "Investors hold Preferred Investor Protection and legal partner claim rights over company assets as structured under company law.",
    },
    {
      q: "7. Can I review the Investor Agreement draft before committing funds?",
      a: "Yes! A lawyer-vetted draft of the partnership agreement is provided for your legal review prior to finalizing your investment.",
    },
    {
      q: "8. What is the Payout Policy? How and when do partners receive returns?",
      a: "Payouts are distributed semi-annually or annually based on audited net operating profits as outlined in the partner deed.",
    },
    {
      q: "9. What is the Share Transfer / Exit Mechanism for investors?",
      a: "Investors can exit during subsequent funding rounds through company share buybacks or by transferring their partnership deed to an approved investor.",
    },
    {
      q: "10. Who conducted the company valuation? Is there a third-party audit report?",
      a: "The valuation model is built on EV/EBITDA multiples using BMET employment volume data and university partner agreements.",
    },
    {
      q: "11. What is the Funds Utilization breakdown?",
      a: "Investor capital is allocated: 40% to technology and AI automation, 35% to digital growth marketing, and 25% to global office expansion.",
    },
    {
      q: "12. Who owns the Intellectual Property (IP) of the tech platform?",
      a: "All software algorithms, AI models, and trademarks are officially registered under Muntajar Global Limited.",
    },
    {
      q: "13. Who takes responsibility if the company faces failure?",
      a: "Under Private Limited Company law, asset and liability settlement is governed strictly according to the investor partnership contract structure.",
    },
    {
      q: "14. How can investors inspect legal partnership and equity deed documents?",
      a: "All official incorporation records, equity deeds, and registration documents can be physically verified at our corporate office or reviewed digitally.",
    },
    {
      q: "15. What happens if a student or worker visa application is rejected?",
      a: "Muntajar provides a contractual service charge refund or second-time free file processing guarantee per our service terms.",
    },
    {
      q: "16. Are investor funds used for business growth or paying previous liabilities?",
      a: "100% of investor capital is allocated exclusively toward business expansion, technology scaling, and marketing — never prior liabilities.",
    },
    {
      q: "17. Why raise community equity instead of taking a traditional bank loan?",
      a: "Our strategy is to build a powerful community of NRB & local brand ambassadors who contribute strategic network value alongside capital.",
    },
    {
      q: "18. What regulatory compliance does Muntajar hold besides RJSC registration?",
      a: "Muntajar maintains up-to-date RJSC incorporation, e-TIN, Trade License, VAT registration, and annual tax audit filings, supported by 2,000+ international university affiliations, global recruiters network, and local RLs (Recruitment Licenses).",
    },
    {
      q: "19. What is the asset claim process if the company dissolves?",
      a: "If dissolved, remaining company assets after settling statutory liabilities are distributed proportionally per investor contract ownership.",
    },
    {
      q: "20. Are the 100+ promotional prizes part of the core investment contract?",
      a: "Promotional giveaways and early-bird prizes are bonus engagement perks provided in addition to your core investment rights.",
    },
    {
      q: "21. What is the investor compensation if projected timelines are delayed?",
      a: "If projected returns face delays, equity value remains secured and yields roll over to the subsequent audited fiscal cycle. Due to strong operational cash flow, there is a very low chance of such an incident.",
    },
    {
      q: "22. What data sources form the basis of your growth projections?",
      a: "Projections are grounded in official Bangladesh Bank remittance reports, BMET worker statistics, and EU/UK migration statistics.",
    },
    {
      q: "23. Is the business model independently sustainable without referral programs?",
      a: "Yes. Muntajar generates an average service fee of 40,000 BDT to 60,000 BDT per candidate package processed, making operations 100% independently sustainable without referral programs.",
    },
    {
      q: "24. How do overseas NRB investors sign agreements remotely?",
      a: "Overseas Bangladeshis (NRBs) can complete digital KYC verification and sign legally binding e-contracts remotely from any country.",
    },
  ],
};

export function InvestorsPageContent() {
  const { lang } = useLang();
  const isBn = lang === "bn";
  const [showReportModal, setShowReportModal] = React.useState(false);
  const [showVideoModal, setShowVideoModal] = React.useState(false);
  const [isPlayingInline, setIsPlayingInline] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (showReportModal || showVideoModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showReportModal, showVideoModal]);

  // Capture affiliate ref code from URL and persist with 24hr expiry
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      const entry = { ref, expiresAt: Date.now() + 24 * 60 * 60 * 1000 };
      localStorage.setItem("muntajar_affiliate_ref", JSON.stringify(entry));
    }
  }, []);

  // Handle ESC key to close open modals
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowVideoModal(false);
        setShowReportModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [wordIndex, setWordIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % 4);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const ROTATING_WORDS_EN = ["Global Mobility.", "Ethical Manpower.", "Overseas Education.", "Bangladeshi Talent."];
  const ROTATING_WORDS_BN = ["গ্লোবাল মোবিলিটিতে।", "দক্ষ জনশক্তিতে।", "স্বচ্ছ উচ্চশিক্ষায়।", "তরুণ প্রজন্মের ক্ষমতায়নে।"];

  const perks = isBn ? PERKS_DATA.bn : PERKS_DATA.en;
  const marketStats = isBn ? MARKET_STATS_DATA.bn : MARKET_STATS_DATA.en;
  const tiers = isBn ? INVESTMENT_TIERS_DATA.bn : INVESTMENT_TIERS_DATA.en;
  const rawFaqs = isBn ? FAQS_DATA.bn : FAQS_DATA.en;
  const filteredFaqs = rawFaqs.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0F0E0C] text-stone-100 font-sans selection:bg-amber-400 selection:text-stone-950">
      <Navbar />

      {/* ── HERO SECTION ────────────────────────────────────────── */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 bg-[#FAF9F7] text-stone-900 overflow-hidden border-b border-stone-200">
        {/* Subtle grid texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none opacity-40" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          
          {/* Centered Top Block */}
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            {/* Seed Round Pill Badge */}
            <motion.div {...fadeUp(0.05)} className="inline-flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4f4f5] border border-stone-200/80 text-stone-800 text-xs font-semibold shadow-2xs">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                </span>
                <span>{isBn ? "এঞ্জেল ইকুইটি সিড রাউন্ড • সর্বনিম্ন ৳২০,০০০ / টিকিট" : "Bangladesh's #1 Global Mobility Platform"}</span>
              </div>
            </motion.div>

            {/* Main Headline with Continuously Rotating Words - Muntajar Investment Motive */}
            <motion.h1
              {...fadeUp(0.12)}
              className={`font-sans font-extrabold text-3xl sm:text-5xl lg:text-[3.75rem] leading-[1.14] text-stone-950 tracking-tight max-w-4xl mx-auto ${
                isBn ? "font-solaimanlipi" : ""
              }`}
            >
              {isBn ? (
                <>
                  বিনিয়োগ করুন বাংলাদেশের ভবিষ্যৎ{" "}
                  <span className="inline-block relative overflow-hidden align-bottom">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={ROTATING_WORDS_BN[wordIndex % ROTATING_WORDS_BN.length]}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -30, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="inline-block text-[#EA580C] underline decoration-[#FDDBC9] decoration-4 underline-offset-8"
                      >
                        {ROTATING_WORDS_BN[wordIndex % ROTATING_WORDS_BN.length]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </>
              ) : (
                <>
                  Invest in the Future of{" "}
                  <span className="inline-block relative overflow-hidden align-bottom">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={ROTATING_WORDS_EN[wordIndex % ROTATING_WORDS_EN.length]}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -30, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="inline-block text-[#EA580C] underline decoration-[#FDDBC9] decoration-4 underline-offset-8"
                      >
                        {ROTATING_WORDS_EN[wordIndex % ROTATING_WORDS_EN.length]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </>
              )}
            </motion.h1>

            {/* Subtitle - Clear Investment & Motive Statement */}
            <motion.p
              {...fadeUp(0.16)}
              className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal"
            >
              {isBn
                ? "মুনতাজার তৈরি করছে বাংলাদেশের প্রথম দালাল-মুক্ত সমন্বিত ম্যানপাওয়ার ও উচ্চশিক্ষা ইকোসিস্টেম। আমাদের এঞ্জেল সিড রাউন্ডে যুক্ত হয়ে আইনি মালিকানা, ত্রৈমাসিক ডিভিডেন্ড ও দীর্ঘমেয়াদী রিটার্ন নিশ্চিত করুন।"
                : "Muntajar is building Bangladesh's first broker-free global manpower and education ecosystem. Join our early Angel Seed Round, earn quarterly dividends, and back the next generation of global talent."}
            </motion.p>

            {/* Action Buttons */}
            <motion.div {...fadeUp(0.22)} className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <LiquidMetalButton
                label={isBn ? "ইনভেস্টমেন্ট টিকিট দেখুন" : "Explore Investment Tiers"}
                onClick={() => {
                  document.getElementById("tiers")?.scrollIntoView({ behavior: "smooth" });
                }}
              />

              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 border border-stone-300 text-stone-900 font-semibold text-sm px-6 py-3 rounded-full transition-all cursor-pointer h-[46px]"
              >
                <FileText className="w-4 h-4 text-stone-600" />
                <span>{isBn ? "পিচ ডেক দেখুন" : "View Pitch Deck"}</span>
              </button>
            </motion.div>

            {/* Social Proof Avatar & Rating Strip */}
            <motion.div {...fadeUp(0.26)} className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <div className="flex -space-x-2.5 overflow-hidden shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Applicant"
                  width={36}
                  height={36}
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  unoptimized
                />
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Applicant"
                  width={36}
                  height={36}
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  unoptimized
                />
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                  alt="Applicant"
                  width={36}
                  height={36}
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  unoptimized
                />
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 text-white font-bold text-xs ring-2 ring-white select-none">
                  +
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 text-left sm:text-center">
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="text-xs font-bold text-stone-950">
                  4.9/5 <span className="text-stone-400 font-normal">·</span> 12,000+ {isBn ? "শিক্ষার্থী ও প্রবাসীদের গাইডেন্স" : "Students & professionals guided"}
                </span>
              </div>
            </motion.div>

          </div>

          {/* ── Wide Cinematic Video Showcase ── */}
          <motion.div
            {...fadeUp(0.32)}
            className="mt-12 sm:mt-14 max-w-5xl mx-auto"
          >
            <div
              onClick={() => setShowVideoModal(true)}
              className="relative w-full aspect-[16/9] sm:aspect-[21/9.5] rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-300 bg-stone-950 group cursor-pointer"
            >
              {/* Background Looping Muted Video Preview */}
              <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/2W8LBxb7K_M?autoplay=1&mute=1&loop=1&playlist=2W8LBxb7K_M&controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1"
                  className="w-[140%] h-[140%] -translate-x-[14%] -translate-y-[14%] object-cover border-0"
                  allow="autoplay; encrypted-media"
                  title="Muntajar Founder Video Loop"
                />
              </div>

              {/* Glassmorphic Overlay & Central Play Button */}
              <div className="absolute inset-0 bg-stone-950/25 group-hover:bg-stone-950/40 transition-colors flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 border border-white flex items-center justify-center group-hover:scale-105 transition-transform duration-150">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 text-[#EA580C] fill-[#EA580C] ml-1" />
                  </div>
                  <span className="hidden sm:inline-block text-xs font-bold text-white bg-stone-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
                    {isBn ? "ফাউন্ডারের ৬-মিনিট অডিও-ভিডিও বার্তা দেখুন" : "Watch 6-Min Founder Pitch & Vision Tour"}
                  </span>
                </div>

                {/* Bottom Video Info Bar */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-950/80 backdrop-blur-sm text-white text-xs font-semibold border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{isBn ? "লাইভ পিচ ও ডেমো" : "Platform Demo & Founder Briefing"}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-white/90 bg-stone-950/80 px-2.5 py-1 rounded-md border border-white/10">
                    6:12 HD
                  </span>
                </div>
              </div>
            </div>

            {/* Supporting 3-column pill strip below video */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs font-medium text-stone-600">
              <div className="flex items-center justify-center gap-2 p-2.5 bg-white rounded-xl border border-stone-200">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>150+ Direct University Partnerships</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-2.5 bg-white rounded-xl border border-stone-200">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Up to 60% Lower Candidate Cost</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-2.5 bg-white rounded-xl border border-stone-200">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Official Legal Deed under Companies Act</span>
              </div>
            </div>
          </motion.div>

          {/* ── METRICS & HIGHLIGHTS ROW (RESPONSIVE 2-COL MOBILE, 4-COL DESKTOP) ── */}
          <motion.div
            {...fadeUp(0.38)}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 pt-6 sm:pt-10 mt-8 sm:mt-12 border-t border-stone-200 text-left"
          >
            {/* Item 1: #1 First in BD */}
            <div className="p-3.5 sm:p-0 rounded-2xl bg-white/70 sm:bg-transparent border border-stone-200/80 sm:border-none">
              <p className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight">#1</p>
              <p className="text-[11px] sm:text-xs text-stone-500 font-medium mt-0.5 leading-snug">
                {isBn ? "দেশের ১ম দালাল-মুক্ত প্ল্যাটফর্ম" : "Bangladesh's 1st broker-free platform"}
              </p>
            </div>

            {/* Item 2: 1M+ */}
            <div className="p-3.5 sm:p-0 rounded-2xl bg-white/70 sm:bg-transparent border border-stone-200/80 sm:border-none sm:border-l sm:border-stone-200 sm:pl-6">
              <p className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight">1M+</p>
              <p className="text-[11px] sm:text-xs text-stone-500 font-medium mt-0.5 leading-snug">
                {isBn ? "বাংলাদেশী প্রতিভার বৈশ্বিক পাইপলাইন" : "Youth & talent global pipeline"}
              </p>
            </div>

            {/* Item 3: 10K+ */}
            <div className="p-3.5 sm:p-0 rounded-2xl bg-white/70 sm:bg-transparent border border-stone-200/80 sm:border-none lg:border-l lg:border-stone-200 lg:pl-6">
              <p className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight">10K+</p>
              <p className="text-[11px] sm:text-xs text-stone-500 font-medium mt-0.5 leading-snug">
                {isBn ? "অনুমোদিত রিক্রুটার ও পার্টনার নেটওয়ার্ক" : "Recruiters & university partners"}
              </p>
            </div>

            {/* Item 4: 100% */}
            <div className="p-3.5 sm:p-0 rounded-2xl bg-white/70 sm:bg-transparent border border-stone-200/80 sm:border-none lg:border-l lg:border-stone-200 lg:pl-6">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#EA580C] tracking-tight">100%</p>
              <p className="text-[11px] sm:text-xs text-stone-500 font-medium mt-0.5 leading-snug">
                {isBn ? "স্বচ্ছ ও আইনি চুক্তি নিরাপত্তা" : "Transparent legal deed guarantee"}
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Institutional Partners Logos */}
      <section className="py-12 border-b border-stone-200/60 bg-[#FAF9F7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <Logos3
            heading={
              isBn
                ? "স্বীকৃত ইমিগ্রেশন পোর্টাল, ইন্টারন্যাশনাল ইউনিভার্সিটি ও পেমেন্ট পার্টনারসমূহ"
                : "Trusted by Accredited Migration Portals, Global Universities & Infrastructure Partners"
            }
            logos={INVESTOR_LOGOS}
          />
        </div>
      </section>

      {/* ── MINIMALIST WHAT IS MUNTAJAR SECTION WITH 3D GLOBE ───────────── */}
      <section className="py-20 md:py-28 bg-[#FAF9F7] border-b border-stone-200/60 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Badge, Punchy Headline, and 3 Micro Highlights */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4f4f5] border border-stone-200/80 text-stone-800 text-xs font-semibold shadow-2xs">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                  </span>
                  <span>{isBn ? "মুনতাজার পরিচিতি ও ভিশন" : "What is Muntajar?"}</span>
                </span>
              </div>

              <h2 className="font-sans font-black text-3xl sm:text-4xl lg:text-[3.25rem] text-stone-950 tracking-tight leading-[1.14]">
                {isBn ? (
                  <>
                    মুনতাজার কোনো সাধারণ স্টার্টআপ নয়; এটি{" "}
                    <span className="text-[#EA580C]">বাংলাদেশের ভবিষ্যৎকে পুনর্গঠনের একটি আন্দোলন।</span>
                  </>
                ) : (
                  <>
                    Muntajar is not just a startup; it&apos;s a{" "}
                    <span className="text-[#EA580C] relative inline-block underline decoration-[#EA580C] decoration-2 underline-offset-6">
                      movement
                    </span>{" "}
                    to reshape{" "}
                    <span className="text-[#EA580C]">Bangladesh&apos;s future for the world.</span>
                  </>
                )}
              </h2>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal border-l-2 border-[#EA580C] pl-5 py-0.5 max-w-xl">
                {isBn
                  ? "মুনতাজার আন্তর্জাতিক শিক্ষা ও কর্মসংস্থানকে কোনো দালাল ছাড়া সম্পূর্ণ ডিজিটাল ও স্বচ্ছ করে গড়ে তুলেছে।"
                  : "Muntajar is Bangladesh's first broker-free digital ecosystem for global education, workforce, and migration mobility."}
              </p>

            </div>

            {/* Right Column: 3D Interactive Globe with Arcs & Pulses */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-[480px] aspect-square flex items-center justify-center">
                <GlobePulse
                  className="w-full h-full"
                  speed={0.0035}
                  markerColor={[0.91, 0.35, 0.05]}
                  arcColor={[0.91, 0.35, 0.05]}
                  baseColor={[0.95, 0.95, 0.95]}
                  glowColor={[0.98, 0.98, 0.98]}
                />
              </div>
            </div>

          </div>

          {/* 3 Bottom Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            
            {/* Card 1: Zero Middleman Integrity */}
            <div className="p-7 rounded-3xl bg-white border border-stone-200/90 shadow-xs border-b-4 border-b-[#EA580C] hover:shadow-md transition-all flex flex-col items-start text-left">
              <div className="w-14 h-14 rounded-full bg-[#FFF5ED] border border-[#FDDBC9]/80 flex items-center justify-center text-[#EA580C] shrink-0 mb-4">
                <UserCheck className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-extrabold text-[#EA580C] uppercase tracking-wider block">
                01 / DIRECT ACCESS
              </span>
              <h3 className="text-lg font-black text-stone-950 mt-1">
                {isBn ? "দালালমুক্ত সরাসরি সংযোগ" : "Zero Middleman Integrity"}
              </h3>
              <div className="w-6 h-0.5 bg-[#EA580C] my-2" />
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                {isBn
                  ? "বিশ্ববিদ্যালয় এবং নিবন্ধিত বৈশ্বিক নিয়োগকর্তাদের সাথে সরাসরি সংযোগ।"
                  : "Direct API pipelines connecting applicants directly with accredited global institutions."}
              </p>
            </div>

            {/* Card 2: Automated AI Compliance */}
            <div className="p-7 rounded-3xl bg-white border border-stone-200/90 shadow-xs border-b-4 border-b-[#EA580C] hover:shadow-md transition-all flex flex-col items-start text-left">
              <div className="w-14 h-14 rounded-full bg-[#FFF5ED] border border-[#FDDBC9]/80 flex items-center justify-center text-[#EA580C] shrink-0 mb-4">
                <Brain className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-extrabold text-[#EA580C] uppercase tracking-wider block">
                02 / AI AUTOMATION
              </span>
              <h3 className="text-lg font-black text-stone-950 mt-1">
                {isBn ? "এআই ডকুমেন্ট যাচাইকরণ" : "Automated AI Compliance"}
              </h3>
              <div className="w-6 h-0.5 bg-[#EA580C] my-2" />
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                {isBn
                  ? "একটি মাত্র ক্লিকে পাসপোর্ট অডিট ও পেপার প্রসেসিং স্বচ্ছতা।"
                  : "Instant passport extraction and visa eligibility scoring in under 60 seconds."}
              </p>
            </div>

            {/* Card 3: RJSC Shareholding Deed */}
            <div className="p-7 rounded-3xl bg-white border border-stone-200/90 shadow-xs border-b-4 border-b-emerald-600 hover:shadow-md transition-all flex flex-col items-start text-left">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 mb-4">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider block">
                03 / LEGAL PROTECTION
              </span>
              <h3 className="text-lg font-black text-stone-950 mt-1">
                {isBn ? "আরজেএসসি চুক্তি ও আইনি সুরক্ষা" : "RJSC Shareholding Deed"}
              </h3>
              <div className="w-6 h-0.5 bg-emerald-500 my-2" />
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                {isBn
                  ? "আইনজীবী দ্বারা সার্টিফাইড প্রাইভেট ইকুইটি ও লভ্যাংশ অধিকার।"
                  : "Certified partner equity registered under the Companies Act 1994."}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── STICKY FEATURE PROCESS & WHY INVEST SHOWCASE ─────────────── */}
      <StickyFeatureShowcase />

      {/* ── MARKET SIZE & OPPORTUNITY SECTION ──────────────────── */}
      <section className="py-20 md:py-28 bg-white border-b border-stone-200/70 text-stone-900 font-sans">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
          
          {/* Header Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-7 space-y-3 text-left">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4f4f5] border border-stone-200/80 text-stone-800 text-xs font-semibold shadow-2xs">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                </span>
                <span>{isBn ? "মার্কেট সাইজ ও পটেনশিয়াল" : "Market Size & Opportunity"}</span>
              </motion.div>

              <motion.h2 {...fadeUp(0.1)} className="font-sans font-black text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.15] text-stone-950 tracking-tight">
                {isBn ? (
                  <>
                    ৩০ বিলিয়ন ডলারের বিশাল{" "}
                    <span className="text-[#EA580C]">রেমিট্যান্স ও মাইগ্রেশন বাজার</span>
                  </>
                ) : (
                  <>
                    A $30B+ Inflow Market:{" "}
                    <span className="text-[#EA580C]">South Asia&apos;s Migration Highway</span>
                  </>
                )}
              </motion.h2>
            </div>

            <div className="lg:col-span-5 text-left pb-1">
              <motion.p {...fadeUp(0.15)} className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                {isBn
                  ? "বাংলাদেশ বিশ্বের অন্যতম প্রধান বৈশ্বিক মাইগ্রেশন ও শিক্ষা করিডোর। দালালদের অতিরিক্ত ফি দূর করে সম্পূর্ণ স্বচ্ছ প্রাতিষ্ঠানিক ডিজিটাল চ্যানেলে কাজ করে মুনতাজার।"
                  : "Bangladesh is one of the largest global mobility and migration corridors in the world. Muntajar digitizes pre-departure verification and institutional banking rails."}
              </motion.p>
            </div>
          </div>

          {/* ── 4-COLUMN CLEAN METRICS GRID WITH LIVE ANIMATED COUNTERS ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            
            {/* 1. $30.3B Inbound Remittance */}
            <div className="bg-[#FAF9F7] rounded-3xl p-7 border border-stone-200/80 flex flex-col justify-between space-y-4 hover:bg-white hover:border-stone-300 transition-all">
              <div className="space-y-2">
                <span className="text-4xl sm:text-5xl font-black text-stone-950 tracking-tight block">
                  <AnimatedCounter
                    to={30.3}
                    prefix="$"
                    suffix="B"
                    decimals={1}
                    duration={2.2}
                  />
                </span>
                <h3 className="text-sm sm:text-base font-bold text-stone-900">
                  {isBn ? "বার্ষিক অফিশিয়াল রেমিট্যান্স" : "Annual Remittance Inflow"}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed">
                  {isBn
                    ? "প্রবাসী বাংলাদেশীদের পাঠানো বাৎসরিক অফিশিয়াল রেমিট্যান্স প্রবাহ।"
                    : "Sent home annually by 14M+ overseas Bangladeshi diaspora in FY2024–25."}
                </p>
              </div>
              <p className="text-[11px] text-stone-400 font-medium pt-3 border-t border-stone-200/60">
                {isBn ? "সূত্র: বাংলাদেশ ব্যাংক" : "Source: Bangladesh Bank"}
              </p>
            </div>

            {/* 2. $4.2B Middlemen Agency Fees */}
            <div className="bg-[#FAF9F7] rounded-3xl p-7 border border-stone-200/80 flex flex-col justify-between space-y-4 hover:bg-white hover:border-stone-300 transition-all">
              <div className="space-y-2">
                <span className="text-4xl sm:text-5xl font-black text-[#EA580C] tracking-tight block">
                  <AnimatedCounter
                    to={4.2}
                    prefix="$"
                    suffix="B"
                    decimals={1}
                    duration={2.2}
                  />
                </span>
                <h3 className="text-sm sm:text-base font-bold text-stone-900">
                  {isBn ? "দালালদের অতিরিক্ত ফি" : "Middlemen Agency Fees"}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed">
                  {isBn
                    ? "বাৎসরিক ১০ লাখ কর্মীর দালালদের পেছনে অপচয়কৃত অতিরিক্ত ফি।"
                    : "Paid every year by ~1M outbound workers to unaccredited middleman brokers."}
                </p>
              </div>
              <p className="text-[11px] text-stone-400 font-medium pt-3 border-t border-stone-200/60">
                {isBn ? "সূত্র: ILO & BMET ডাটা" : "Source: ILO & BMET Data"}
              </p>
            </div>

            {/* 3. $1.2B Outbound Student Tuition */}
            <div className="bg-[#FAF9F7] rounded-3xl p-7 border border-stone-200/80 flex flex-col justify-between space-y-4 hover:bg-white hover:border-stone-300 transition-all">
              <div className="space-y-2">
                <span className="text-4xl sm:text-5xl font-black text-stone-950 tracking-tight block">
                  <AnimatedCounter
                    to={1.2}
                    prefix="$"
                    suffix="B+"
                    decimals={1}
                    duration={2.2}
                  />
                </span>
                <h3 className="text-sm sm:text-base font-bold text-stone-900">
                  {isBn ? "আন্তর্জাতিক টিউশন ফি প্রবাহ" : "Outbound Student Tuition"}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed">
                  {isBn
                    ? "বাংলাদেশ থেকে বিদেশে উচ্চশিক্ষার উদ্দেশ্যে পাঠানো বার্ষিক টিউশন ফি।"
                    : "Direct international student tuition and living deposits flowing to global universities."}
                </p>
              </div>
              <p className="text-[11px] text-stone-400 font-medium pt-3 border-t border-stone-200/60">
                {isBn ? "সূত্র: বাংলাদেশ ব্যাংক বৈদেশিক মুদ্রা" : "Source: Bangladesh Bank Foreign Exchange"}
              </p>
            </div>

            {/* 4. 40M Addressable Talent Base */}
            <div className="bg-[#FAF9F7] rounded-3xl p-7 border border-stone-200/80 flex flex-col justify-between space-y-4 hover:bg-white hover:border-stone-300 transition-all">
              <div className="space-y-2">
                <span className="text-4xl sm:text-5xl font-black text-stone-950 tracking-tight block">
                  <AnimatedCounter
                    to={40}
                    suffix="M+"
                    decimals={0}
                    duration={2.2}
                  />
                </span>
                <h3 className="text-sm sm:text-base font-bold text-stone-900">
                  {isBn ? "ডিজিটাল তরুণ জনগোষ্ঠী" : "Addressable Talent Base"}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed">
                  {isBn
                    ? "ইন্টারনেট ব্যবহারকারী গ্লোবাল ক্যারিয়ার ও উচ্চশিক্ষা প্রত্যাশী তরুণ প্রজন্ম।"
                    : "Internet-connected students and professionals aspiring for global opportunities."}
                </p>
              </div>
              <p className="text-[11px] text-stone-400 font-medium pt-3 border-t border-stone-200/60">
                {isBn ? "সূত্র: BBS ও DataReportal" : "Source: BBS & DataReportal"}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── INVESTMENT TIERS & CALCULATOR 2-COLUMN SECTION ── */}
      <section id="tiers" className="py-12 sm:py-20 md:py-28 bg-[#FAF9F7] border-b border-stone-200/60">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-14 items-start lg:items-center">
            
            {/* Left Column: Heading, Subtitle, 2 Modern Cards, & Trust Partner Bar */}
            <div className="lg:col-span-6 space-y-3.5 sm:space-y-4 lg:space-y-6 text-left">
              
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4f4f5] border border-stone-200/80 text-stone-800 text-xs font-semibold shadow-2xs">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                </span>
                <span>{isBn ? "ইকুইটি ও টিকিট ক্যালকুলেটর" : "Investment Tiers & Calculator"}</span>
              </span>

              <div className="space-y-2 sm:space-y-3">
                <h2 className="font-sans font-black text-2xl sm:text-4xl lg:text-[3.25rem] text-stone-950 tracking-tight leading-[1.12]">
                  {isBn ? (
                    <>
                      আপনার ইকুইটি ও<br />
                      <span className="text-[#EA580C]">রিটার্ন হিসেব করুন</span>
                    </>
                  ) : (
                    <>
                      Calculate Your<br />
                      Equity Allotment &amp;<br />
                      <span className="text-[#EA580C]">Returns.</span>
                    </>
                  )}
                </h2>

                <p className="text-stone-600 text-xs sm:text-sm sm:text-base leading-relaxed font-normal max-w-xl">
                  {isBn
                    ? "মুনতাজারের এঞ্জেল টিকিট সর্বনিম্ন ৳২০,০০০ BDT থেকে শুরু। ডানদিকের ইন্টারঅ্যাক্টিভ স্লাইডারে টিকিটের পরিমাণ নির্ধারণ করুন এবং রিয়েল-টাইম ইকুইটি ভ্যালুয়েশন ও পার্টনার সুবিধা পরীক্ষা করুন।"
                    : "Angel tickets start from ৳20,000 BDT. Drag the interactive slider to select your ticket quantity and inspect real-time equity allotment, dividend yields, and verified perks."}
                </p>
              </div>

              {/* 2 Sleek Feature Cards (Desktop Only) */}
              <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl">
                {/* Card 1 */}
                <div className="p-5 rounded-2xl bg-white border border-stone-200/70 space-y-2.5 shadow-2xs hover:border-orange-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center font-black text-xs">
                      50%
                    </div>
                    <span className="text-[10px] font-bold text-[#EA580C] bg-orange-50/80 px-2 py-0.5 rounded-full">
                      {isBn ? "আর্লি সিড অফার" : "Seed Round Discount"}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-stone-950">
                      {isBn ? "প্রি-ভ্যালুয়েশন বোনাস" : "Pre-Valuation Pricing"}
                    </h4>
                    <p className="text-[11px] text-stone-500 font-normal leading-relaxed mt-0.5">
                      {isBn
                        ? "ভ্যালুয়েশন বাড়ার আগেই সিড রাউন্ডে ৫০% সেভ করুন।"
                        : "Lock in ground-floor valuation before institutional VC round expansion."}
                    </p>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="p-5 rounded-2xl bg-white border border-stone-200/70 space-y-2.5 shadow-2xs hover:border-emerald-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-full">
                      {isBn ? "আইন ১৯৯৪" : "Act 1994"}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-stone-950">
                      {isBn ? "আরজেএসসি লিগ্যাল ডিড" : "RJSC Certified Deed"}
                    </h4>
                    <p className="text-[11px] text-stone-500 font-normal leading-relaxed mt-0.5">
                      {isBn
                        ? "কোম্পানি আইন ১৯৯৪ এর অধীনে রেজিস্টার্ড পার্টনারশিপ চুক্তি।"
                        : "Certified partner equity deed registered under Companies Act 1994."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Trust & Legal Logos Bar (Desktop Only) */}
              <div className="hidden lg:block max-w-xl pt-1">
                <TrustLogosCard />
              </div>

            </div>

            {/* Right Column: Interactive Pricing Slider Card */}
            <div className="lg:col-span-6 w-full">
              <InteractivePricingCard
                planName={isBn ? "এঞ্জেল ইকুইটি ইনভেস্টমেন্ট টিকিট" : "Angel Equity Investment Ticket"}
                planDescription={
                  isBn
                    ? "স্লাইডারটি টেনে আপনার টিকিটের পরিমাণ নির্ধারণ করুন।"
                    : "Drag the slider to select your ticket quantity."
                }
                pricePerUnit={20000}
                unitName={isBn ? "টিকিট" : "Ticket"}
                minUnits={1}
                maxUnits={20}
                initialUnits={1}
                features={[
                  isBn ? "অফিশিয়াল পার্টনার আইনি চুক্তি ও সনদপত্র" : "Official Partner Legal Contract & Certificate",
                  isBn ? "আমৃত্যু ১০০% ফ্রি প্ল্যাটফর্ম অ্যাক্সেস সুবিধা" : "Lifetime 100% Free Platform Access",
                  isBn ? "ত্রৈমাসিক অপারেশনাল ডিভিডেন্ড ও অডিট রিপোর্ট" : "Quarterly Operational Dividend & Audit Reports",
                  isBn ? "ভিআইপি প্রাইভেট ইনভেস্টর কমিউনিটি অ্যাক্সেস" : "VIP Private Investor Community Access",
                  isBn ? "ডিরেক্ট ফাউন্ডার অ্যাক্সেস ও অফিস আওয়ারস" : "Direct Founder Access & Office Hours",
                ]}
                ctaText={isBn ? "ইনভেস্টমেন্ট টিকিট বুক করুন →" : "BOOK INVESTMENT TICKET →"}
                currency="৳"
                highlighted={true}
              />
            </div>

          </div>

        </div>
      </section>

      {/* ── 24 INVESTOR FAQS SECTION ───────────────────────────── */}
      <section id="faq" className="py-24 md:py-32 bg-[#FAF9F7] border-b border-stone-200/60">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-3 mb-12">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4f4f5] border border-stone-200/80 text-stone-800 text-xs font-semibold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>{isBn ? "ইনভেস্টর ডিউ ডিলিজেন্স (২৪টি প্রশ্ন ও উত্তর)" : "Investor Due Diligence (24 Key Questions)"}</span>
              </span>
              <h2 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl text-stone-950 tracking-tight">
                {isBn ? "ইনভেস্টর সচরাচর জিজ্ঞাসিত প্রশ্নাবলী" : "Frequently Asked Questions"}
              </h2>
              <p className="text-stone-600 text-sm sm:text-base font-normal max-w-2xl mx-auto">
                {isBn
                  ? "কোম্পানি ভ্যালুয়েশন, আইনি সুরক্ষা, আরজেএসসি চুক্তিপত্র এবং পেআউট পলিসি সংক্রান্ত সমস্ত উত্তর।"
                  : "Everything you need to know about company valuation, legal protection, shareholding deeds, and returns."}
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto pt-4">
                <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={isBn ? "প্রশ্ন বা বিষয় দিয়ে খুঁজুন..." : "Search by keyword or question..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-stone-200 text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:border-[#EA580C] font-medium transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* FAQs 2-Column Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start pt-2">
              {/* Column 1 (Even Indexed Questions) */}
              <div className="space-y-4">
                {filteredFaqs
                  .map((faq, originalIndex) => ({ faq, originalIndex }))
                  .filter((_, idx) => idx % 2 === 0)
                  .map(({ faq, originalIndex }) => {
                    const isOpen = openFaq === originalIndex;
                    return (
                      <div
                        key={faq.q}
                        className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden transition-all duration-200 shadow-2xs hover:border-stone-300"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : originalIndex)}
                          className="w-full p-5 text-left flex items-center justify-between gap-3.5 cursor-pointer hover:bg-stone-50/50 transition-colors"
                        >
                          <span className="font-sans font-bold text-sm sm:text-base text-stone-900 leading-snug">
                            {faq.q}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-300 ${
                              isOpen ? "rotate-180 text-[#EA580C]" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-[#FAF9F7]/60 font-normal">
                                {faq.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
              </div>

              {/* Column 2 (Odd Indexed Questions) */}
              <div className="space-y-4">
                {filteredFaqs
                  .map((faq, originalIndex) => ({ faq, originalIndex }))
                  .filter((_, idx) => idx % 2 !== 0)
                  .map(({ faq, originalIndex }) => {
                    const isOpen = openFaq === originalIndex;
                    return (
                      <div
                        key={faq.q}
                        className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden transition-all duration-200 shadow-2xs hover:border-stone-300"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : originalIndex)}
                          className="w-full p-5 text-left flex items-center justify-between gap-3.5 cursor-pointer hover:bg-stone-50/50 transition-colors"
                        >
                          <span className="font-sans font-bold text-sm sm:text-base text-stone-900 leading-snug">
                            {faq.q}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-300 ${
                              isOpen ? "rotate-180 text-[#EA580C]" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-[#FAF9F7]/60 font-normal">
                                {faq.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── PITCH DECK REPORT DOWNLOAD MODAL ────────────────────── */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative border border-stone-200 shadow-2xl text-stone-900"
          >
            <button
              type="button"
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                {isBn ? "অফিশিয়াল ইনভেস্টর পেপারস" : "Official Pitch Deck Documents"}
              </span>
              <h3 className="font-sans font-extrabold text-2xl text-stone-950">
                {isBn ? "মুনতাজার ইনভেস্টর রিপোর্ট ও প্রেজেন্টেশন" : "Download Official Pitch Deck Bundle"}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed font-normal">
                {isBn
                  ? "নিচের অফিশিয়াল ৩টি পেপার থেকে আপনার প্রয়োজনীয় ফাইলটি সিলেক্ট করে সরাসরি ডাউনলোড করুন।"
                  : "Select from the 3 lawyer-vetted official files below to review Muntajar's project valuation & growth trajectory:"}
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="/downloads/data-presentation.pptx"
                download
                className="p-4 rounded-2xl bg-[#FAF9F7] hover:bg-stone-100 border border-stone-200 flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 group-hover:text-amber-600 transition-colors">
                      1. Data Presentation Deck (.pptx)
                    </h4>
                    <p className="text-[11px] text-stone-500 font-medium">Muntajar Financial & Market Valuation</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors shrink-0" />
              </a>

              <a
                href="/downloads/Muntajar-Global-Limited-Project-Profile.docx"
                download
                className="p-4 rounded-2xl bg-[#FAF9F7] hover:bg-stone-100 border border-stone-200 flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 group-hover:text-sky-600 transition-colors">
                      2. Official Project Profile (.docx)
                    </h4>
                    <p className="text-[11px] text-stone-500 font-medium">Full Company Registration & Ops Profile</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-stone-400 group-hover:text-sky-600 transition-colors shrink-0" />
              </a>

              <a
                href="/downloads/Porters-Theory-Evaluation-Muntajar.doc"
                download
                className="p-4 rounded-2xl bg-[#FAF9F7] hover:bg-stone-100 border border-stone-200 flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 group-hover:text-emerald-600 transition-colors">
                      3. Porter&apos;s Theory Evaluation (.doc)
                    </h4>
                    <p className="text-[11px] text-stone-500 font-medium">Competitive Advantage & Corridor Analysis</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 transition-colors shrink-0" />
              </a>
            </div>

            {/* Instant Download All 3 Files Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  const files = [
                    { url: "/downloads/data-presentation.pptx", name: "data-presentation.pptx" },
                    { url: "/downloads/Muntajar-Global-Limited-Project-Profile.docx", name: "Muntajar-Global-Limited-Project-Profile.docx" },
                    { url: "/downloads/Porters-Theory-Evaluation-Muntajar.doc", name: "Porters-Theory-Evaluation-Muntajar.doc" },
                  ];
                  files.forEach((file, index) => {
                    setTimeout(() => {
                      const a = document.createElement("a");
                      a.href = file.url;
                      a.download = file.name;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }, index * 350);
                  });
                }}
                className="w-full bg-stone-950 hover:bg-stone-800 text-white font-extrabold text-xs py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>{isBn ? "একসাথে সব ৩টি ফাইল ডাউনলোড করুন" : "Download All 3 Files (Bundle)"}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── FULLSCREEN VIDEO POPUP MODAL ── */}
      {showVideoModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 md:p-10 animate-in fade-in duration-200"
          onClick={() => setShowVideoModal(false)}
        >
          {/* Top Bar with Title and Close Button */}
          <div
            className="w-full max-w-5xl flex items-center justify-between pb-3 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C] animate-pulse" />
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                {isBn ? "মুনতাজার ফাউন্ডারের বার্তা" : "Founder's Message — Muntajar Manpower Ecosystem"}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowVideoModal(false)}
              className="p-2 text-stone-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all cursor-pointer select-none"
              aria-label="Close video"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Video Player Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={transition.fast}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 bg-black shadow-2xl"
          >
            <iframe
              src="https://www.youtube-nocookie.com/embed/2W8LBxb7K_M?autoplay=1&enablejsapi=1&rel=0&playsinline=1&modestbranding=1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
              title="Muntajar Founder Video"
            />
          </motion.div>
        </div>
      )}

    </div>
  );
}

export default InvestorsPageContent;
