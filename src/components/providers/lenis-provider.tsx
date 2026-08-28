"use client";

import { useEffect, useRef } from "react";

interface LenisProviderProps {
  children: React.ReactNode;
}

function shouldSkipSmoothScroll(pathname: string) {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/get-started") ||
    pathname.startsWith("/work") ||
    pathname.startsWith("/portal") ||
    pathname.startsWith("/login")
  );
}

/**
 * Marketing-only smooth scroll. Avoids usePathname() so Next can prerender
 * /_global-error without a null React dispatcher (Netlify / Next 16).
 */
export function LenisProvider({ children }: LenisProviderProps) {
  const rafIdRef = useRef(0);

  useEffect(() => {
    if (shouldSkipSmoothScroll(window.location.pathname)) return;

    let cancelled = false;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled || shouldSkipSmoothScroll(window.location.pathname)) return;

      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis?.raf(time);
        rafIdRef.current = requestAnimationFrame(raf);
      }

      rafIdRef.current = requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafIdRef.current);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return <>{children}</>;
}
