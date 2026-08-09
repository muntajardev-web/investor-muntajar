"use client";

import * as React from "react";

type Lang = "en" | "bn";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
}

export const LangContext = React.createContext<LangContextValue>({
  lang: "bn",
  setLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>("bn");

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("muntajar_lang") as Lang | null;
      if (saved === "en" || saved === "bn") {
        setLangState(saved);
      }
    } catch {
      // Fallback to default 'bn'
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("muntajar_lang", l);
    } catch {
      // ignore
    }
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return React.useContext(LangContext);
}
