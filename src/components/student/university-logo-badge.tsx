"use client";

import React from "react";
import { GraduationCap } from "lucide-react";

interface UniversityLogoProps {
  name: string;
  logoUrl?: string | null;
  className?: string;
  size?: number;
}

const REAL_UNIVERSITY_LOGOS: Record<string, { logo: string; domain: string; fallbackBg: string; text: string }> = {
  "University of Toronto": {
    logo: "https://logo.clearbit.com/utoronto.ca",
    domain: "utoronto.ca",
    fallbackBg: "bg-[#002A5C]",
    text: "text-white",
  },
  "Technical University of Munich": {
    logo: "https://logo.clearbit.com/tum.de",
    domain: "tum.de",
    fallbackBg: "bg-[#3070B3]",
    text: "text-white",
  },
  "Technical University of Munich (TUM)": {
    logo: "https://logo.clearbit.com/tum.de",
    domain: "tum.de",
    fallbackBg: "bg-[#3070B3]",
    text: "text-white",
  },
  "University of British Columbia": {
    logo: "https://logo.clearbit.com/ubc.ca",
    domain: "ubc.ca",
    fallbackBg: "bg-[#002145]",
    text: "text-white",
  },
  "University of Oxford": {
    logo: "https://logo.clearbit.com/ox.ac.uk",
    domain: "ox.ac.uk",
    fallbackBg: "bg-[#002147]",
    text: "text-white",
  },
  "University of Cambridge": {
    logo: "https://logo.clearbit.com/cam.ac.uk",
    domain: "cam.ac.uk",
    fallbackBg: "bg-[#A3C1AD]",
    text: "text-stone-900",
  },
  "Harvard University": {
    logo: "https://logo.clearbit.com/harvard.edu",
    domain: "harvard.edu",
    fallbackBg: "bg-[#A51C30]",
    text: "text-white",
  },
  "Stanford University": {
    logo: "https://logo.clearbit.com/stanford.edu",
    domain: "stanford.edu",
    fallbackBg: "bg-[#8C1515]",
    text: "text-white",
  },
  "Imperial College London": {
    logo: "https://logo.clearbit.com/imperial.ac.uk",
    domain: "imperial.ac.uk",
    fallbackBg: "bg-[#002B49]",
    text: "text-white",
  },
};

export function UniversityLogoBadge({
  name,
  logoUrl,
  className = "w-14 h-14",
}: UniversityLogoProps) {
  const [imgError, setImgError] = React.useState(false);
  const preset = REAL_UNIVERSITY_LOGOS[name];

  const primaryLogoSrc = logoUrl || preset?.logo || (preset ? `https://www.google.com/s2/favicons?domain=${preset.domain}&sz=128` : null);

  if (primaryLogoSrc && !imgError) {
    return (
      <div
        className={`rounded-2xl bg-white p-2 flex items-center justify-center border border-stone-200/90 shadow-2xs overflow-hidden shrink-0 ${className}`}
        title={name}
      >
        <img
          src={primaryLogoSrc}
          alt={name}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  // Fallback branded emblem badge
  const fallbackBg = preset?.fallbackBg || "bg-stone-950";
  const textColor = preset?.text || "text-white";
  const emblemText = name.split(" ").map(w => w[0]).join("").slice(0, 4).toUpperCase();

  return (
    <div
      className={`rounded-2xl flex flex-col items-center justify-center p-1 font-black shadow-2xs border border-stone-200 shrink-0 ${fallbackBg} ${textColor} ${className}`}
      title={name}
    >
      <GraduationCap className="w-4 h-4 opacity-90 mb-0.5" />
      <span className="text-[9px] font-black uppercase tracking-wider leading-none">{emblemText}</span>
    </div>
  );
}
