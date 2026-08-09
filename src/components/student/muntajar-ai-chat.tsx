"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  Copy,
  Check,
  Bot,
  User,
  GraduationCap,
  Award,
  Globe2,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AIInputWithSearch } from "@/components/ui/ai-input-with-search";

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  suggestedLinks?: { label: string; href: string }[];
}

const INITIAL_QUESTIONS_LIMIT = 30;

const PROMPT_CARDS = [
  {
    icon: GraduationCap,
    title: "GPA & Transcript OCR",
    prompt: "What is Muntajar and how does AI transcript OCR verification work?",
  },
  {
    icon: Award,
    title: "100% Tuition Scholarships",
    prompt: "How do I apply for 100% Tuition Waiver Scholarships in Germany & Canada?",
  },
  {
    icon: Globe2,
    title: "Visa & Work Rights",
    prompt: "What are the post-study work visa rules for Canada, UK, & Germany?",
  },
  {
    icon: BookOpen,
    title: "Skill Upgrade Roadmap",
    prompt: "What skills or courses should I complete to unlock higher scholarships?",
  },
];

function FormattedMessageText({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-2 text-stone-800 text-xs sm:text-sm font-medium leading-relaxed">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-1" />;

        const isBullet = line.trim().startsWith("•") || line.trim().startsWith("-");
        const isNumbered = /^\d+\.\s/.test(line.trim());

        const parts = line.split(/(\*\*[^*]+\*\*)/g);

        const renderedLine = parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={pIdx} className="font-extrabold text-stone-950">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        return (
          <p
            key={idx}
            className={cn(
              "leading-relaxed",
              (isBullet || isNumbered) && "pl-2 font-semibold text-stone-900",
            )}
          >
            {renderedLine}
          </p>
        );
      })}
    </div>
  );
}

export function MuntajarAiChat() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = React.useState(false);
  const [questionsLeft, setQuestionsLeft] = React.useState(INITIAL_QUESTIONS_LIMIT);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied response to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // KNOWLEDGE BASE ENGINE FOR MUNTAJAR
  const generateAiAnswer = (query: string): { text: string; links?: { label: string; href: string }[] } => {
    const q = query.toLowerCase();

    if (q.includes("what is muntajar") || q.includes("company") || q.includes("about muntajar")) {
      return {
        text: "✨ **Muntajar** is an advanced AI-powered study abroad platform.\n\nWe empower students to:\n1. **Verify Transcripts**: Instant AI OCR parsing of SSC, HSC, O/A Levels, and University Marksheets.\n2. **Match Top Universities**: Querying vector databases across Canada, UK, Germany, USA, and Australia.\n3. **Unlock Scholarships**: Identifying entrance grants, merit awards, and 100% tuition-free public universities.\n4. **End-to-End Applications**: Managing applications, visa checklists, and post-graduation work permit guidance.",
        links: [
          { label: "Academic Profile Assessment", href: "/dashboard/profile" },
          { label: "View Recommendations", href: "/dashboard/recommendations" },
        ],
      };
    }

    if (q.includes("ocr") || q.includes("transcript") || q.includes("document") || q.includes("verify")) {
      return {
        text: "📄 **AI Neural OCR & Verification**:\n\nOur system automatically extracts verified data from official academic documents:\n• **Extracted Fields**: Student Name, Verified GPA/CGPA, Board/Institution Name, Passing Year, and Subject Grades.\n• **Accuracy Confidence Score**: Each field displays an ID Analyzer style rating (e.g. `0.980` or `98%`).\n• **Slot Validation**: Ensures you don't accidentally upload SSC into an HSC slot or passport into transcript slots.",
        links: [{ label: "Upload Documents for Verification", href: "/dashboard/profile" }],
      };
    }

    if (q.includes("scholarship") || q.includes("tuition") || q.includes("free") || q.includes("money")) {
      return {
        text: "🎓 **Scholarships & Tuition Waivers**:\n\nMuntajar automatically calculates your scholarship eligibility:\n• **Merit Scholarships**: Up to $10,000 – $20,000/yr entrance grants based on your GPA and IELTS band.\n• **100% Tuition-Free Options**: Germany public universities (e.g., Technical University of Munich).\n• **Skill Booster Roadmap**: Recommends additional certifications or IELTS boosts to claim higher funding tiers!",
        links: [{ label: "Check AI University Matches", href: "/dashboard/profile" }],
      };
    }

    if (q.includes("visa") || q.includes("canada") || q.includes("uk") || q.includes("germany") || q.includes("work permit")) {
      return {
        text: "✈️ **Visa & Post-Study Work Guidance**:\n\nWe provide country-specific immigration guidance:\n• **Canada**: 3-Year Post-Graduation Work Permit (PGWP) & Provincial Nominee Pathways.\n• **United Kingdom**: 2-Year Graduate Route Post-Study Visa.\n• **Germany**: 18-Month Job Search Visa & Tuition-Free Education.\n• **United States**: STEM OPT 3-Year Extension Rights.",
        links: [{ label: "Visa Guidance Portal", href: "/dashboard/visa" }],
      };
    }

    if (q.includes("match") || q.includes("gpa") || q.includes("ielts") || q.includes("how things work") || q.includes("how it works")) {
      return {
        text: "⚡ **How Muntajar AI Matching Works**:\n\n1. You complete your 6-step profile (Curriculum, Transcripts, Degree Goal, English Score, Budget Cap, Destinations).\n2. Our AI runs a 30-second vector analysis comparing your profile against 5,000+ university programs.\n3. You receive personalized university cards showing your exact match score (e.g. `98% AI Match`) and guaranteed scholarship amounts!",
        links: [{ label: "Start Profile Assessment", href: "/dashboard/profile" }],
      };
    }

    if (q.includes("sop") || q.includes("recommendation") || q.includes("application") || q.includes("apply")) {
      return {
        text: "📝 **Applications & Document Preparation**:\n\nMuntajar assists with Statement of Purpose (SOP) guidance, letter of recommendation templates, and direct application submission to global partner universities.",
        links: [{ label: "View My Applications", href: "/dashboard/applications" }],
      };
    }

    return {
      text: `🤖 **Muntajar AI Response**:\n\nRegarding your inquiry: "${query}"\n\nMuntajar is designed to guide you through university selection, GPA evaluation, scholarship matching, and visa clearance. Complete your 6-step profile assessment to generate personalized university recommendations!`,
      links: [{ label: "Open Profile Assessment", href: "/dashboard/profile" }],
    };
  };

  const handleSendMessage = (textToSend: string) => {
    const query = textToSend.trim();
    if (!query) return;

    if (questionsLeft <= 0) {
      toast.error("You have reached your 30 free AI questions limit.");
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuestionsLeft((prev) => Math.max(0, prev - 1));
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateAiAnswer(query);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiResponse.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedLinks: aiResponse.links,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="w-full min-h-[85vh] bg-stone-50/40 rounded-3xl p-4 sm:p-8 border border-stone-200/90 shadow-2xs flex flex-col justify-between text-stone-900 font-sans">
      
      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col justify-center max-w-3xl w-full mx-auto py-4">
        
        {/* ── HERO GREETING SCREEN (EMPTY CHAT MODE) ── */}
        {!hasMessages && (
          <div className="space-y-10 py-6 animate-in fade-in duration-300 text-center">
            
            {/* Modern Hero Greeting */}
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center mx-auto shadow-2xs">
                <Sparkles className="w-8 h-8" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                How can Muntajar AI assist your journey today?
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto font-medium">
                Ask about university matching, scholarship calculations, academic transcript OCR, or visa guidance.
              </p>
            </div>

            {/* Centered AI Input Bar */}
            <div className="max-w-2xl mx-auto w-full">
              <AIInputWithSearch
                placeholder="Ask Muntajar AI anything about university matching, scholarships..."
                onSubmit={(value, withSearch) => {
                  if (withSearch) {
                    handleSendMessage(`[Web Search] ${value}`);
                  } else {
                    handleSendMessage(value);
                  }
                }}
                onFileSelect={(file) => {
                  toast.success(`Attached file: ${file.name} for AI Analysis`);
                  handleSendMessage(`[Attached File: ${file.name}] Can you analyze this academic transcript?`);
                }}
              />
            </div>

            {/* 4 Modern Prompt Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl mx-auto pt-2 text-left">
              {PROMPT_CARDS.map((card, i) => {
                const Icon = card.icon;
                return (
                  <button
                    type="button"
                    key={i}
                    onClick={() => handleSendMessage(card.prompt)}
                    className="p-5 rounded-3xl bg-white border border-stone-200/90 hover:border-orange-500 hover:shadow-xs transition-all text-left space-y-2 cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 text-stone-900 group-hover:text-orange-600 transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-stone-100 group-hover:bg-orange-50 text-stone-600 group-hover:text-orange-600 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-extrabold">{card.title}</h3>
                    </div>
                    <p className="text-xs text-stone-500 font-medium line-clamp-2 leading-relaxed">
                      {card.prompt}
                    </p>
                  </button>
                );
              })}
            </div>

          </div>
        )}

        {/* ── ACTIVE CHAT MESSAGES STREAM ── */}
        {hasMessages && (
          <div className="space-y-6 py-4 animate-in fade-in duration-300">
            {messages.map((msg) => {
              const isAi = msg.sender === "ai";

              return (
                <div key={msg.id} className="space-y-3">
                  {isAi ? (
                    // MUNTAJAR AI CARD
                    <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-orange-600 text-white flex items-center justify-center text-xs shrink-0">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-stone-900 block">Muntajar AI Counselor</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-stone-400">{msg.timestamp}</span>
                      </div>

                      <FormattedMessageText text={msg.text} />

                      {/* Action Links */}
                      {msg.suggestedLinks && msg.suggestedLinks.length > 0 && (
                        <div className="pt-3 border-t border-stone-100 flex flex-wrap gap-2">
                          {msg.suggestedLinks.map((link, idx) => (
                            <Link
                              key={idx}
                              href={link.href}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 hover:bg-stone-100 hover:text-orange-600 transition-colors"
                            >
                              <span>{link.label}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-orange-600" />
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="pt-1 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => copyMessage(msg.id, msg.text)}
                          className="p-1 rounded-md hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-orange-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // USER MESSAGE BUBBLE (DEEP STONE HIGH CONTRAST)
                    <div className="flex justify-end">
                      <div className="max-w-xl bg-stone-950 text-white px-5 py-3.5 rounded-3xl text-xs sm:text-sm font-semibold leading-relaxed shadow-2xs">
                        {msg.text}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* AI Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-3 p-4 rounded-3xl bg-white border border-stone-200/90 text-xs text-stone-700 font-bold shadow-2xs max-w-xs">
                <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
                <span>Muntajar AI is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

      </div>

      {/* ── FOOTER INPUT & DISCLAIMER (ACTIVE CHAT MODE) ── */}
      {hasMessages && (
        <div className="max-w-3xl w-full mx-auto pt-2 space-y-2">
          <AIInputWithSearch
            placeholder="Reply to Muntajar AI..."
            onSubmit={(value, withSearch) => {
              if (withSearch) {
                handleSendMessage(`[Web Search] ${value}`);
              } else {
                handleSendMessage(value);
              }
            }}
            onFileSelect={(file) => {
              toast.success(`Attached file: ${file.name}`);
              handleSendMessage(`[Attached File: ${file.name}] Can you analyze this academic transcript?`);
            }}
          />
          <p className="text-[11px] text-center text-stone-400 font-medium">
            Muntajar AI Counselor can make mistakes. Verify critical admission & visa deadlines with official university portals.
          </p>
        </div>
      )}

    </div>
  );
}
