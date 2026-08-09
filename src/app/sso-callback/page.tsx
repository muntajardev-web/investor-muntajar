"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { isDummyClerkKey } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function SSOCallbackPage() {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (isDummyClerkKey(clerkKey)) {
    return (
      <div className="flex min-h-[100svh] flex-col items-center justify-center gap-4 bg-stone-50 px-6">
        <p className="text-sm font-semibold text-stone-700">Finishing sign in…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center gap-4 bg-stone-50 px-6">
      <AuthenticateWithRedirectCallback
        signInFallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
        signInForceRedirectUrl="/dashboard"
        signUpForceRedirectUrl="/dashboard"
      />
      <div id="clerk-captcha" />
      <p className="text-sm text-stone-500">Finishing sign in…</p>
    </div>
  );
}
