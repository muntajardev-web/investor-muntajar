import type { PathwayTag } from "@/lib/homepage-data";

export interface DestinationDetail {
  id: string;
  flagCode: string;
  name: string;
  region: string;
  shortDescription: string;
  fullDescription: string;
  pathways: PathwayTag[];
}

export const destinationDetails: DestinationDetail[] = [
  {
    id: "japan",
    flagCode: "jp",
    name: "Japan",
    region: "East Asia",
    shortDescription:
      "Specified Skilled Worker visas open across 12 sectors",
    fullDescription:
      "Japan combines world-class universities with the Specified Skilled Worker (SSW) route, making it a top destination for Bangladeshi students and skilled workers alike.",
    pathways: ["Study", "Work", "Visa"],
  },
  {
    id: "germany",
    flagCode: "de",
    name: "Germany",
    region: "Europe",
    shortDescription:
      "Tuition-free public universities + Opportunity Card route",
    fullDescription:
      "Germany offers tuition-free public universities and the new Opportunity Card (Chancenkarte), opening doors for students and skilled professionals from Bangladesh.",
    pathways: ["Study", "Work", "Visa"],
  },
  {
    id: "uk",
    flagCode: "gb",
    name: "United Kingdom",
    region: "Europe",
    shortDescription: "2-year Graduate Route post-study work visa",
    fullDescription:
      "The UK remains a flagship study-abroad destination, with the Graduate Route giving international students up to two years to work after graduation.",
    pathways: ["Study", "Visa"],
  },
  {
    id: "malaysia",
    flagCode: "my",
    name: "Malaysia",
    region: "Southeast Asia",
    shortDescription: "Affordable degrees + active workforce corridors",
    fullDescription:
      "Malaysia offers affordable, English-medium degrees and well-established workforce corridors, making it an accessible first step abroad for many Bangladeshis.",
    pathways: ["Study", "Work"],
  },
  {
    id: "canada",
    flagCode: "ca",
    name: "Canada",
    region: "North America",
    shortDescription: "Post-Graduation Work Permit + PR pathways",
    fullDescription:
      "Canada pairs globally ranked institutions with clear permanent-residency pathways via the Post-Graduation Work Permit and Express Entry.",
    pathways: ["Study", "Work", "Visa"],
  },
  {
    id: "australia",
    flagCode: "au",
    name: "Australia",
    region: "Oceania",
    shortDescription: "Temporary Graduate visa for international graduates",
    fullDescription:
      "Australia offers high-quality education and the Temporary Graduate (subclass 485) visa, letting graduates gain local work experience.",
    pathways: ["Study", "Work", "Visa"],
  },
  {
    id: "qatar",
    flagCode: "qa",
    name: "Qatar",
    region: "Middle East",
    shortDescription: "Reformed labour law with wage protection",
    fullDescription:
      "Qatar's reformed labour system, including the Wage Protection System, supports ethical overseas employment for Bangladeshi workers.",
    pathways: ["Work", "Visa"],
  },
  {
    id: "uae",
    flagCode: "ae",
    name: "United Arab Emirates",
    region: "Middle East",
    shortDescription: "Golden Visa and diverse job markets",
    fullDescription:
      "The UAE offers a broad range of opportunities across construction, hospitality, healthcare, and services, with long-term Golden Visa options for select roles.",
    pathways: ["Work", "Visa"],
  },
  {
    id: "south-korea",
    flagCode: "kr",
    name: "South Korea",
    region: "East Asia",
    shortDescription: "EPS workforce route + university scholarships",
    fullDescription:
      "South Korea welcomes Bangladeshi workers through the Employment Permit System (EPS) and offers strong scholarship support for international students.",
    pathways: ["Study", "Work", "Visa"],
  },
  {
    id: "poland",
    flagCode: "pl",
    name: "Poland",
    region: "Europe",
    shortDescription: "Growing EU hub for study and work",
    fullDescription:
      "Poland is a fast-growing EU destination with affordable tuition and expanding workforce demand across logistics, manufacturing, and IT.",
    pathways: ["Study", "Work", "Visa"],
  },
];

export const guideArticles = [
  {
    id: "study-abroad-guide",
    category: "Study Abroad",
    readTime: "9 min read",
    title: "Study Abroad from Bangladesh: Complete 2026 Guide",
    excerpt:
      "Studying abroad is one of the biggest investments a Bangladeshi family can make — and one of the most rewarding when planned well. This guide walks you through every step.",
    href: "/guides/study-abroad-from-bangladesh",
  },
  {
    id: "overseas-jobs-guide",
    category: "Overseas Jobs",
    readTime: "8 min read",
    title: "Overseas Jobs from Bangladesh: How to Work Abroad Safely",
    excerpt:
      "Every year hundreds of thousands of Bangladeshis go abroad for work, but many lose money to unlicensed agents, sign unfair contracts, or face wage deductions overseas.",
    href: "/guides/overseas-jobs-from-bangladesh",
  },
  {
    id: "uk-visa-guide",
    category: "Visa Guides",
    readTime: "8 min read",
    title: "UK Student Visa from Bangladesh: Step-by-Step",
    excerpt:
      "The United Kingdom remains a flagship study destination for Bangladeshi students, and the Graduate Route lets you work for up to two years after you finish.",
    href: "/guides/uk-student-visa",
  },
  {
    id: "germany-visa-guide",
    category: "Visa Guides",
    readTime: "8 min read",
    title: "Germany Study Visa from Bangladesh: 2026 Guide",
    excerpt:
      "Germany offers tuition-free or low-fee public universities and a clear path from study to skilled work, which makes it one of the best-value destinations for Bangladeshi students.",
    href: "/guides/germany-study-visa",
  },
  {
    id: "safe-migration-guide",
    category: "Safe Migration",
    readTime: "7 min read",
    title: "Safe Migration & Avoiding Recruitment Scams",
    excerpt:
      "Migration can change a family's future, but recruitment and visa scams cost Bangladeshis crores every year. Fake agents, guaranteed-visa promises, and unfair contracts are rampant.",
    href: "/guides/safe-migration",
  },
];

export const faqCategories = [
  {
    title: "Study Abroad",
    items: [
      {
        question: "Which countries can Muntajar help me study in?",
        answer:
          "We support study pathways to 45+ countries including the UK, Canada, Germany, Australia, Malaysia, Japan, and more. We recommend destinations based on your profile, budget, and career goals — not commission rates.",
      },
      {
        question: "Can you help me find scholarships?",
        answer:
          "Yes. Our ProGuide track includes scholarship viability analysis, application coaching, and negotiation support. On average, students in our last intake secured $18k in scholarship funding.",
      },
      {
        question: "Do you help with IELTS or other language tests?",
        answer:
          "We partner with language prep providers and offer mock tests tailored to your target universities and visa requirements.",
      },
    ],
  },
  {
    title: "Overseas Jobs",
    items: [
      {
        question: "Do I need an existing job offer to start?",
        answer:
          "Not for our T1 professional track — we help you surface opportunities and prepare for interviews. For T3 workforce placements, we work with verified employers and licensed partners.",
      },
      {
        question: "Which markets do you place workers in?",
        answer:
          "GCC countries (UAE, Qatar, Saudi Arabia), Malaysia, Europe (Germany, Poland), and select APAC markets. All placements follow ILO-aligned contracts.",
      },
      {
        question: "Do you work with sub-agents?",
        answer:
          "We only collaborate with licensed agencies and perform annual compliance checks on every partner.",
      },
    ],
  },
  {
    title: "Visa",
    items: [
      {
        question: "Do you provide visa guidance?",
        answer:
          "Yes. Visa readiness is built into every track — from document preparation and mock interviews to compliance desk support for CAS and embassy submissions.",
      },
      {
        question: "What is your visa success rate?",
        answer:
          "Our T2 student track achieved 92% visa approval in the last intake. Success depends on honest documentation, proper preparation, and realistic pathway selection.",
      },
    ],
  },
  {
    title: "Documents",
    items: [
      {
        question: "How do I share my documents securely?",
        answer:
          "All documents are uploaded through the Muntajar platform with encrypted storage. Advisors review, verify, and track every file in one place — no WhatsApp chaos.",
      },
      {
        question: "What documents do I need to get started?",
        answer:
          "It depends on your track. Generally: passport, academic transcripts, CV, and proof of funds. Your advisor will provide a personalised checklist after your first consultation.",
      },
    ],
  },
  {
    title: "Payments",
    items: [
      {
        question: "How much do your services cost?",
        answer:
          "Plans start from ৳15,000/month (Elite workforce) and ৳20,000/month (Starter professionals, ProGuide students). All fees are disclosed upfront with no hidden broker charges.",
      },
      {
        question: "Can I pay with bKash?",
        answer:
          "Yes. We accept bKash, bank transfer, and other local payment methods. Payment schedules are transparent and agreed before you commit.",
      },
      {
        question: "Are there any hidden commissions?",
        answer:
          "Never. We disclose all costs upfront and highlight any university agent commissions. Our incentive is your success, not selling you the highest-commission destination.",
      },
    ],
  },
  {
    title: "General",
    items: [
      {
        question: "Who is Muntajar for?",
        answer:
          "Students, skilled professionals, and workforce talent in Bangladesh who want transparent, broker-free guidance for studying, working, or migrating abroad.",
      },
      {
        question: "How quickly can I get started?",
        answer:
          "Book a free consultation and share your profile. Most clients begin their sprint within 1–2 weeks of the initial session.",
      },
      {
        question: "Where is Muntajar based?",
        answer:
          "We are headquartered in Taltola, Khilgaon, Dhaka, Bangladesh — serving clients nationwide with digital platform access and in-person advisory sessions.",
      },
    ],
  },
];
