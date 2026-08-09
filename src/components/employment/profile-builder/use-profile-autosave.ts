"use client";

import { useCallback, useRef, useState } from "react";
import type { ProfilePatch } from "@/lib/employment/profile/types";
import type { getProfileSectionCompletion } from "@/lib/employment/profile/completion";

type Sections = ReturnType<typeof getProfileSectionCompletion>;

type AutosaveState = {
  saving: boolean;
  error: string | null;
  lastSavedAt: Date | null;
  completion: number;
  sections: Sections | null;
};

export function useProfileAutosave(initialCompletion = 0) {
  const [state, setState] = useState<AutosaveState>({
    saving: false,
    error: null,
    lastSavedAt: null,
    completion: initialCompletion,
    sections: null,
  });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<ProfilePatch>({});
  const inFlight = useRef(false);

  const flush = useCallback(async () => {
    if (inFlight.current) return;
    const patch = pending.current;
    pending.current = {};
    if (Object.keys(patch).length === 0) return;

    inFlight.current = true;
    setState((s) => ({ ...s, saving: true, error: null }));
    try {
      const res = await fetch("/api/employment/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...patch, autosave: true }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message ?? "Autosave failed");
      }
      setState((s) => ({
        ...s,
        saving: false,
        lastSavedAt: new Date(),
        completion: json.data.completion ?? s.completion,
        sections: json.data.sections ?? s.sections,
      }));
    } catch (error) {
      setState((s) => ({
        ...s,
        saving: false,
        error: error instanceof Error ? error.message : "Autosave failed",
      }));
    } finally {
      inFlight.current = false;
      if (Object.keys(pending.current).length > 0) {
        void flush();
      }
    }
  }, []);

  const save = useCallback(
    (patch: ProfilePatch, immediate = false) => {
      pending.current = { ...pending.current, ...patch };
      if (timer.current) clearTimeout(timer.current);
      if (immediate) {
        void flush();
        return;
      }
      timer.current = setTimeout(() => {
        void flush();
      }, 700);
    },
    [flush],
  );

  const setCompletion = useCallback(
    (completion: number, sections?: Sections | null) => {
      setState((s) => ({
        ...s,
        completion,
        sections: sections ?? s.sections,
        lastSavedAt: new Date(),
      }));
    },
    [],
  );

  return { ...state, save, flush, setCompletion };
}
