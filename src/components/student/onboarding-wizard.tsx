"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { Check, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const PENDING_KEY = "muntajar_onboarding_draft";

const STEPS = [
  { id: "country", label: "Country" },
  { id: "pathway", label: "Pathway" },
  { id: "profile", label: "Profile" },
  { id: "budget", label: "Budget" },
  { id: "account", label: "Account" },
  { id: "payment", label: "Payment" },
] as const;

const PLANS = [
  {
    id: "proguide" as const,
    name: "ProGuide",
    price: "৳20,000",
    period: "/ month",
    hint: "Best for study abroad — shortlist, scholarships, and advisor support.",
  },
  {
    id: "starter" as const,
    name: "Starter",
    price: "৳20,000",
    period: "/ month",
    hint: "For skilled professionals pursuing overseas roles.",
  },
  {
    id: "elite" as const,
    name: "Elite",
    price: "৳15,000",
    period: "/ month",
    hint: "Workforce training and visa prep pathway.",
  },
];

const COUNTRIES = [
  {
    code: "US",
    label: "Study in USA",
    hint: "Top universities, strong STEM and business programs",
    flag: "us",
  },
  {
    code: "CA",
    label: "Study in Canada",
    hint: "Post-study work routes and welcoming campuses",
    flag: "ca",
  },
  {
    code: "GB",
    label: "Study in UK",
    hint: "World-ranked universities and shorter degrees",
    flag: "gb",
  },
  {
    code: "AU",
    label: "Study in Australia",
    hint: "Quality education with lifestyle and work options",
    flag: "au",
  },
] as const;

const PATHWAYS = [
  {
    value: "BACHELOR",
    label: "Bachelor's degree",
    hint: "Undergraduate study after HSC / A-Levels",
  },
  {
    value: "MASTER",
    label: "Master's degree",
    hint: "Postgraduate specialization after a bachelor's",
  },
  {
    value: "FOUNDATION",
    label: "Foundation / pathway",
    hint: "Prep year before a full degree",
  },
  {
    value: "PHD",
    label: "PhD / research",
    hint: "Doctoral research programs",
  },
] as const;

const SUBJECTS = [
  "Computer Science",
  "Business",
  "Engineering",
  "Data Science",
  "Artificial Intelligence",
  "Cyber Security",
  "Nursing",
  "Law",
] as const;

interface OnboardingWizardProps {
  initial?: {
    degreeLevel?: string | null;
    preferredCourses?: string[];
    targetCountries?: string[];
    gpa?: number | null;
    board?: string | null;
    nationality?: string | null;
    ieltsOverall?: number | null;
    toeflScore?: number | null;
    budget?: number | null;
    budgetCurrency?: string | null;
  } | null;
  /** Jump straight to payment when profile is done but unpaid */
  startAtPayment?: boolean;
}

type FormState = {
  targetCountries: string[];
  degreeLevel: string;
  preferredCourses: string[];
  gpa: string;
  board: string;
  nationality: string;
  ieltsOverall: string;
  toeflScore: string;
  budget: string;
  budgetCurrency: string;
};

function RadioCard({
  active,
  title,
  description,
  trailing,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  trailing?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-start gap-4 rounded-2xl border-2 px-4 py-4 text-left transition-all sm:px-5",
        active
          ? "border-orange-500 bg-orange-50 shadow-[inset_0_0_0_1px_rgba(249,115,22,0.2)]"
          : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50",
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
        <span
          className={cn(
            "block text-base font-semibold",
            active ? "text-stone-950" : "text-stone-800",
          )}
        >
          {title}
        </span>
        <span className="mt-1 block text-sm leading-relaxed text-stone-500">
          {description}
        </span>
      </span>
      {trailing}
    </button>
  );
}

function LeftPanelArt({ step }: { step: number }) {
  const accents = [
    "from-sky-200/80 via-[#f6f5f2] to-orange-100/70",
    "from-amber-100/80 via-[#f6f5f2] to-emerald-100/60",
    "from-orange-100/70 via-[#f6f5f2] to-stone-200/80",
    "from-emerald-100/70 via-[#f6f5f2] to-sky-100/70",
    "from-orange-200/60 via-[#f6f5f2] to-amber-50",
  ];

  return (
    <div
      className={cn(
        "relative mt-auto overflow-hidden rounded-3xl bg-gradient-to-br p-7",
        accents[step] ?? accents[0],
      )}
    >
      <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/40" />
      <div className="absolute -bottom-10 left-10 h-28 w-28 rounded-full bg-orange-400/15" />
      <div className="relative space-y-4">
        <div className="flex gap-2">
          {COUNTRIES.slice(0, 4).map((c) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={c.code}
              src={`https://flagcdn.com/w80/${c.flag}.png`}
              alt=""
              width={40}
              height={28}
              className="h-7 w-10 rounded-md object-cover ring-1 ring-stone-900/5"
            />
          ))}
        </div>
        <p className="max-w-[16rem] text-sm font-medium leading-relaxed text-stone-700">
          Honest matches based on your destination, pathway, academics, and
          budget — no broker pressure.
        </p>
      </div>
    </div>
  );
}

export function OnboardingWizard({
  initial,
  startAtPayment = false,
}: OnboardingWizardProps) {
  const router = useRouter();
  let isSignedIn = false;
  let isLoaded = true;
  let setActive: any = null;
  let signUpLoaded = true;
  let signUp: any = null;
  let signInLoaded = true;
  let signIn: any = null;

  try {
    const auth = useAuth();
    const clerk = useClerk();
    const signUpRes = useSignUp();
    const signInRes = useSignIn();
    isSignedIn = auth.isSignedIn ?? false;
    isLoaded = auth.isLoaded ?? true;
    setActive = clerk.setActive;
    signUpLoaded = signUpRes.isLoaded ?? true;
    signUp = signUpRes.signUp;
    signInLoaded = signInRes.isLoaded ?? true;
    signIn = signInRes.signIn;
  } catch {
    // ClerkProvider is bypassed when placeholder key is used
  }
  const autoSubmitted = useRef(false);
  const [step, setStep] = useState(() => (startAtPayment ? 5 : 0));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [needsVerify, setNeedsVerify] = useState(false);
  const [mode, setMode] = useState<"sign-up" | "sign-in">("sign-up");
  const [selectedPlan, setSelectedPlan] = useState<"proguide" | "starter" | "elite">(
    "proguide",
  );
  const [form, setForm] = useState<FormState>({
    targetCountries: initial?.targetCountries?.length
      ? initial.targetCountries.map((c) => c.toUpperCase())
      : [],
    degreeLevel: initial?.degreeLevel ?? "",
    preferredCourses: initial?.preferredCourses?.length
      ? initial.preferredCourses
      : [],
    gpa: initial?.gpa?.toString() ?? "",
    board: initial?.board ?? "HSC",
    nationality: initial?.nationality ?? "Bangladeshi",
    ieltsOverall: initial?.ieltsOverall?.toString() ?? "",
    toeflScore: initial?.toeflScore?.toString() ?? "",
    budget: initial?.budget?.toString() ?? "",
    budgetCurrency: initial?.budgetCurrency ?? "USD",
  });

  const primaryCountry = form.targetCountries[0] ?? null;
  const paymentStep = STEPS.length - 1;
  const accountStep = paymentStep - 1;
  const budgetStep = accountStep - 1;
  const lastContentStep = paymentStep;

  function formComplete(data: FormState) {
    return (
      data.targetCountries.length > 0 &&
      !!data.degreeLevel &&
      data.preferredCourses.length > 0 &&
      !!data.gpa &&
      (!!data.ieltsOverall || !!data.toeflScore) &&
      !!data.budget
    );
  }

  function canContinue() {
    if (step === 0) return !!primaryCountry;
    if (step === 1)
      return !!form.degreeLevel && form.preferredCourses.length > 0;
    if (step === 2)
      return !!form.gpa && (!!form.ieltsOverall || !!form.toeflScore);
    if (step === 3) return !!form.budget;
    if (step === accountStep) {
      if (needsVerify) return verifyCode.trim().length >= 4;
      if (mode === "sign-in") return email.includes("@") && password.length >= 1;
      return email.includes("@") && password.length >= 8;
    }
    if (step === paymentStep) return !!selectedPlan;
    return false;
  }

  function clerkErrorMessage(err: unknown) {
    if (isClerkAPIResponseError(err)) {
      return err.errors[0]?.longMessage || err.errors[0]?.message || "Sign up failed";
    }
    return "Something went wrong. Try again.";
  }

  function isEmailTakenError(err: unknown) {
    if (!isClerkAPIResponseError(err)) return false;
    return err.errors.some(
      (e) =>
        e.code === "form_identifier_exists" ||
        e.code === "form_email_address_exists" ||
        /taken|already|exists/i.test(e.message ?? "") ||
        /taken|already|exists/i.test(e.longMessage ?? ""),
    );
  }

  async function activateAndSave(sessionId: string | null | undefined) {
    if (!sessionId) {
      setError("Could not start your session. Try again.");
      return false;
    }
    await setActive({ session: sessionId });
    await submitProfile(form);
    return true;
  }

  async function continueWithGoogle() {
    if (!signUpLoaded || !signInLoaded || !signUp || !signIn) {
      toast.error("Auth is still loading. Try again.");
      return;
    }
    setSaving(true);
    setError(null);
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(form));
    try {
      // Prefer SignUp OAuth so new Google users are created (not just signed in)
      const auth = mode === "sign-in" ? signIn : signUp;
      await auth.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/get-started",
      });
    } catch (err) {
      // Fallback if SignUp OAuth isn't available
      try {
        await signIn.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/get-started",
        });
      } catch (fallbackErr) {
        setError(clerkErrorMessage(fallbackErr || err));
        setSaving(false);
      }
    }
  }

  async function signInAndMatch() {
    if (!signInLoaded || !signIn) {
      toast.error("Auth is still loading. Try again.");
      return;
    }

    // Don't pass password into create() — invalid for Google-only accounts
    let result = await signIn.create({ identifier: email.trim() });

    const factors = result.supportedFirstFactors ?? [];
    const passwordFactor = factors.find((f: any) => f.strategy === "password");
    const googleFactor = factors.find((f: any) => f.strategy === "oauth_google");

    if (passwordFactor) {
      result = await signIn.attemptFirstFactor({
        strategy: "password",
        password,
      });

      if (result.status === "complete") {
        await activateAndSave(result.createdSessionId);
        return;
      }

      setError("Wrong password. Try again, or continue with Google.");
      return;
    }

    if (googleFactor) {
      setError("This account uses Google sign-in. Use Continue with Google.");
      return;
    }

    setError("Could not sign in with this account. Try another email.");
  }

  async function createAccountAndMatch() {
    if (!signUpLoaded || !signUp || !signInLoaded) {
      toast.error("Auth is still loading. Try again.");
      return;
    }
    if (!canContinue() || saving) {
      setError(
        needsVerify
          ? "Enter the verification code from your email."
          : mode === "sign-in"
            ? "Enter your email and password."
            : "Enter a valid email and a password (8+ characters).",
      );
      return;
    }

    setSaving(true);
    setError(null);
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(form));

    try {
      if (mode === "sign-in") {
        await signInAndMatch();
        return;
      }

      if (needsVerify) {
        const verified = await signUp.attemptEmailAddressVerification({
          code: verifyCode.trim(),
        });
        if (verified.status === "complete") {
          await activateAndSave(
            verified.createdSessionId ?? signUp.createdSessionId,
          );
        } else {
          setError(
            `Code accepted, but signup is still ${verified.status}. Try again or use Google.`,
          );
        }
        return;
      }

      const created = await signUp.create({
        emailAddress: email.trim(),
        password,
      });

      if (created.status === "complete") {
        await activateAndSave(
          created.createdSessionId ?? signUp.createdSessionId,
        );
        return;
      }

      // Fill any optional missing name fields Clerk may require
      if (created.missingFields?.includes("first_name")) {
        await signUp.update({
          firstName: email.trim().split("@")[0]?.slice(0, 30) || "Student",
        });
      }

      if (signUp.status === "complete") {
        await activateAndSave(signUp.createdSessionId);
        return;
      }

      // Always send email OTP when signup isn't complete yet
      try {
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        setNeedsVerify(true);
        toast.message("Check your email for a verification code");
      } catch (prepErr) {
        if (signUp.createdSessionId) {
          await activateAndSave(signUp.createdSessionId);
          return;
        }
        setError(
          `${clerkErrorMessage(prepErr)} Or use Continue with Google instead.`,
        );
      }
    } catch (err) {
      if (isEmailTakenError(err)) {
        setMode("sign-in");
        try {
          await signInAndMatch();
          return;
        } catch (signInErr) {
          setError(clerkErrorMessage(signInErr));
          return;
        }
      }
      setError(clerkErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  function next() {
    if (!canContinue()) {
      if (step === 0) setError("Please choose a destination country.");
      else if (step === 1) setError("Please choose a pathway and subject.");
      else if (step === 2) setError("Please add your GPA and an English score.");
      else if (step === 3) setError("Please set your annual budget.");
      else
        setError(
          needsVerify
            ? "Enter the verification code from your email."
            : "Enter a valid email and a password (8+ characters).",
        );
      return;
    }
    setError(null);

    if (step === accountStep) {
      void createAccountAndMatch();
      return;
    }

    if (step === paymentStep) {
      void completePayment();
      return;
    }

    if (step === budgetStep && isSignedIn) {
      void finish();
      return;
    }

    setStep((s) => Math.min(lastContentStep, s + 1));
  }

  function back() {
    setError(null);
    if (step === accountStep && needsVerify) {
      setNeedsVerify(false);
      setVerifyCode("");
      return;
    }
    if (step === paymentStep && isSignedIn) {
      setStep(budgetStep);
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  }

  async function submitProfile(data: FormState) {
    const res = await fetch("/api/student/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        degreeLevel: data.degreeLevel,
        preferredCourses: data.preferredCourses,
        targetCountries: data.targetCountries,
        gpa: data.gpa ? parseFloat(data.gpa) : undefined,
        gpaScale: 5,
        board: data.board || undefined,
        nationality: data.nationality || undefined,
        ieltsOverall: data.ieltsOverall
          ? parseFloat(data.ieltsOverall)
          : undefined,
        toeflScore: data.toeflScore ? parseInt(data.toeflScore, 10) : undefined,
        budget: data.budget ? parseFloat(data.budget) : undefined,
        budgetCurrency: data.budgetCurrency || "USD",
      }),
    });

    if (res.status === 401) {
      sessionStorage.setItem(PENDING_KEY, JSON.stringify(data));
      setStep(accountStep);
      toast.message("Create your account to save your matches");
      return false;
    }

    if (!res.ok) {
      toast.error("Could not save your profile");
      return false;
    }

    sessionStorage.removeItem(PENDING_KEY);
    toast.success("Profile saved");
    setStep(paymentStep);
    return true;
  }

  async function completePayment() {
    if (!selectedPlan || saving) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/student/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selectedPlan }),
      });
      if (!res.ok) {
        toast.error("Payment failed. Try again.");
        return;
      }
      toast.success("Payment confirmed — matching universities next");
      router.push("/dashboard/matching");
      router.refresh();
    } catch {
      toast.error("Payment failed. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function finish() {
    if (!formComplete(form) || saving) {
      setError("Please complete your budget details.");
      return;
    }

    if (!isSignedIn) {
      sessionStorage.setItem(PENDING_KEY, JSON.stringify(form));
      setStep(accountStep);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await submitProfile(form);
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    const draft = sessionStorage.getItem(PENDING_KEY);
    if (!draft) return;
    try {
      const parsed = JSON.parse(draft) as FormState;
      setForm(parsed);
    } catch {
      sessionStorage.removeItem(PENDING_KEY);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || autoSubmitted.current || saving) return;
    const draft = sessionStorage.getItem(PENDING_KEY);
    if (!draft) return;

    let parsed: FormState;
    try {
      parsed = JSON.parse(draft) as FormState;
    } catch {
      sessionStorage.removeItem(PENDING_KEY);
      return;
    }

    if (!formComplete(parsed)) return;

    setForm(parsed);

    if (!isSignedIn) {
      setStep(accountStep);
      return;
    }

    autoSubmitted.current = true;
    setSaving(true);
    void submitProfile(parsed).finally(() => setSaving(false));
  }, [isLoaded, isSignedIn, saving, accountStep]);

  const leftCopy = useMemo(() => {
    const lines = [
      {
        title: (
          <>
            Ready, Set, and Grow{" "}
            <span className="text-orange-500">Beyond Borders.</span>
          </>
        ),
        body: "Tell us where you want to study — we match universities that actually fit your profile.",
      },
      {
        title: (
          <>
            Choose the pathway that fits{" "}
            <span className="text-orange-500">your future.</span>
          </>
        ),
        body: "Bachelor, Master, Foundation, or PhD — pick what you are aiming for, plus the subject you care about.",
      },
      {
        title: (
          <>
            Your grades unlock{" "}
            <span className="text-orange-500">honest matches.</span>
          </>
        ),
        body: "We use your academics and English scores to filter universities you can realistically apply to.",
      },
      {
        title: (
          <>
            Stay within a budget that{" "}
            <span className="text-orange-500">works for you.</span>
          </>
        ),
        body: "Set an annual study budget including tuition and living costs. You can refine it later.",
      },
      {
        title: (
          <>
            Ready, Set, and Grow{" "}
            <span className="text-orange-500">Beyond Borders.</span>
          </>
        ),
        body: "Almost there — enter your email so we can save your matches and keep your journey on track.",
      },
      {
        title: (
          <>
            Unlock your dashboard with{" "}
            <span className="text-orange-500">transparent pricing.</span>
          </>
        ),
        body: "Choose a plan once — then access matches, applications, documents, and advisor support.",
      },
    ];
    return lines[step] ?? lines[0];
  }, [step]);

  const visibleSteps = isSignedIn
    ? STEPS.filter((s) => s.id !== "account")
    : STEPS;

  const primaryLabel =
    step === budgetStep && isSignedIn
      ? "Continue"
      : step === accountStep
        ? needsVerify
          ? "Verify & continue"
          : mode === "sign-in"
            ? "Sign in & continue"
            : "Continue"
        : step === paymentStep
          ? "Pay & start matching"
          : "Continue";

  const softField =
    "h-12 rounded-xl border-stone-200 bg-[#eef6fb] text-stone-900 placeholder:text-stone-400 focus-visible:ring-orange-500/30";

  return (
    <div className="min-h-[100svh] lg:grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <aside className="relative hidden overflow-hidden bg-[#f3f1ec] lg:flex lg:flex-col">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(249,115,22,0.18), transparent 42%), radial-gradient(circle at 80% 70%, rgba(14,165,233,0.12), transparent 40%)",
          }}
        />
        <div className="relative z-10 flex flex-1 flex-col px-10 py-10 xl:px-14">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/images/logo.png"
                alt="Muntajar"
                width={28}
                height={28}
                className="rounded-md"
              />
              <span className="text-lg font-bold tracking-tight text-stone-900">
                muntajar
              </span>
            </Link>
            <div className="ml-1 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500"
                >
                  <Star className="h-3 w-3 fill-white text-white" />
                </span>
              ))}
            </div>
          </div>

          <div className="mt-16 max-w-md">
            <h1 className="text-[2.35rem] font-bold leading-[1.12] tracking-tight text-stone-900 xl:text-[2.7rem]">
              {leftCopy.title}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-stone-600">
              {leftCopy.body}
            </p>
          </div>

          <LeftPanelArt step={step} />
        </div>
      </aside>

      <section className="flex min-h-[100svh] flex-col bg-white">
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Muntajar"
              width={24}
              height={24}
              className="rounded-md"
            />
            <span className="font-bold text-stone-900">muntajar</span>
          </Link>
          <span className="text-sm text-stone-500">
            Step {Math.min(step + 1, visibleSteps.length)}/{visibleSteps.length}
          </span>
        </div>

        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 py-8 sm:px-8 lg:max-w-2xl lg:px-12 lg:py-12">
          <nav className="mb-10 hidden w-full sm:block" aria-label="Onboarding progress">
            <ol
              className="grid w-full gap-1"
              style={{
                gridTemplateColumns: `repeat(${visibleSteps.length}, minmax(0, 1fr))`,
              }}
            >
              {visibleSteps.map((s, index) => {
                const absoluteIndex = STEPS.findIndex((x) => x.id === s.id);
                const done = absoluteIndex < step;
                const active = absoluteIndex === step;
                return (
                  <li key={s.id} className="min-w-0">
                    <div className="flex items-center">
                      <span
                        className={cn(
                          "relative z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                          done || active
                            ? "bg-orange-500 text-white"
                            : "border border-stone-300 bg-white text-stone-400",
                        )}
                      >
                        {done ? <Check className="h-3.5 w-3.5" /> : index + 1}
                      </span>
                      {index < visibleSteps.length - 1 && (
                        <span
                          className={cn(
                            "mx-1 h-px min-w-0 flex-1",
                            done ? "bg-orange-300" : "bg-stone-200",
                          )}
                        />
                      )}
                    </div>
                    <p
                      className={cn(
                        "mt-2 truncate text-[11px] font-medium leading-tight",
                        done || active ? "text-orange-600" : "text-stone-400",
                      )}
                    >
                      {s.label}
                    </p>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="mb-6 sm:hidden">
            <p className="text-sm font-semibold text-orange-600">
              {STEPS[step].label}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-stone-900">
              {leftCopy.title}
            </h2>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {step === 0 &&
              COUNTRIES.map((c) => (
                <RadioCard
                  key={c.code}
                  active={primaryCountry === c.code}
                  title={c.label}
                  description={c.hint}
                  onClick={() => {
                    setForm({ ...form, targetCountries: [c.code] });
                    setError(null);
                  }}
                  trailing={
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://flagcdn.com/w80/${c.flag}.png`}
                      alt=""
                      width={36}
                      height={24}
                      className="mt-1 h-6 w-9 rounded-sm object-cover"
                    />
                  }
                />
              ))}

            {step === 1 && (
              <>
                {PATHWAYS.map((p) => (
                  <RadioCard
                    key={p.value}
                    active={form.degreeLevel === p.value}
                    title={p.label}
                    description={p.hint}
                    onClick={() => {
                      setForm({ ...form, degreeLevel: p.value });
                      setError(null);
                    }}
                  />
                ))}
                <div className="pt-4">
                  <p className="mb-3 text-sm font-semibold text-stone-800">
                    Preferred subject
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECTS.map((subject) => {
                      const active = form.preferredCourses[0] === subject;
                      return (
                        <button
                          key={subject}
                          type="button"
                          onClick={() => {
                            setForm({ ...form, preferredCourses: [subject] });
                            setError(null);
                          }}
                          className={cn(
                            "rounded-full border-2 px-3.5 py-2 text-sm font-semibold transition-colors",
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
              </>
            )}

            {step === 2 && (
              <div className="space-y-5 rounded-2xl border border-stone-200 bg-stone-50/60 p-5 sm:p-7">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="gpa">GPA / HSC GPA</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      value={form.gpa}
                      onChange={(e) =>
                        setForm({ ...form, gpa: e.target.value })
                      }
                      placeholder="e.g. 4.5"
                      className="h-11 bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ielts">IELTS overall</Label>
                    <Input
                      id="ielts"
                      type="number"
                      step="0.5"
                      min="0"
                      max="9"
                      value={form.ieltsOverall}
                      onChange={(e) =>
                        setForm({ ...form, ieltsOverall: e.target.value })
                      }
                      placeholder="e.g. 6.5"
                      className="h-11 bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="toefl">TOEFL (optional)</Label>
                    <Input
                      id="toefl"
                      type="number"
                      min="0"
                      max="120"
                      value={form.toeflScore}
                      onChange={(e) =>
                        setForm({ ...form, toeflScore: e.target.value })
                      }
                      placeholder="e.g. 90"
                      className="h-11 bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      value={form.nationality}
                      onChange={(e) =>
                        setForm({ ...form, nationality: e.target.value })
                      }
                      className="h-11 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5 rounded-2xl border border-stone-200 bg-stone-50/60 p-5 sm:p-7">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Annual budget</Label>
                    <Input
                      id="budget"
                      type="number"
                      min="0"
                      value={form.budget}
                      onChange={(e) =>
                        setForm({ ...form, budget: e.target.value })
                      }
                      placeholder="30000"
                      className="h-11 bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      value={form.budgetCurrency}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          budgetCurrency: e.target.value
                            .toUpperCase()
                            .slice(0, 3),
                        })
                      }
                      maxLength={3}
                      className="h-11 bg-white"
                    />
                  </div>
                </div>
                <p className="text-sm text-stone-500">
                  Include tuition and living costs for one year. Next you create
                  an account, then we generate your university shortlist.
                </p>
              </div>
            )}

            {step === accountStep && !isSignedIn && (
              <div className="mx-auto w-full max-w-md space-y-5 pt-2">
                {/* Required for Clerk bot protection in custom auth flows */}
                <div
                  id="clerk-captcha"
                  data-cl-theme="light"
                  data-cl-size="flexible"
                  className="mb-1 min-h-[68px] w-full"
                />

                {!needsVerify ? (
                  <>
                    <button
                      type="button"
                      onClick={() => void continueWithGoogle()}
                      disabled={saving}
                      className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-stone-200 bg-white text-sm font-semibold text-stone-800 transition-colors hover:bg-stone-50 disabled:opacity-60"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
                        <path
                          fill="#EA4335"
                          d="M12 10.2v3.6h5.1c-.2 1.2-1.5 3.6-5.1 3.6-3.1 0-5.6-2.5-5.6-5.6S8.9 6.2 12 6.2c1.7 0 2.9.7 3.6 1.4l2.4-2.4C16.5 3.7 14.4 2.8 12 2.8 6.9 2.8 2.8 6.9 2.8 12S6.9 21.2 12 21.2c5.2 0 8.6-3.6 8.6-8.7 0-.6-.1-1-.2-1.5H12z"
                        />
                        <path
                          fill="#34A853"
                          d="M3.9 7.3l3 2.2C7.7 7.5 9.7 6.2 12 6.2c1.7 0 2.9.7 3.6 1.4l2.4-2.4C16.5 3.7 14.4 2.8 12 2.8 8.2 2.8 4.9 5 3.9 7.3z"
                        />
                        <path
                          fill="#4A90E2"
                          d="M12 21.2c2.3 0 4.3-.8 5.8-2.1l-2.8-2.2c-.8.5-1.8.9-3 .9-3.5 0-5.5-2.4-5.1-4.5l-3-2.3C2.9 15.8 7 21.2 12 21.2z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M6.9 13.3c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9l-3-2.2C3.3 8.6 2.8 10.2 2.8 12s.5 3.4 1.1 4.7l3-2.4z"
                        />
                      </svg>
                      Continue with Google
                    </button>

                    <div className="flex items-center gap-3">
                      <span className="h-px flex-1 bg-stone-200" />
                      <span className="text-xs font-medium uppercase tracking-wide text-stone-400">
                        or
                      </span>
                      <span className="h-px flex-1 bg-stone-200" />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="onboarding-email"
                        className="text-sm font-semibold text-stone-900"
                      >
                        Enter your email
                      </Label>
                      <Input
                        id="onboarding-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (mode === "sign-in") setMode("sign-up");
                        }}
                        placeholder="you@example.com"
                        className={softField}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="onboarding-password"
                        className="text-sm font-semibold text-stone-900"
                      >
                        {mode === "sign-in"
                          ? "Enter your password"
                          : "Create a password"}
                      </Label>
                      <Input
                        id="onboarding-password"
                        type="password"
                        autoComplete={
                          mode === "sign-in" ? "current-password" : "new-password"
                        }
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={
                          mode === "sign-in"
                            ? "Your password"
                            : "At least 8 characters"
                        }
                        className={softField}
                      />
                    </div>
                    {mode === "sign-in" && (
                      <p className="text-sm text-stone-500">
                        This email already has an account — sign in to continue
                        with your saved matches.
                      </p>
                    )}
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label
                      htmlFor="onboarding-code"
                      className="text-sm font-semibold text-stone-900"
                    >
                      Enter verification code
                    </Label>
                    <Input
                      id="onboarding-code"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value)}
                      placeholder="6-digit code from email"
                      className={softField}
                    />
                    <p className="text-sm text-stone-500">
                      We sent a code to <span className="font-medium">{email}</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {step === accountStep && isSignedIn && (
              <div className="mx-auto w-full max-w-md rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-8 text-center">
                <p className="font-semibold text-emerald-900">
                  You&apos;re signed in
                </p>
                <p className="mt-1 text-sm text-emerald-800/80">
                  Saving your profile…
                </p>
                <Loader2 className="mx-auto mt-4 h-5 w-5 animate-spin text-emerald-700" />
              </div>
            )}

            {step === paymentStep && (
              <div className="mx-auto w-full max-w-md space-y-3 pt-2">
                <p className="mb-2 text-sm text-stone-500">
                  Select a plan. After payment we analyze universities and build
                  your shortlist.
                </p>
                {PLANS.map((plan) => (
                  <RadioCard
                    key={plan.id}
                    active={selectedPlan === plan.id}
                    title={`${plan.name} · ${plan.price}${plan.period}`}
                    description={plan.hint}
                    onClick={() => {
                      setSelectedPlan(plan.id);
                      setError(null);
                    }}
                  />
                ))}
                <p className="pt-2 text-xs leading-relaxed text-stone-400">
                  Demo checkout — no card charged in development. In production
                  this connects to bKash / bank transfer / Stripe.
                </p>
              </div>
            )}
          </div>

          <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
            {step > 0 && (
              <button
                type="button"
                onClick={back}
                disabled={saving}
                className="h-12 min-w-[140px] rounded-xl border border-stone-900 bg-white px-8 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-50"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={
                step === budgetStep && isSignedIn
                  ? finish
                  : step === paymentStep
                    ? completePayment
                    : next
              }
              disabled={
                saving || (step === accountStep && isSignedIn)
              }
              className="inline-flex h-12 min-w-[140px] items-center justify-center gap-2 rounded-xl bg-stone-950 px-10 text-sm font-semibold text-white transition-colors hover:bg-stone-800 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {step === paymentStep
                    ? "Processing…"
                    : step === accountStep
                      ? "Creating…"
                      : "Saving…"}
                </>
              ) : (
                primaryLabel
              )}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-stone-500">
            {mode === "sign-in" ? (
              <>
                New here?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("sign-up");
                    setError(null);
                  }}
                  className="font-semibold text-orange-600 hover:underline"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("sign-in");
                    setError(null);
                  }}
                  className="font-semibold text-orange-600 hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </section>
    </div>
  );
}
