"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Upload, FileText, X, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/* ─────────────────────────────────────────────────────────────
   STEP DEFINITIONS
   ───────────────────────────────────────────────────────────── */

const STEPS = [
  { id: "curriculum", label: "Curriculum" },
  { id: "documents", label: "Documents" },
  { id: "country", label: "Destination" },
  { id: "pathway", label: "Pathway" },
  { id: "profile", label: "Profile" },
] as const;

/* ─────────────────────────────────────────────────────────────
   CURRICULUM DATA
   ───────────────────────────────────────────────────────────── */

const CURRICULA = [
  {
    id: "bangladesh",
    label: "Bangladesh National Curriculum",
    description: "SSC + HSC Board Examinations",
    flag: "🇧🇩",
    documents: [
      "SSC Transcript / Marksheet",
      "HSC Transcript / Marksheet",
      "SSC Certificate",
      "HSC Certificate",
    ],
  },
  {
    id: "cambridge",
    label: "Cambridge International",
    description: "O Levels + A Levels (IGCSE)",
    flag: "🇬🇧",
    documents: [
      "O Level Results (IGCSE)",
      "A Level Results",
      "Cambridge Certificate",
    ],
  },
  {
    id: "ib",
    label: "IB Diploma Programme",
    description: "International Baccalaureate",
    flag: "🌐",
    documents: [
      "IB Diploma Transcript",
      "IB Results / Score Report",
    ],
  },
  {
    id: "american",
    label: "American High School Diploma",
    description: "US High School Transcript & GPA",
    flag: "🇺🇸",
    documents: [
      "High School Transcript",
      "SAT / ACT Score Report",
      "Diploma Certificate",
    ],
  },
  {
    id: "indian",
    label: "Indian Curriculum (CBSE / ICSE)",
    description: "Class 10th & 12th Board Results",
    flag: "🇮🇳",
    documents: [
      "Class 10th Marksheet",
      "Class 12th Marksheet",
      "Board Certificate",
    ],
  },
  {
    id: "other",
    label: "Other Curriculum / Bachelor's",
    description: "International High School or University Degree",
    flag: "🌍",
    documents: [
      "Academic Transcript",
      "Degree Certificate / Diploma",
      "Grading Scale Document",
    ],
  },
] as const;

/* ─────────────────────────────────────────────────────────────
   DESTINATION COUNTRIES
   ───────────────────────────────────────────────────────────── */

const COUNTRIES = [
  { code: "US", label: "Study in USA", hint: "Top universities, strong STEM and business programs", flag: "us" },
  { code: "CA", label: "Study in Canada", hint: "Post-study work routes and welcoming campuses", flag: "ca" },
  { code: "GB", label: "Study in UK", hint: "World-ranked universities and shorter degrees", flag: "gb" },
  { code: "AU", label: "Study in Australia", hint: "Quality education with lifestyle and work options", flag: "au" },
  { code: "DE", label: "Study in Germany", hint: "Tuition-free public universities, strong engineering", flag: "de" },
  { code: "NL", label: "Study in Netherlands", hint: "English-taught programs and innovation hubs", flag: "nl" },
] as const;

/* ─────────────────────────────────────────────────────────────
   PATHWAYS & SUBJECTS
   ───────────────────────────────────────────────────────────── */

const PATHWAYS = [
  { value: "BACHELOR", label: "Bachelor's degree", hint: "Undergraduate study after HSC / A-Levels" },
  { value: "MASTER", label: "Master's degree", hint: "Postgraduate specialization after a bachelor's" },
  { value: "FOUNDATION", label: "Foundation / pathway", hint: "Prep year before a full degree" },
  { value: "PHD", label: "PhD / research", hint: "Doctoral research programs" },
] as const;

const SUBJECTS = [
  "Computer Science", "Business", "Engineering", "Data Science",
  "Artificial Intelligence", "Cyber Security", "Nursing", "Law",
  "Medicine", "Pharmacy", "Architecture", "Economics",
] as const;

/* ─────────────────────────────────────────────────────────────
   FILE UPLOAD ROW COMPONENT
   ───────────────────────────────────────────────────────────── */

function UploadSlot({
  label,
  file,
  onSelect,
  onRemove,
}: {
  label: string;
  file: File | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
}) {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f) onSelect(f);
    },
    [onSelect],
  );

  return (
    <div className="rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/60 p-5 hover:border-stone-300 transition-all">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            file ? "bg-emerald-50 text-emerald-600" : "bg-stone-100 text-stone-400",
          )}>
            {file ? <FileText className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-stone-800 truncate">{label}</p>
            {file ? (
              <p className="text-xs text-emerald-600 font-medium truncate">{file.name}</p>
            ) : (
              <p className="text-xs text-stone-400">PDF, JPG, or PNG (max 10 MB)</p>
            )}
          </div>
        </div>

        {file ? (
          <button
            type="button"
            onClick={onRemove}
            className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-100 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer transition-colors shrink-0 shadow-2xs"
          >
            Choose file
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onSelect(f);
              }}
            />
          </label>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────────── */

export function StudentOnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Curriculum
  const [selectedCurriculum, setSelectedCurriculum] = useState<string | null>(null);

  // Step 2: Documents
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({});

  // Step 3: Country
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  // Step 4: Pathway
  const [degreeLevel, setDegreeLevel] = useState("");
  const [preferredSubjects, setPreferredSubjects] = useState<string[]>([]);

  // Step 5: Profile (GPA, IELTS, etc.)
  const [gpa, setGpa] = useState("");
  const [ielts, setIelts] = useState("");
  const [toefl, setToefl] = useState("");
  const [nationality, setNationality] = useState("Bangladeshi");
  const [budget, setBudget] = useState("");
  const [budgetCurrency, setBudgetCurrency] = useState("USD");

  const curriculum = CURRICULA.find((c) => c.id === selectedCurriculum);

  function canContinue() {
    if (step === 0) return !!selectedCurriculum;
    if (step === 1) return true; // Documents are optional
    if (step === 2) return selectedCountries.length > 0;
    if (step === 3) return !!degreeLevel && preferredSubjects.length > 0;
    if (step === 4) return !!gpa && (!!ielts || !!toefl) && !!budget;
    return false;
  }

  function next() {
    if (!canContinue()) {
      if (step === 0) setError("Please select your curriculum.");
      else if (step === 2) setError("Please choose at least one destination country.");
      else if (step === 3) setError("Please choose a pathway and at least one subject.");
      else if (step === 4) setError("Please complete your GPA, English score, and budget.");
      return;
    }
    setError(null);

    if (step === STEPS.length - 1) {
      void finish();
      return;
    }

    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(0, s - 1));
  }

  async function finish() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          board: selectedCurriculum,
          degreeLevel,
          preferredCourses: preferredSubjects,
          targetCountries: selectedCountries,
          gpa: gpa ? parseFloat(gpa) : undefined,
          gpaScale: 5,
          nationality: nationality || undefined,
          ieltsOverall: ielts ? parseFloat(ielts) : undefined,
          toeflScore: toefl ? parseInt(toefl, 10) : undefined,
          budget: budget ? parseFloat(budget) : undefined,
          budgetCurrency: budgetCurrency || "USD",
        }),
      });

      if (!res.ok) {
        toast.error("Could not save your profile. Try again.");
        return;
      }

      // Upload documents
      const filesToUpload = Object.entries(uploadedFiles).filter(([, f]) => f !== null);
      for (const [docName, file] of filesToUpload) {
        if (!file) continue;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("documentType", docName);
        try {
          await fetch("/api/documents/upload", { method: "POST", body: formData });
        } catch {
          // Continue even if one upload fails
        }
      }

      toast.success("Profile saved — matching universities next!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  }

  const toggleCountry = (code: string) => {
    setSelectedCountries((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
    setError(null);
  };

  const toggleSubject = (subject: string) => {
    setPreferredSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject],
    );
    setError(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ── TOP NAVIGATION BAR (same alignment as homepage) ── */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/60 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <nav className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center shrink-0 select-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt="Muntajar"
                width={140}
                height={34}
                className="h-6 sm:h-7 w-auto"
              />
            </Link>

            <div className="flex items-center gap-3">
              <span className="text-sm text-stone-500 font-medium">
                Step {step + 1} of {STEPS.length}
              </span>
              <Link
                href="/"
                className="text-xs font-bold text-stone-600 hover:text-stone-900 px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors"
              >
                Exit
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* ── MAIN CONTENT (same max-width + padding as homepage) ── */}
      <div className="pt-20 md:pt-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl mx-auto py-8 sm:py-12 lg:py-16">
            
            {/* ── STEP PROGRESS BAR ── */}
            <nav className="mb-10 sm:mb-14" aria-label="Onboarding progress">
              <ol className="grid grid-cols-5 gap-1 w-full">
                {STEPS.map((s, index) => {
                  const done = index < step;
                  const active = index === step;
                  return (
                    <li key={s.id} className="min-w-0">
                      <div className="flex items-center">
                        <span
                          className={cn(
                            "relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all",
                            done
                              ? "bg-emerald-500 text-white"
                              : active
                                ? "bg-stone-950 text-white"
                                : "border-2 border-stone-200 bg-white text-stone-400",
                          )}
                        >
                          {done ? <Check className="h-4 w-4" /> : index + 1}
                        </span>
                        {index < STEPS.length - 1 && (
                          <span
                            className={cn(
                              "mx-1.5 h-px min-w-0 flex-1",
                              done ? "bg-emerald-300" : "bg-stone-200",
                            )}
                          />
                        )}
                      </div>
                      <p
                        className={cn(
                          "mt-2 truncate text-xs font-medium leading-tight",
                          done
                            ? "text-emerald-600"
                            : active
                              ? "text-stone-900 font-bold"
                              : "text-stone-400",
                        )}
                      >
                        {s.label}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </nav>

            {/* ── ERROR BANNER ── */}
            {error && (
              <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 font-medium">
                {error}
              </div>
            )}

            {/* ════════════════════════════════════════════════════════
               STEP 1: CURRICULUM SELECTION (3×2 GRID)
               ════════════════════════════════════════════════════════ */}
            {step === 0 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                    What curriculum did you study?
                  </h1>
                  <p className="text-sm sm:text-base text-stone-500 font-medium">
                    Select your secondary education system to display required academic transcripts.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {CURRICULA.map((c) => {
                    const active = selectedCurriculum === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedCurriculum(c.id);
                          setError(null);
                        }}
                        className={cn(
                          "relative group flex items-start gap-3 rounded-2xl border-2 p-5 text-left transition-all cursor-pointer",
                          active
                            ? "border-emerald-500 bg-emerald-50/40 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.15)]"
                            : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50",
                        )}
                      >
                        <span className="text-2xl shrink-0 mt-0.5">{c.flag}</span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              "block text-sm font-bold leading-tight",
                              active ? "text-stone-950" : "text-stone-800",
                            )}
                          >
                            {c.label}
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-stone-500">
                            {c.description}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                            active
                              ? "border-emerald-500 bg-emerald-500"
                              : "border-stone-300 bg-white group-hover:border-stone-400",
                          )}
                        >
                          {active && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════
               STEP 2: DOCUMENT UPLOAD
               ════════════════════════════════════════════════════════ */}
            {step === 1 && curriculum && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                    Upload your documents
                  </h1>
                  <p className="text-sm sm:text-base text-stone-500 font-medium">
                    Based on your <strong className="text-stone-800">{curriculum.label}</strong> curriculum, please upload the following documents. You can skip and upload later.
                  </p>
                </div>

                <div className="space-y-3">
                  {curriculum.documents.map((doc) => (
                    <UploadSlot
                      key={doc}
                      label={doc}
                      file={uploadedFiles[doc] ?? null}
                      onSelect={(file) =>
                        setUploadedFiles((prev) => ({ ...prev, [doc]: file }))
                      }
                      onRemove={() =>
                        setUploadedFiles((prev) => ({ ...prev, [doc]: null }))
                      }
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                  <span className="shrink-0">💡</span>
                  <span>You can always upload or replace documents later from your dashboard.</span>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════
               STEP 3: DESTINATION COUNTRY
               ════════════════════════════════════════════════════════ */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                    Where do you want to study?
                  </h1>
                  <p className="text-sm sm:text-base text-stone-500 font-medium">
                    Select one or more destination countries. We&apos;ll match universities that fit your profile.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {COUNTRIES.map((c) => {
                    const active = selectedCountries.includes(c.code);
                    return (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => toggleCountry(c.code)}
                        className={cn(
                          "group flex items-start gap-3 rounded-2xl border-2 p-5 text-left transition-all cursor-pointer",
                          active
                            ? "border-stone-900 bg-stone-50 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]"
                            : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50",
                        )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://flagcdn.com/w80/${c.flag}.png`}
                          alt=""
                          width={36}
                          height={24}
                          className="mt-0.5 h-6 w-9 rounded-sm object-cover shrink-0"
                        />
                        <span className="min-w-0 flex-1">
                          <span className={cn(
                            "block text-sm font-bold leading-tight",
                            active ? "text-stone-950" : "text-stone-800",
                          )}>
                            {c.label}
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-stone-500">
                            {c.hint}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                            active
                              ? "border-stone-900 bg-stone-900"
                              : "border-stone-300 bg-white group-hover:border-stone-400",
                          )}
                        >
                          {active && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════
               STEP 4: PATHWAY + SUBJECT
               ════════════════════════════════════════════════════════ */}
            {step === 3 && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                    Choose your pathway
                  </h1>
                  <p className="text-sm sm:text-base text-stone-500 font-medium">
                    What level of study are you aiming for?
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PATHWAYS.map((p) => {
                    const active = degreeLevel === p.value;
                    return (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => {
                          setDegreeLevel(p.value);
                          setError(null);
                        }}
                        className={cn(
                          "group flex items-start gap-3 rounded-2xl border-2 p-5 text-left transition-all cursor-pointer",
                          active
                            ? "border-orange-500 bg-orange-50/40"
                            : "border-stone-200 bg-white hover:border-stone-300",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                            active
                              ? "border-orange-500 bg-orange-500"
                              : "border-stone-300 bg-white group-hover:border-stone-400",
                          )}
                        >
                          {active && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={cn(
                            "block text-sm font-bold",
                            active ? "text-stone-950" : "text-stone-800",
                          )}>
                            {p.label}
                          </span>
                          <span className="mt-1 block text-xs text-stone-500">{p.hint}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <p className="mb-3 text-sm font-bold text-stone-800">
                    Preferred subjects
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECTS.map((subject) => {
                      const active = preferredSubjects.includes(subject);
                      return (
                        <button
                          key={subject}
                          type="button"
                          onClick={() => toggleSubject(subject)}
                          className={cn(
                            "rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors cursor-pointer",
                            active
                              ? "border-orange-500 bg-orange-500 text-white"
                              : "border-stone-200 bg-white text-stone-600 hover:border-stone-300",
                          )}
                        >
                          {subject}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════
               STEP 5: PROFILE (GPA, IELTS, BUDGET)
               ════════════════════════════════════════════════════════ */}
            {step === 4 && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                    Your academic profile
                  </h1>
                  <p className="text-sm sm:text-base text-stone-500 font-medium">
                    We use your grades, English scores, and budget to match universities you can realistically apply to.
                  </p>
                </div>

                <div className="rounded-2xl border-2 border-stone-200 bg-stone-50/60 p-6 sm:p-8 space-y-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="ob-gpa" className="text-sm font-bold text-stone-800">GPA / HSC GPA</label>
                      <input
                        id="ob-gpa"
                        type="number"
                        step="0.01"
                        min="0"
                        max="5"
                        value={gpa}
                        onChange={(e) => setGpa(e.target.value)}
                        placeholder="e.g. 4.5"
                        className="w-full h-12 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="ob-ielts" className="text-sm font-bold text-stone-800">IELTS overall</label>
                      <input
                        id="ob-ielts"
                        type="number"
                        step="0.5"
                        min="0"
                        max="9"
                        value={ielts}
                        onChange={(e) => setIelts(e.target.value)}
                        placeholder="e.g. 6.5"
                        className="w-full h-12 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="ob-toefl" className="text-sm font-bold text-stone-800">TOEFL (optional)</label>
                      <input
                        id="ob-toefl"
                        type="number"
                        min="0"
                        max="120"
                        value={toefl}
                        onChange={(e) => setToefl(e.target.value)}
                        placeholder="e.g. 90"
                        className="w-full h-12 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="ob-nationality" className="text-sm font-bold text-stone-800">Nationality</label>
                      <input
                        id="ob-nationality"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        className="w-full h-12 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
                      />
                    </div>
                  </div>

                  <div className="border-t border-stone-200 pt-5">
                    <p className="mb-4 text-sm font-bold text-stone-800">Annual budget</p>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="ob-budget" className="text-xs font-medium text-stone-500">Amount</label>
                        <input
                          id="ob-budget"
                          type="number"
                          min="0"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          placeholder="30000"
                          className="w-full h-12 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="ob-currency" className="text-xs font-medium text-stone-500">Currency</label>
                        <input
                          id="ob-currency"
                          value={budgetCurrency}
                          onChange={(e) => setBudgetCurrency(e.target.value.toUpperCase().slice(0, 3))}
                          maxLength={3}
                          className="w-full h-12 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
                        />
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-stone-400">
                      Include tuition and living costs for one year. You can refine this later.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── NAVIGATION BUTTONS ── */}
            <div className="mt-10 sm:mt-14 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between border-t border-stone-100 pt-8">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={back}
                  disabled={saving}
                  className="h-12 min-w-[140px] rounded-xl border-2 border-stone-200 bg-white px-8 text-sm font-bold text-stone-700 transition-colors hover:bg-stone-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={next}
                disabled={saving}
                className="h-12 min-w-[180px] rounded-xl bg-stone-950 px-10 text-sm font-bold text-white transition-colors hover:bg-stone-800 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : step === STEPS.length - 1 ? (
                  <>
                    Complete Profile
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : step === 1 ? (
                  <>
                    {Object.values(uploadedFiles).some(Boolean) ? "Continue" : "Skip for now"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
