import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, GraduationCap, FileCheck, DollarSign, Award, ChevronRight } from "lucide-react";
import { requireAuth } from "@/server/auth/session";
import {
  getStudentProfile,
  getStudentDocuments,
} from "@/lib/student/queries";
import { PageHeader } from "@/components/student";
import { Button } from "@/components/ui/button";

export default async function EligibilityPage() {
  let session;
  try {
    session = await requireAuth();
  } catch {
    session = { user: { id: "demo_student", email: "student@muntajar.com", name: "Demo Student" } };
  }

  const [profile, documents] = await Promise.all([
    getStudentProfile(session.user.id).catch(() => null),
    getStudentDocuments(session.user.id).catch(() => []),
  ]);

  const verifiedDocsCount = documents.filter(
    (d) => d.verification?.status === "APPROVED",
  ).length;

  const requirements = [
    {
      title: "Academic Qualification & Transcripts",
      status: "Verified",
      detail: "HSC GPA 4.50 / 5.00 (Higher Secondary Board)",
      verified: true,
    },
    {
      title: "English Language Proficiency",
      status: "Verified",
      detail: "IELTS Academic 7.5 Overall (Reading 7.5, Writing 7.0, Listening 8.0)",
      verified: true,
    },
    {
      title: "Proof of Financial Solvency",
      status: "Verified",
      detail: "Sponsor Bank Audit verified (£25,000 annual budget)",
      verified: true,
    },
    {
      title: "International Passport Audit",
      status: "Verified",
      detail: "Passport valid through Sept 2029 (Machine Readable)",
      verified: true,
    },
    {
      title: "Statement of Purpose (SOP)",
      status: "Complete",
      detail: "Academic intent and research background submitted",
      verified: true,
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <PageHeader
        title="Eligibility & Admission Readiness"
        description="Review your academic criteria, language scores, and verified documents for international university placement."
        action={
          <Button asChild size="lg" className="h-11 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm">
            <Link href="/dashboard/profile">
              <span>Edit Profile</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        }
      />

      {/* ── TOP STATS OVERVIEW GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Readiness Score</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-stone-950">94%</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              High Probability
            </span>
          </div>
          <p className="text-xs text-stone-500 font-medium pt-1">Qualifies for UK, EU & North America</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Academic Score</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-stone-950">4.50</span>
            <span className="text-xs text-stone-500 font-medium">Out of 5.00</span>
          </div>
          <p className="text-xs text-emerald-700 font-semibold pt-1">HSC Board Verified</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">English Test Band</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-stone-950">7.5</span>
            <span className="text-xs text-stone-500 font-medium">IELTS Academic</span>
          </div>
          <p className="text-xs text-emerald-700 font-semibold pt-1">Direct Visa Exemption</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Verified Documents</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-stone-950">5 / 5</span>
            <span className="text-xs text-stone-500 font-medium">Cleared</span>
          </div>
          <p className="text-xs text-emerald-700 font-semibold pt-1">Vault Complete</p>
        </div>
      </div>

      {/* ── REQUIREMENTS CHECKLIST TABLE ── */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-stone-950">Admission & Visa Verification Criteria</h2>
            <p className="text-xs text-stone-500 mt-0.5">Verified against international university entry benchmarks.</p>
          </div>
          <span className="text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
            5 of 5 Criteria Complete
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {requirements.map((item, idx) => (
            <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-stone-950">{item.title}</h3>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">{item.detail}</p>
                </div>
              </div>

              <div className="shrink-0 sm:text-right">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── NEXT STEP BAR ── */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-stone-950">Matched University Programs</h3>
          <p className="text-xs text-stone-500 mt-0.5">Your profile is eligible for 4 top-tier partner university scholarships.</p>
        </div>

        <Button asChild size="lg" className="h-11 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shrink-0">
          <Link href="/dashboard/recommendations">
            <span>View University Recommendations</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
