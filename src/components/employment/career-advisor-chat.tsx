"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ADVISOR_PROMPTS } from "@/lib/employment/constants";

type Message = { id: string; role: string; content: string };

export function CareerAdvisorChat({
  initialMessages,
  profileName,
  hasAnalysis,
  matchCount,
}: {
  initialMessages: Message[];
  profileName?: string | null;
  hasAnalysis?: boolean;
  matchCount?: number;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function ask(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    setLoading(true);
    setQuestion("");
    setMessages((prev) => [
      ...prev,
      { id: `tmp-${Date.now()}`, role: "user", content: trimmed },
    ]);
    try {
      const res = await fetch("/api/employment/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message ?? "Career coach failed");
      }
      setMessages((prev) => [
        ...prev,
        {
          id: json.data.message.id,
          role: "assistant",
          content: json.data.answer,
        },
      ]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Career coach failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-stone-100 bg-stone-50/70 px-3 py-2 text-xs text-stone-500">
        Coaching with{" "}
        <span className="font-medium text-stone-700">
          {profileName ?? "your worker profile"}
        </span>
        {hasAnalysis ? " · analysis on file" : " · run analysis for richer answers"}
        {typeof matchCount === "number"
          ? ` · ${matchCount} job match${matchCount === 1 ? "" : "es"}`
          : ""}
        . Answers stay grounded — the coach will not invent visas or salaries.
      </div>

      <div className="flex flex-wrap gap-2">
        {ADVISOR_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={loading}
            onClick={() => void ask(prompt)}
            className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-700 hover:border-orange-300 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="max-h-[28rem] space-y-3 overflow-y-auto rounded-xl border border-stone-200 bg-white p-4 sm:p-5">
        {messages.length === 0 && (
          <p className="text-sm text-stone-500">
            Ask about countries, salary, certificates, English, or eligibility
            for Germany or Japan. Chat history is saved to your account.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === "user"
                ? "ml-8 rounded-lg bg-orange-50 px-3 py-2 text-sm whitespace-pre-wrap text-stone-900"
                : "mr-8 rounded-lg bg-stone-50 px-3 py-2 text-sm whitespace-pre-wrap text-stone-700"
            }
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400">
              {m.role === "user" ? "You" : "AI Career Coach"}
            </p>
            {m.content}
          </div>
        ))}
        {loading && (
          <p className="text-sm text-stone-400">Coach is reviewing your profile…</p>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          void ask(question);
        }}
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask your career coach…"
          className="h-11 flex-1 rounded-md border border-stone-200 bg-white px-3 text-sm"
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !question.trim()}>
          {loading ? "Thinking…" : "Ask"}
        </Button>
      </form>
    </div>
  );
}
