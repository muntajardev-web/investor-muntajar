"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { LangProvider } from "@/context/lang-context";
import { isDummyClerkKey } from "@/lib/utils";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (isDummyClerkKey(clerkKey)) {
    return (
      <LangProvider>
        <LenisProvider>{children}</LenisProvider>
      </LangProvider>
    );
  }

  return (
    <ClerkProvider
      publishableKey={clerkKey}
      signInUrl="/login"
      signUpUrl="/login"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    >
      <LangProvider>
        <LenisProvider>{children}</LenisProvider>
      </LangProvider>
    </ClerkProvider>
  );
}
