export interface ServiceAudience {
  title: string;
  description: string;
}

export interface ServiceModule {
  title: string;
  description: string;
  deliverables: string[];
}

export interface ServiceTimeline {
  period: string;
  title: string;
  description: string;
}

export interface ServiceTrack {
  id: string;
  slug: string;
  segment: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  ctaPrimary: string;
  ctaSecondary: string;
  ctaPlan: string;
  audiences: ServiceAudience[];
  included: string[];
  stats: string[];
  modules: ServiceModule[];
  timeline: ServiceTimeline[];
  faqs: { question: string; answer: string }[];
}

export const serviceTracks: Record<string, ServiceTrack> = {
  "study-abroad": {
    id: "t2",
    slug: "study-abroad",
    segment: "T2 — Students (Study Abroad)",
    title: "T2 — Students (Study Abroad)",
    subtitle: "From shortlist to scholarship",
    description:
      "AI-powered university lists, SOP workshops, and visa-ready playbooks that de-risk every application decision.",
    highlights: [
      "Offered seats at 120+ partner universities",
      "In-house compliance desk for CAS/visa documentation",
    ],
    ctaPrimary: "Talk to an advisor",
    ctaSecondary: "Download programme deck",
    ctaPlan: "Start ProGuide journey",
    audiences: [
      {
        title: "Undergraduate applicants",
        description:
          "Bangladeshi students finishing HSC/A Levels seeking guided admission abroad.",
      },
      {
        title: "Graduate hopefuls",
        description:
          "STEM, business, and creative majors targeting scholarships in North America, UK, EU, and Australia.",
      },
      {
        title: "Parents & guardians",
        description:
          "Families wanting transparent budgeting, guardianship, and settlement planning.",
      },
    ],
    included: [
      "University shortlist + ROI insights",
      "Scholarship and funding guidance",
      "SOP mentorship and application coaching",
    ],
    stats: [
      "92% visa approval across last intake",
      "Average $18k scholarship negotiated per student",
      "Dedicated counselors in UK, Canada, and Australian corridors",
    ],
    modules: [
      {
        title: "Profile & University Strategy",
        description:
          "Academic review, budget planning, and AI-assisted university fit mapping.",
        deliverables: [
          "Tiered university shortlist",
          "Scholarship viability matrix",
          "Budget and ROI planner",
        ],
      },
      {
        title: "Application Studio",
        description:
          "Statement of purpose clinics, LOR coaching, and document readiness checks.",
        deliverables: [
          "Polished SOP drafts",
          "Referee briefing packs",
          "Document upload checklist",
        ],
      },
      {
        title: "Visa & Pre-departure",
        description:
          "Mock visa interviews, accommodation guidance, and settlement bootcamp.",
        deliverables: [
          "Visa interview scripts",
          "Accommodation shortlist",
          "Arrival & guardian handbook",
        ],
      },
    ],
    timeline: [
      {
        period: "Months 1–2",
        title: "Profile building",
        description:
          "Exams planning, shortlist finalisation, and scholarship targeting with counsellors.",
      },
      {
        period: "Months 3–4",
        title: "Application execution",
        description:
          "SOP writing cycles, document notarisation, and portal submissions.",
      },
      {
        period: "Months 5–6",
        title: "Visa & onboarding",
        description:
          "Pre-visa verification, biometrics support, and pre-departure parent workshops.",
      },
    ],
    faqs: [
      {
        question: "Can you help with IELTS or language tests?",
        answer:
          "Yes. We bundle language prep partners and mock tests tailored to your target universities.",
      },
      {
        question: "Do you charge hidden commission?",
        answer:
          "No hidden fees. We disclose all costs upfront and highlight any agent commissions from universities.",
      },
      {
        question: "Do you arrange accommodation?",
        answer:
          "We provide curated housing options and connect you with community mentors, but final booking stays with the family.",
      },
    ],
  },
  "skilled-professionals": {
    id: "t1",
    slug: "skilled-professionals",
    segment: "T1 — Skilled Professionals",
    title: "T1 — Skilled Professionals",
    subtitle: "Career acceleration for top performers",
    description:
      "Upskilling, portfolio polish, and recruiter matchmaking so Bangladesh's best talent lands global offers.",
    highlights: [
      "90% of participants move from shortlist to final interview",
      "Partners include HSBC, Unilever, and leading SaaS scale-ups",
    ],
    ctaPrimary: "Talk to an advisor",
    ctaSecondary: "Download programme deck",
    ctaPlan: "Activate Starter plan",
    audiences: [
      {
        title: "Mid-career specialists",
        description:
          "5–10 years of experience looking to break into regional leadership roles.",
      },
      {
        title: "Product & tech leads",
        description:
          "Engineers, PMs, and designers targeting remote-first and relocation-ready teams.",
      },
      {
        title: "Returning diaspora",
        description:
          "Bangladesh-born professionals re-entering the global market after a break.",
      },
    ],
    included: [
      "Skills audit + tailored sprint plan",
      "Portfolio/LinkedIn/CV makeovers",
      "Mock interviews with analytics dashboard",
    ],
    stats: [
      "Avg. 6–9 month turnaround from sprint to offer",
      "Interview-ready GitHub/Behance/portfolio assets",
      "Matched with vetted employers across the Middle East, Europe, and APAC",
    ],
    modules: [
      {
        title: "Diagnostic + Market Map",
        description:
          "360° review of skills, achievements, and target geographies to craft the sprint roadmap.",
        deliverables: [
          "Global benchmarking report",
          "Sprint plan with KPIs",
          "Shortlist of priority companies",
        ],
      },
      {
        title: "Brand & Portfolio Lab",
        description:
          "Hands-on coaching to rebuild CVs, portfolios, and LinkedIn profiles to pass global screening.",
        deliverables: [
          "ATS-ready CV",
          "Optimised LinkedIn presence",
          "Case-study rich portfolio",
        ],
      },
      {
        title: "Interview & Offer Sprint",
        description:
          "Mock interviews, salary benchmarking, and negotiation support until offer signing.",
        deliverables: [
          "Interview analytics dashboard",
          "Salary negotiation script",
          "Signed offer playbook",
        ],
      },
    ],
    timeline: [
      {
        period: "Weeks 1–2",
        title: "Diagnostic + sprint design",
        description:
          "Kick-off, assessment, and goal setting with the lead coach and recruiter pod.",
      },
      {
        period: "Weeks 3–6",
        title: "Brand overhaul",
        description:
          "Portfolio production sprints, reference curation, and employer outreach warm-up.",
      },
      {
        period: "Weeks 7–12",
        title: "Interview runway",
        description:
          "Live interview practice, offer negotiation, and relocation planning.",
      },
    ],
    faqs: [
      {
        question: "Do I need an existing overseas offer?",
        answer:
          "No. We help you surface opportunities, prepare for interviews, and negotiate offers with our partner network.",
      },
      {
        question: "How much time do I need per week?",
        answer:
          "Expect 4–6 hours weekly for workshops, mentor sessions, and portfolio work during the active sprint.",
      },
      {
        question: "Can employers sponsor this track?",
        answer:
          "Yes. We offer employer-side retainers for cohorts, including white-labelled onboarding support.",
      },
    ],
  },
  workforce: {
    id: "t3",
    slug: "workforce",
    segment: "T3 — Workforce",
    title: "T3 — Workforce",
    subtitle: "Ethical mobility for the workforce",
    description:
      "Compliant processing, trade training, and OnBoard support that prioritise dignity and long-term success.",
    highlights: [
      "ILO-compliant contracts for every placement",
      "Training with government-certified institutes",
    ],
    ctaPrimary: "Talk to an advisor",
    ctaSecondary: "Download programme deck",
    ctaPlan: "Enroll teams in Elite",
    audiences: [
      {
        title: "Recruiting partners",
        description:
          "Government agencies and licensed recruiters seeking ethical overseas placement.",
      },
      {
        title: "Skilled tradespeople",
        description:
          "Electricians, welders, healthcare aides, and hospitality staff preparing for GCC, EU, and Asian markets.",
      },
      {
        title: "Employer consortia",
        description:
          "Groups abroad needing verified talent pipelines with retention support.",
      },
    ],
    included: [
      "Trade skills + language bootcamps",
      "Transparent processing with legal partners",
      "Placement + post-landing support",
    ],
    stats: [
      "Zero hidden fees or wage deductions",
      "Average 45-day processing once paperwork is greenlit",
      "On-ground welfare teams in KSA, UAE, and Malaysia",
    ],
    modules: [
      {
        title: "Talent Identification",
        description:
          "Community outreach, aptitude tests, and documentation readiness checks in Bangladesh.",
        deliverables: [
          "Verified candidate database",
          "Skills gap analysis",
          "Document compliance pack",
        ],
      },
      {
        title: "Training & Compliance",
        description:
          "Trade-specific bootcamps, language prep, and legal briefings with partner law firms.",
        deliverables: [
          "Certification & trade badges",
          "Language proficiency reports",
          "Contract legal review",
        ],
      },
      {
        title: "Deployment & Welfare",
        description:
          "Flight logistics, arrival support, and welfare monitoring with host-country teams.",
        deliverables: [
          "Travel & insurance kit",
          "On-ground welfare check-ins",
          "Retention analytics dashboard",
        ],
      },
    ],
    timeline: [
      {
        period: "Weeks 1–3",
        title: "Mobilisation",
        description:
          "Candidate sourcing, document verification, and orientation with employers.",
      },
      {
        period: "Weeks 4–8",
        title: "Training",
        description:
          "Bootcamp delivery, safety briefings, and compliance audits with partner institutes.",
      },
      {
        period: "Weeks 9–12",
        title: "Deployment",
        description:
          "Visa stamping, travel, and on-arrival welfare follow-ups with host teams.",
      },
    ],
    faqs: [
      {
        question: "Do you work with sub-agents?",
        answer:
          "We only collaborate with licensed agencies and perform compliance checks on every partner annually.",
      },
      {
        question: "How do you ensure worker welfare?",
        answer:
          "Our OnBoard team performs scheduled check-ins, provides helplines, and escalates issues with employers immediately.",
      },
      {
        question: "Can you support enterprise-scale deployments?",
        answer:
          "Yes. We design multi-year pipelines with recruitment, training, and retention baked into service-level agreements.",
      },
    ],
  },
};

export function getServiceTrack(slug: string): ServiceTrack | undefined {
  return serviceTracks[slug];
}
