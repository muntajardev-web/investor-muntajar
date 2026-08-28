export const trustStats = [
  { value: 12000, suffix: "+", label: "Journeys guided" },
  { value: 45, suffix: "+", label: "Countries" },
  { value: 98, suffix: "%", label: "Client satisfaction" },
  { value: 0, label: "Hidden broker fees" },
];

export const problemPoints = [
  {
    id: "process",
    tab: "Hidden process",
    quote: "You were told to trust the process. Nobody showed you the process.",
    detail:
      "Millions of Bangladeshis navigate the overseas journey through WhatsApp forwards, broker offices, and word of mouth — with no single source of truth.",
  },
  {
    id: "advice",
    tab: "Biased advice",
    quote: "The advice always benefits whoever gave it.",
    detail:
      "Agencies recommend destinations that pay the highest commission — not the pathway that fits your skills, budget, or long-term goals.",
  },
  {
    id: "support",
    tab: "Ghost support",
    quote: "After payment, the support disappears.",
    detail:
      "Documents get lost. Timelines go silent. You're left guessing whether your application is moving forward or stuck in a drawer.",
  },
];

export const whyPillars = [
  {
    title: "Strategic admissions intelligence",
    description:
      "Map programs, deadlines, and scholarship eligibility using our data-backed playbooks and alumni insights.",
  },
  {
    title: "Career-ready portfolio",
    description:
      "Structured training sprints and mentorship ensure every learner presents a global-grade profile.",
  },
  {
    title: "Lifecycle support",
    description:
      "From application prep to visa readiness and onboarding, our team stays with you through every milestone.",
  },
];

export const pathways = [
  {
    id: "students",
    label: "Students",
    segment: "T2",
    headline: "Build your education abroad",
    description:
      "University admissions, scholarships, visa guidance, and long-term career planning — with support for you and your family.",
    outcomes: ["University admissions", "Scholarship guidance", "Visa coaching", "Parent support"],
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80",
    imageAlt: "Student studying with books and laptop in natural light",
  },
  {
    id: "professionals",
    label: "Skilled Professionals",
    segment: "T1",
    headline: "Advance your global career",
    description:
      "European PR pathways, international careers, portfolio development, interview prep, and ethical recruiter matching.",
    outcomes: ["Career coaching", "PR pathways", "Interview prep", "Recruiter matching"],
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80",
    imageAlt: "Professional woman in a modern office environment",
  },
  {
    id: "workforce",
    label: "Workforce",
    segment: "T3",
    headline: "Verified work abroad",
    description:
      "Legal processing, trade training, language preparation, and post-arrival support for skilled and semi-skilled workers.",
    outcomes: ["Verified jobs", "Trade training", "Language prep", "Post-arrival support"],
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&q=80",
    imageAlt: "Skilled worker in a professional training environment",
  },
];

export const journeySteps = [
  {
    step: "01",
    title: "Create profile",
    description:
      "Sign up and tell us your goals, background, and target destinations in minutes.",
  },
  {
    step: "02",
    title: "Choose service",
    description:
      "Pick the track that fits — skilled professionals, study abroad, or workforce.",
  },
  {
    step: "03",
    title: "Upload documents",
    description:
      "Securely share your documents so our advisors can verify and prepare your file.",
  },
  {
    step: "04",
    title: "Get guided",
    description:
      "Follow a transparent, milestone-based roadmap with mentors until you land abroad.",
  },
];

export type PathwayTag = "Study" | "Work" | "Visa";

export const destinations = [
  {
    id: "japan",
    flagCode: "jp",
    name: "Japan",
    region: "East Asia",
    description:
      "Specified Skilled Worker visas open across 12 sectors",
    pathways: ["Study", "Work", "Visa"] as PathwayTag[],
  },
  {
    id: "germany",
    flagCode: "de",
    name: "Germany",
    region: "Europe",
    description:
      "Tuition-free public universities + Opportunity Card route",
    pathways: ["Study", "Work", "Visa"] as PathwayTag[],
  },
  {
    id: "uk",
    flagCode: "gb",
    name: "United Kingdom",
    region: "Europe",
    description: "2-year Graduate Route post-study work visa",
    pathways: ["Study", "Visa"] as PathwayTag[],
  },
  {
    id: "malaysia",
    flagCode: "my",
    name: "Malaysia",
    region: "Southeast Asia",
    description: "Affordable degrees + active workforce corridors",
    pathways: ["Study", "Work"] as PathwayTag[],
  },
  {
    id: "canada",
    flagCode: "ca",
    name: "Canada",
    region: "North America",
    description: "Post-Graduation Work Permit + PR pathways",
    pathways: ["Study", "Work", "Visa"] as PathwayTag[],
  },
  {
    id: "australia",
    flagCode: "au",
    name: "Australia",
    region: "Oceania",
    description: "Temporary Graduate visa for international graduates",
    pathways: ["Study", "Work", "Visa"] as PathwayTag[],
  },
  {
    id: "qatar",
    flagCode: "qa",
    name: "Qatar",
    region: "Middle East",
    description: "Reformed labour law with wage protection",
    pathways: ["Work", "Visa"] as PathwayTag[],
  },
  {
    id: "uae",
    flagCode: "ae",
    name: "United Arab Emirates",
    region: "Middle East",
    description: "Golden Visa and diverse job markets",
    pathways: ["Work", "Visa"] as PathwayTag[],
  },
  {
    id: "south-korea",
    flagCode: "kr",
    name: "South Korea",
    region: "East Asia",
    description: "EPS workforce route + university scholarships",
    pathways: ["Study", "Work", "Visa"] as PathwayTag[],
  },
  {
    id: "poland",
    flagCode: "pl",
    name: "Poland",
    region: "Europe",
    description: "Growing EU hub for study and work",
    pathways: ["Study", "Work", "Visa"] as PathwayTag[],
  },
];

import { images } from "@/lib/images";

export const successStories = [
  {
    id: "ayesha",
    initials: "AR",
    photo: images.stories.ayesha,
    name: "Ayesha Rahman",
    role: "Fulbright Scholar, Columbia University",
    pathway: "T2 → Columbia University, USA",
    quote:
      "Muntajar guided me from shortlisting programs to preparing for embassy interviews. Their mentors kept every milestone on track and helped unlock a full scholarship.",
  },
  {
    id: "tanvir",
    initials: "TC",
    photo: images.stories.tanvir,
    name: "Tanvir Chowdhury",
    role: "AI Research Fellow, TU Delft",
    pathway: "T2 → TU Delft, Netherlands",
    quote:
      "From SOP workshops to visa readiness, the team made the European admissions journey transparent. I could focus on research while they handled compliance.",
  },
  {
    id: "sumaiya",
    initials: "SA",
    photo: images.stories.sumaiya,
    name: "Sumaiya Akter",
    role: "MSc Public Health, University of Manchester",
    pathway: "T2 → University of Manchester, UK",
    quote:
      "I almost paid a broker a huge fee before finding Muntajar. They built my UK shortlist around my budget, coached my CAS and student-visa interview, and negotiated funding.",
  },
  {
    id: "rakibul",
    initials: "RH",
    photo: images.stories.rakibul,
    name: "Rakibul Hasan",
    role: "Certified Welder, deployed to Qatar",
    pathway: "T3 → Qatar workforce",
    quote:
      "As a tradesperson I worried about scams and wage deductions. Muntajar's Elite track put me through a government-certified bootcamp, reviewed my contract under labour law, and stayed in touch after deployment.",
  },
  {
    id: "nusrat",
    initials: "NJ",
    photo: images.stories.nusrat,
    name: "Nusrat Jahan",
    role: "Software Engineer, Berlin SaaS",
    pathway: "T1 → Berlin, Germany",
    quote:
      "The German Opportunity Card route felt impossible until Muntajar rebuilt my CV to EU standards, coached my interviews, and helped me sign a Berlin job offer with full transparency.",
  },
];

export const pricingPlans = [
  {
    id: "elite",
    name: "Elite",
    segment: "T3 — Workforce",
    price: "৳15,000",
    period: "monthly",
    description:
      "Training checklist and visa prep for semi-skilled workers moving abroad.",
    features: [
      "Accredited training pathway guidance",
      "Visa and medical compliance coaching",
      "Settlement prep with remittance planning",
    ],
    cta: "Enroll teams in Elite",
    highlighted: false,
    accent: "amber",
  },
  {
    id: "starter",
    name: "Starter",
    segment: "T1 — Professionals",
    price: "৳20,000",
    period: "monthly",
    description:
      "Guided onboarding for skilled professionals pursuing overseas roles.",
    features: [
      "Skills audit + tailored sprint plan",
      "Portfolio, LinkedIn, and CV makeovers",
      "Mock interviews with analytics dashboard",
    ],
    cta: "Activate Starter plan",
    highlighted: true,
    accent: "orange",
  },
  {
    id: "proguide",
    name: "ProGuide",
    segment: "T2 — Students",
    price: "৳20,000",
    period: "monthly",
    description:
      "University application support with scholarship tracking and advisor access.",
    features: [
      "AI-assisted university shortlist and ROI insights",
      "Scholarship and funding guidance",
      "SOP mentorship and visa-ready application coaching",
    ],
    cta: "Start ProGuide journey",
    highlighted: false,
    accent: "stone",
  },
];

export const faqItems = [
  {
    question: "Is Muntajar a visa agency?",
    answer:
      "No. Muntajar is a global mobility platform. We don't sell visas — we provide clarity, guidance, and digital tools to manage your entire overseas journey. The visa or admission is the outcome of a well-planned pathway.",
  },
  {
    question: "How is this different from traditional brokers?",
    answer:
      "Brokers operate offline with hidden fees and misaligned incentives. Muntajar is fully digital, fully transparent, and future-focused. Every fee is visible. Every milestone is tracked. Your advisor stays with you throughout.",
  },
  {
    question: "Which countries do you support?",
    answer:
      "We support pathways to 45+ countries including Canada, UK, Germany, Australia, UAE, Norway, and more. We recommend destinations based on your profile and goals — not commission rates.",
  },
  {
    question: "Can my parents follow my progress?",
    answer:
      "Yes. Family members can access a read-only dashboard to see milestone progress, upcoming deadlines, and advisor communications — reducing anxiety for everyone involved.",
  },
  {
    question: "What if my application is rejected?",
    answer:
      "Your advisor will review the outcome, explain the reasons, and help you plan next steps — whether that's reapplying, adjusting your pathway, or exploring alternatives. We don't disappear after payment.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Plans start from ৳15,000/month for workforce (Elite), and ৳20,000/month for professionals (Starter) and students (ProGuide). All fees are disclosed upfront — no hidden broker charges or surprise payments mid-process.",
  },
];
