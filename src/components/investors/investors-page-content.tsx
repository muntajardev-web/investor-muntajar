"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { transition } from "@/lib/motion";
import { CalendlyWidget } from "@/components/ui/calendly-widget";
import { Logos3 } from "@/components/ui/logos3";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Navbar } from "@/components/navigation/navbar";
import { InteractivePricingCard } from "@/components/ui/pricing";
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
      icon: Star,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200/80",
      title: "লাইফটাইম ফ্রি সাবস্ক্রিপশন",
      body: "মুনতাজারের প্রতিটি ইনভেস্টর এবং তাদের পরিবার উচ্চশিক্ষা, ক্যারিয়ার, এবং ভিসা গাইডেন্সের পূর্ণ প্ল্যাটফর্মে আমৃত্যু ১০০% বিনামূল্যে ফ্রি অ্যাক্সেস পাবেন।",
      tag: "আজীবন ফ্রি অ্যাক্সেস",
    },
    {
      icon: Share2,
      color: "text-sky-600",
      bg: "bg-sky-50",
      border: "border-sky-200/80",
      title: "রেফারেল রিওয়ার্ড প্রোগ্রাম",
      body: "আপনার পরিচিত বন্ধু, সহকর্মী বা স্বজনকে মুনতাজারে রেফার করলে প্রতিটি সফল যুক্তিতে আকর্ষণীয় তাৎক্ষণিক ক্যাশ বোনাস আর্ন করার সুযোগ।",
      tag: "প্রতি রেফারে আয়",
    },
    {
      icon: Trophy,
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-200/80",
      title: "মেগা গিভঅ্যাওয়ে সুবিধা",
      body: "ইনভেস্টরদের জন্য প্রতি ৩ মাস পর বিশেষ মেগা ক্যাশ প্রাইজ, প্রিমিয়াম গ্যাজেট, এবং এক্সক্লুসিভ টেকনোলজি ইভেন্টের ভিআইপি টিকিট পাস।",
      tag: "ত্রৈমাসিক গিভঅ্যাওয়ে",
    },
    {
      icon: Sparkles,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200/80",
      title: "ভিআইপি নেটওয়ার্ক ও পার্টনার সুবিধা",
      body: "মুনতাজারের আন্তর্জাতিক নেটওয়ার্ক, দ্রুত ফাইল প্রসেসিং এবং প্রিমিয়াম কনসালটেন্সি সেবায় ইনভেস্টরদের সর্বোচ্চ অগ্রাধিকার প্রদান।",
      tag: "ভিআইপি অগ্রাধিকার",
    },
    {
      icon: Zap,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200/80",
      title: "আর্লি ফিচার টেস্টিং",
      body: "যেকোনো নতুন ফিচার পাবলিসিটির আগেই বিটা টেস্টিং করার সুবিধা। আপনার মতামত সরাসরি মুনতাজারের প্রোডাক্ট রোডম্যাপ গঠনে ভূমিকা রাখবে।",
      tag: "বিটা অ্যাক্সেস",
    },
    {
      icon: Handshake,
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-200/80",
      title: "ফাউন্ডারদের সাথে সরাসরি সম্পর্ক",
      body: "ফাউন্ডারদের সাথে নিয়মিত ওয়ান-টু-ওয়ান মিটিং, ত্রৈমাসিক ফাইন্যান্সিয়াল আপডেট এবং স্ট্র্যাটেজিক সিদ্ধান্তে মতামত দেওয়ার সুযোগ।",
      tag: "ডিরেক্ট ফাউন্ডার অ্যাক্সেস",
    },
  ],
  en: [
    {
      icon: Star,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200/80",
      title: "Lifetime Free Subscription",
      body: "Every investor gets permanent free access to the full Muntajar platform — study abroad tools, visa guidance, job matching — for you and your family. No billing, ever.",
      tag: "Exclusive Access",
    },
    {
      icon: Share2,
      color: "text-sky-600",
      bg: "bg-sky-50",
      border: "border-sky-200/80",
      title: "Referral Rewards Program",
      body: "Refer a friend, family member, or colleague who joins — you earn instant referral bonuses for every successful introduction.",
      tag: "Earn Per Referral",
    },
    {
      icon: Trophy,
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-200/80",
      title: "Exclusive Giveaway Access",
      body: "Investors get priority entry into quarterly giveaways — including cash prizes, premium subscription bundles, partner perks, and event invites before they go public.",
      tag: "Quarterly Giveaways",
    },
    {
      icon: Sparkles,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200/80",
      title: "VIP Network & Partner Perks",
      body: "Gain priority access to Muntajar's global partner ecosystem, expedited service processing, and exclusive annual community invitations as the platform expands.",
      tag: "Partner Perks",
    },
    {
      icon: Zap,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200/80",
      title: "Early Feature Access",
      body: "Be the first to test and shape new features before launch. Your feedback directly influences the product roadmap — investor input is always on the table.",
      tag: "Beta Access",
    },
    {
      icon: Handshake,
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-200/80",
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
  const [searchQuery, setSearchQuery] = React.useState("");
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (showReportModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showReportModal]);

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
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-stone-800/80">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column (Hero Content & Pricing & 3 Action Buttons) */}
            <div className="md:col-span-6 lg:col-span-6 space-y-6 text-left">
              
              {/* Red Pill Tag */}
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-md bg-red-600 text-white text-[11px] font-black tracking-widest uppercase shadow-sm">
                  <Flame className="w-3.5 h-3.5 fill-white text-red-600" />
                  {isBn ? "সিড ইকুইটি রাউন্ড • শেষ তারিখ ১৫ আগস্ট ২০২৬" : "LIMITED SEED ROUND • ENDS AUG 15, 2026"}
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                {...fadeUp(0.12)}
                className={`font-sans font-black text-3xl sm:text-4xl lg:text-[3.25rem] leading-[1.12] text-white tracking-tight ${
                  isBn ? "font-solaimanlipi" : ""
                }`}
              >
                {isBn ? (
                  <>
                    বাংলাদেশের সর্বপ্রথম{" "}
                    <span className="text-amber-400 underline decoration-amber-500/50 decoration-wavy">
                      ম্যানপাওয়ার ইকোসিস্টেম।
                    </span>
                  </>
                ) : (
                  <>
                    First Ever{" "}
                    <span className="text-amber-400 underline decoration-amber-500/50 decoration-wavy">
                      Manpower Ecosystem
                    </span>{" "}
                    in Bangladesh.
                  </>
                )}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                {...fadeUp(0.16)}
                className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl font-medium"
              >
                {isBn ? (
                  <>
                    মুনতাজার কোনো সাধারণ স্টার্টআপ নয়; এটি উদীয়মান তরুণ ও প্রবাসীদের (NRBs) ভাগ্য পরিবর্তন, তাদের স্বপ্নকে বাস্তবে রূপদান এবং বিশ্বমঞ্চে বাংলাদেশের ভবিষ্যৎকে পুনর্গঠনের একটি আন্দোলন।
                  </>
                ) : (
                  <>
                    Muntajar is not just another startup; it&apos;s a movement to transform the fate of aspiring youth &amp; NRBs, empower their dreams, and reshape Bangladesh&apos;s future for the world.
                  </>
                )}
              </motion.p>

              {/* 7 Hero Bullet Points (Simple & Clean Typography) */}
              <motion.div {...fadeUp(0.20)} className="space-y-2 py-2 max-w-2xl">
                {[
                  isBn ? "Transforming Manpower Sector Digitally (ডিজিটাল প্রযুক্তির মাধ্যমে ম্যানপাওয়ার সেক্টরের রূপান্তর)।" : "Transforming Manpower Sector Digitally.",
                  isBn ? "AI-Powered & Fully Automated (এআই-চালিত ও সম্পূর্ণ অটোমেটেড প্ল্যাটফর্ম)।" : "AI-Powered & Fully Automated.",
                  isBn ? "Middleman-free Platform (দালাল ও মধ্যস্বত্বভোগী-মুক্ত প্ল্যাটফর্ম)।" : "Middleman-free Platform.",
                  isBn ? "Transparency (১০০% স্বচ্ছতা ও সরাসরি ট্র্যাকিং)।" : "Transparency.",
                  isBn ? "Candidates & Students can communicate directly with Recruiters / University Representatives (প্রার্থী ও শিক্ষার্থীরা সরাসরি রিক্রুটার এবং বিশ্ববিদ্যালয় প্রতিনিধিদের সাথে যোগাযোগ করতে পারেন)।" : "Candidates & Students can communicate directly with Recruiters / University Representatives.",
                  isBn ? "Cost Minimization up to 60% (প্রসেসিং খরচ ৬০% পর্যন্ত হ্রাস)।" : "Cost Minimization up to 60%",
                  isBn ? "No more Illegal Migration or unskilled migrants (অবৈধ মাইগ্রেশন ও দক্ষতাহীন অভিবাসন বন্ধের স্থায়ী সমাধান)।" : "No more Illegal Migration or unskilled migrants.",
                ].map((bullet, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-stone-200 py-0.5"
                  >
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{bullet}</span>
                  </div>
                ))}
              </motion.div>

              {/* Meta Date Row */}
              <motion.div {...fadeUp(0.22)} className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-400">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{isBn ? "অফার মেয়াদ: ১৫ আগস্ট ২০২৬ পর্যন্ত" : "Round 1 Valid till Aug 15, 2026"}</span>
              </motion.div>

              {/* Horizontal Line Divider */}
              <div className="w-full h-px bg-stone-800/90 my-4" />

              {/* Pricing Display & 3 Action Buttons Row */}
              <motion.div {...fadeUp(0.26)} className="space-y-4 pt-1">
                
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <span className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {isBn ? "BDT ২০,০০০" : "BDT 20,000"}
                  </span>
                  <span className="text-sm sm:text-lg font-bold text-stone-500 line-through">
                    {isBn ? "BDT ৪০,০০০" : "BDT 40,000"}
                  </span>
                  <span className="text-[10px] sm:text-xs font-extrabold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                    {isBn ? "৫০% আর্লি অফার" : "50% EARLY TICKETING"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 pt-2 w-full">
                  <a
                    href="https://chat.whatsapp.com/BuyZDTg3CSe89U1pnAbWgv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg cursor-pointer w-full sm:w-auto uppercase tracking-wide text-center"
                  >
                    <span>{isBn ? "ইনভেস্ট করুন ->" : "INVEST NOW ->"}</span>
                  </a>

                  <a
                    href="https://chat.whatsapp.com/BuyZDTg3CSe89U1pnAbWgv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 font-extrabold text-xs sm:text-sm px-5 py-3.5 rounded-xl transition-all cursor-pointer w-full sm:w-auto text-center"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{isBn ? "কমিউনিটি হোয়াটসঅ্যাপ" : "JOIN COMMUNITY"}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setShowReportModal(true)}
                    className="inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 font-extrabold text-xs sm:text-sm px-5 py-3.5 rounded-xl transition-all cursor-pointer w-full sm:w-auto text-center"
                  >
                    <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{isBn ? "পিচ ডেক দেখুন" : "VIEW PITCH DECK"}</span>
                  </button>
                </div>

              </motion.div>

              {/* Bottom Feature Badges */}
              <motion.div {...fadeUp(0.3)} className="pt-2 grid grid-cols-1 xs:grid-cols-2 sm:flex sm:flex-wrap gap-2.5 sm:gap-5 text-xs font-bold text-stone-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isBn ? "পার্টনারশিপ সুবিধা" : "Official Legal Contract"}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isBn ? "লাইফটাইম ফ্রি সাবস্ক্রিপশন" : "Free Lifetime Platform Access"}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isBn ? "কোয়ার্টারলি গিভঅ্যাওয়ে" : "Quarterly Giveaways"}</span>
                </span>
              </motion.div>

            </div>

            {/* Right Column: Embedded YouTube Pitch Video */}
            <div className="md:col-span-6 lg:col-span-6 relative flex justify-center md:justify-end w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={transition.slow}
                className="relative w-full max-w-[640px] aspect-video rounded-3xl overflow-hidden border border-stone-800 shadow-2xl bg-black"
              >
                <iframe
                  className="w-full h-full border-0"
                  src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1"
                  title="Muntajar Investor Pitch Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </motion.div>
            </div>

          </div>

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

      {/* ── MINIMALIST WHAT IS MUNTAJAR SECTION ───────────── */}
      <section className="py-20 md:py-28 bg-[#FAF9F7] border-b border-stone-200/60">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="space-y-8 max-w-4xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/90 border border-orange-200 text-orange-900 text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              {isBn ? "মুনতাজার পরিচিতি" : "WHAT IS MUNTAJAR?"}
            </span>

            <h2 className="font-sans font-black text-2xl sm:text-4xl lg:text-5xl text-stone-950 tracking-tight leading-[1.2]">
              {isBn
                ? "মুনতাজার কোনো সাধারণ স্টার্টআপ নয়; এটি উদীয়মান তরুণ ও প্রবাসীদের (NRBs) ভাগ্য পরিবর্তন, তাদের স্বপ্নকে বাস্তবে রূপদান এবং বিশ্বমঞ্চে বাংলাদেশের ভবিষ্যৎকে পুনর্গঠনের একটি আন্দোলন।"
                : "Muntajar is not just another startup; it’s a movement to transform the fate of aspiring youth & NRBs, empower their dreams, and reshape Bangladesh’s future for the world."}
            </h2>

            <p className="text-stone-700 text-lg sm:text-2xl leading-relaxed font-normal border-l-4 border-orange-500 pl-6 py-1">
              {isBn
                ? "মুনতাজার আন্তর্জাতিক শিক্ষা, বৈদেশিক কর্মসংস্থান এবং ইমিগ্রেশন প্রসেসিংকে কোনো মধ্যস্বত্বভোগী বা দালাল ছাড়া সম্পূর্ণ ডিজিটাল ও স্বচ্ছ করে তুলেছে। এআই ডকুমেন্ট প্রসেসিং এবং ডিরেক্ট ইনস্টিটিউশন কানেক্টিভিটির মাধ্যমে আমরা উচ্চশিক্ষা ও বৈশ্বিক ক্যারিয়ারের পথকে সবার জন্য সুগম করি।"
                : "Muntajar transforms international education, workforce migration, and visa processing by eliminating predatory middleman commissions. Built with direct institutional APIs and proprietary AI verification engines, we empower candidates with transparent global career pathways."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
                <span className="text-xs font-black text-orange-600 uppercase tracking-wider block">01 / DIRECT ACCESS</span>
                <h3 className="text-base font-extrabold text-stone-950">
                  {isBn ? "দালালমুক্ত সরাসরি সংযোগ" : "Zero Middleman Integrity"}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {isBn
                    ? "বিশ্ববিদ্যালয় এবং নিবন্ধিত বৈশ্বিক নিয়োগকর্তাদের সাথে সরাসরি সংযোগ।"
                    : "Direct API pipelines connecting applicants directly with accredited global institutions."}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
                <span className="text-xs font-black text-amber-600 uppercase tracking-wider block">02 / AI AUTOMATION</span>
                <h3 className="text-base font-extrabold text-stone-950">
                  {isBn ? "এআই ডকুমেন্ট যাচাইকরণ" : "Automated AI Compliance"}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {isBn
                    ? "একটি মাত্র ক্লিকে পাসপোর্ট অডিট ও পেপার প্রসেসিং স্বচ্ছতা।"
                    : "Instant passport extraction and visa eligibility scoring in under 60 seconds."}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
                <span className="text-xs font-black text-emerald-600 uppercase tracking-wider block">03 / LEGAL PROTECTION</span>
                <h3 className="text-base font-extrabold text-stone-950">
                  {isBn ? "আরজেএসসি চুক্তি ও আইনি সুরক্ষা" : "RJSC Shareholding Deed"}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {isBn
                    ? "আইনজীবী দ্বারা সার্টিফাইড প্রাইভেট ইকুইটি ও লভ্যাংশ অধিকার।"
                    : "Certified partner equity registered under the Companies Act 1994."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INVESTMENT TIERS & CALCULATOR 2-COLUMN SECTION ── */}
      <section id="tiers" className="py-20 md:py-28 bg-[#FAF9F7] border-b border-stone-200/60">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Heading, Subtitle & Value Proposition Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-900 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                {isBn ? "ইকুইটি ও টিকিট প্যাকেজ" : "INVESTMENT TIERS & CALCULATOR"}
              </span>

              <h2 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl text-stone-950 tracking-tight leading-tight">
                {isBn
                  ? "আপনার উপযোগী ইনভেস্টমেন্ট টিয়ার নির্বাচন করুন।"
                  : "Calculate Your Equity Allotment & Returns."}
              </h2>

              <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-normal">
                {isBn
                  ? "মুনতাজারের আর্লি এঞ্জেল টিকিট সর্বনিম্ন ২০,০০০ টাকা থেকে শুরু। ডানদিকের ইন্টারঅ্যাক্টিভ স্লাইডারে আপনার চাহিদামতো টিকিট সংখ্যা নির্ধারণ করে লাইভ ইনভেস্টমেন্ট ভ্যালুয়েশন এবং লাইফটাইম সুবিধাসমূহ পরীক্ষা করুন।"
                  : "Angel tickets start from ৳20,000 BDT. Drag the interactive slider on the right to select your ticket quantity and inspect real-time equity valuation and exclusive partner perks."}
              </p>

              {/* Key Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2 text-xs font-black text-orange-600 uppercase tracking-wider">
                    <Flame className="w-4 h-4 text-orange-600" />
                    <span>{isBn ? "৫০% আর্লি অফার" : "50% Early Ticketing"}</span>
                  </div>
                  <p className="text-xs text-stone-600 font-medium">
                    {isBn ? "রেগুলার ৪০,০০০ টাকার বিপরীতে আর্লি টিকিট মাত্র ২০,০০০ টাকা।" : "Save 50% during the seed round before valuation increases."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{isBn ? "আরজেএসসি চুক্তিপত্র" : "Official Legal Contract"}</span>
                  </div>
                  <p className="text-xs text-stone-600 font-medium">
                    {isBn ? "অভিজ্ঞ আইনজীবী দ্বারা সার্টিফাইড প্রাইভেট ইকুইটি পার্টনারশিপ এগ্রিমেন্ট।" : "Certified partner deed registered under Companies Act 1994."}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Pricing Slider Card in Brand Orange */}
            <div className="lg:col-span-6 w-full">
              <InteractivePricingCard
                planName={isBn ? "ইনভেস্টর এঞ্জেল টিকিট (Investor Angel Ticket)" : "Angel Equity Investment Ticket"}
                planDescription={
                  isBn
                    ? "স্লাইড করে টিকিট সংখ্যা পরিবর্তন করুন।"
                    : "Drag the slider to select your ticket quantity."
                }
                pricePerUnit={20000}
                unitName={isBn ? "টিকিট" : "Ticket"}
                minUnits={1}
                maxUnits={20}
                initialUnits={1}
                features={[
                  isBn ? "অফিশিয়াল পার্টনার চুক্তি ও আইনি রেজিস্ট্রি সার্টিফিকেট" : "Official Partner Legal Contract & Certificate",
                  isBn ? "আমৃত্যু ১০০% ফ্রি প্ল্যাটফর্ম লাইফটাইম অ্যাক্সেস" : "Lifetime 100% Free Platform Access",
                  isBn ? "ত্রৈমাসিক গ্রোথ, অডিটেড প্রফিট ও ডিভিডেন্ড শেয়ার" : "Quarterly Operational Dividend & Audit Reports",
                  isBn ? "ভিআইপি প্রাইভেট ইনভেস্টর কমিউনিটি ও নেটওয়ার্ক" : "VIP Private Investor Community Access",
                  isBn ? "ফাউন্ডারদের সাথে ওয়ান-টু-ওয়ান ডিসকাশন সুবিধা" : "Direct Founder Access & Office Hours",
                ]}
                ctaText={isBn ? "ইনভেস্টমেন্ট বুকিং করুন ->" : "BOOK INVESTMENT TICKET ->"}
                currency="৳"
                highlighted={true}
              />
            </div>

          </div>

        </div>
      </section>

      {/* ── PERKS SECTION ───────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-white border-b border-stone-200/60">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <span>{isBn ? "ইনভেস্টর ভ্যালু প্রপোজিশন" : "Investor Value Proposition"}</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                {isBn ? "কেন মুনতাজারে বিনিয়োগ করবেন?" : "Why Invest in Muntajar?"}
              </motion.h2>
            </div>
            <div className="lg:col-span-5">
              <motion.p {...fadeUp(0.15)} className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                {isBn
                  ? "মুনতাজারের প্রতিটি ইনভেস্টর দক্ষিণ এশিয়ার বৃহত্তম ইমিগ্রেশন ও এডুকেশন টেকনোলজি প্ল্যাটফর্মের কৌশলগত অংশীদার।"
                  : "Every Muntajar investor receives strategic growth benefits alongside direct participation in South Asia's migration tech platform."}
              </motion.p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {perks.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className={`rounded-3xl p-8 border ${p.border} bg-[#FAF9F7] flex flex-col justify-between space-y-5 hover:border-stone-300 transition-all duration-300 shadow-2xs`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl ${p.bg} border ${p.border} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${p.color}`} />
                      </div>
                      <span className={`px-3.5 py-1 rounded-full text-[11px] font-bold border ${p.bg} ${p.border} text-stone-800`}>
                        {p.tag}
                      </span>
                    </div>

                    <h3 className="font-sans font-extrabold text-xl text-stone-950">{p.title}</h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">{p.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MARKET STATS SECTION ────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-white border-b border-stone-200/60">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-16">
            <div className="lg:col-span-7 space-y-4">
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
                <span>{isBn ? "মার্কেট সাইজ ও পটেনশিয়াল" : "Market Size & Opportunity"}</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-stone-950 tracking-tight">
                {isBn ? "৩০ বিলিয়ন ডলারের বিশাল রেমিট্যান্স বাজার" : "A $30B+ Untapped Remittance Market"}
              </motion.h2>
            </div>
            <div className="lg:col-span-5">
              <motion.p {...fadeUp(0.15)} className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                {isBn
                  ? "বাংলাদেশ বিশ্বের অন্যতম প্রধান বৈশ্বিক মাইগ্রেশন ও আন্তর্জাতিক শিক্ষা করিডোর।"
                  : "Bangladesh is one of the largest global mobility and migration corridors in the world."}
              </motion.p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {marketStats.map((st) => (
              <div key={st.label} className="bg-[#FAF9F7] rounded-3xl p-7 border border-stone-200 space-y-3 shadow-2xs hover:border-amber-300 transition-all duration-300">
                <p className={`text-3xl sm:text-4xl font-extrabold ${st.color}`}>
                  <AnimatedCounter
                    to={st.num}
                    prefix={st.prefix}
                    suffix={st.suffix}
                    decimals={st.decimals}
                  />
                </p>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-semibold">{st.label}</p>
                <p className="text-[10px] text-stone-400 uppercase font-bold pt-2 border-t border-stone-200">
                  {isBn ? "সূত্র: " : "Source: "}{st.source}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 30 INVESTOR FAQS SECTION ───────────────────────────── */}
      <section id="faq" className="py-24 md:py-32 bg-[#FAF9F7] border-b border-stone-200/60">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-3 mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-extrabold uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                {isBn ? "ইনভেস্টর ডিউ ডিলিজেন্স (২৪টি প্রয়োজনীয় প্রশ্ন ও উত্তর)" : "Investor Due Diligence (24 Key Questions)"}
              </span>
              <h2 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl text-stone-950 tracking-tight">
                {isBn ? "ইনভেস্টর সচরাচর জিজ্ঞাসিত প্রশ্নাবলী" : "Frequently Asked Questions"}
              </h2>
              <p className="text-stone-600 text-sm sm:text-base font-normal">
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
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-stone-200 text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:border-amber-500 font-medium transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={faq.q}
                    className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden transition-all duration-200 shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/60 transition-colors"
                    >
                      <span className="font-sans font-bold text-sm sm:text-base text-stone-900 leading-snug">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-stone-500 shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-amber-600" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-[#FAF9F7]/50 font-normal">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
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

    </div>
  );
}

export default InvestorsPageContent;
