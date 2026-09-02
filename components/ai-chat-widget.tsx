"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useAuth } from "@/store/useAuth";
import { useAppStore } from "@/lib/store";
import {
  clearPendingAIGeneration,
  getPendingAIGeneration,
  requireLogin,
  savePendingAIGeneration,
} from "@/lib/auth-gate";
import ChatMarkdown from "@/components/chat/ChatMarkdown";
import ActionCard from "@/components/chat/ActionCard";
import SearchResults from "@/components/chat/SearchResults";
import {
  CHAT_SUGGESTIONS,
  type ChatNavigationAction,
  type MealPlanPrefill,
} from "@/lib/chat-actions";
import {
  PaperAirplaneIcon as Send,
  StopCircleIcon as StopCircle,
  XMarkIcon as X,
} from "@heroicons/react/24/outline";
import { FireIcon as FireSolid } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";

const AUTH_PATHS = ["/login", "/signup", "/forgot-password", "/reset-password"];

interface ParsedToolPart {
  id: string | null;
  toolName: string;
  state: string;
  output: unknown;
}

function parseToolPart(part: any): ParsedToolPart | null {
  const source = part?.toolInvocation ?? part;
  const toolName = part?.type?.startsWith("tool-")
    ? part.type.slice(5)
    : (source?.toolName ?? null);
  if (!toolName) return null;
  return {
    id: source?.toolCallId ?? part?.toolCallId ?? null,
    toolName,
    state: source?.state ?? part?.state ?? null,
    output: source?.output ?? null,
  };
}

function mealPlanSummary(values?: MealPlanPrefill): string {
  if (!values) return "";
  const bits: string[] = [];
  if (values.timeframe) {
    bits.push(values.timeframe === "full-week" ? "full week" : "today");
  }
  if (values.goal) bits.push(values.goal.replaceAll("_", " "));
  if (values.diet && values.diet !== "standard") bits.push(values.diet);
  if (values.meals_per_day) bits.push(`${values.meals_per_day} meals/day`);
  if (values.calories) bits.push(`${values.calories} kcal`);
  if (values.prompt) bits.push(values.prompt);
  return bits.join(" · ");
}

export function AIChatWidget() {
  const isOpen = useAppStore((store) => store.isCookingAssistantOpen);
  const setIsOpen = useAppStore((store) => store.SetCookingAssistantOpen);
  const user = useAuth((store) => store.user);
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, error, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
    }),
  });

  const [inputMessage, setInputMessage] = useState("");

  const isStreaming = status === "submitted" || status === "streaming";

  useEffect(() => {
    const unsubscribe = useAuth.subscribe((state, prevState) => {
      if (!state.user || prevState.user) return;
      const pending = getPendingAIGeneration();
      if (pending?.action !== "ai-chat") return;
      if (pending.prompt) setInputMessage(pending.prompt);
      setIsOpen(true);
      clearPendingAIGeneration();
    });
    return unsubscribe;
  }, [setIsOpen]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages, status, isOpen]);

  const handleNavigate = (action: ChatNavigationAction) => {
    setIsOpen(false);
    if (action.action === "navigate-recipe-generator") {
      savePendingAIGeneration({
        action: "recipe-generator",
        prompt: action.prompt,
        autoRun: true,
      });
      router.push("/ai-features/generate-recipe");
      return;
    }
    savePendingAIGeneration({
      action: "meal-plan",
      values: action.values as unknown as Record<string, unknown>,
      autoRun: true,
    });
    router.push("/meal-planner");
  };

  if (AUTH_PATHS.includes(pathname)) {
    return null;
  }

  const handleSendMessage = async (text?: string) => {
    const value = (text ?? inputMessage).trim();
    if (!value || isStreaming) return;

    if (!user) {
      savePendingAIGeneration({ action: "ai-chat", prompt: value });
      requireLogin();
      return;
    }

    sendMessage({ text: value });
    setInputMessage("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void handleSendMessage();
  };

  const renderToolPart = (part: any, index: number) => {
    const parsed = parseToolPart(part);
    if (!parsed) return null;
    if (parsed.state !== "output-available" && parsed.state !== "output-error") {
      return null;
    }

    const key = `tool-${parsed.id ?? index}`;

    if (parsed.toolName === "navigateToRecipeGenerator") {
      const output = parsed.output as ChatNavigationAction & { prompt?: string };
      const prompt = output?.prompt ?? "";
      return (
        <ActionCard
          key={key}
          kind="recipe"
          title="New recipe request"
          description="Open the AI Recipe Generator with your request pre-filled."
          summary={prompt}
          onRun={() => handleNavigate({ action: "navigate-recipe-generator", prompt })}
        />
      );
    }

    if (parsed.toolName === "navigateToMealPlanner") {
      const output = parsed.output as ChatNavigationAction & { values?: MealPlanPrefill };
      const values = output?.values;
      if (!values) return null;
      return (
        <ActionCard
          key={key}
          kind="meal-plan"
          title="Meal plan request"
          description="Open the Meal Planner with your preferences pre-filled."
          summary={mealPlanSummary(values)}
          onRun={() => handleNavigate({ action: "navigate-meal-planner", values })}
        />
      );
    }

    if (parsed.toolName === "searchRestaurants") {
      const output = parsed.output as { results?: unknown[] };
      return (
        <SearchResults
          key={key}
          kind="restaurant"
          label="Restaurants"
          items={(output?.results as any[]) ?? []}
        />
      );
    }

    if (parsed.toolName === "searchRecipes") {
      const output = parsed.output as { results?: unknown[] };
      return (
        <SearchResults
          key={key}
          kind="recipe"
          label="Recipes"
          items={(output?.results as any[]) ?? []}
        />
      );
    }

    return null;
  };

  return (
    <AnimatePresence initial={false} mode="wait">
      {isOpen ? (
        <motion.div
          key="panel"
          role="dialog"
          aria-label="GurshaAI chat"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-50 flex h-[min(76dvh,40rem)] w-[min(calc(100vw-1.5rem),24rem)] flex-col overflow-hidden rounded-[1.25rem] border border-border bg-background shadow-xl shadow-black/10"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FireSolid className="h-3.5 w-3.5" />
              </span>
              <p className="flex min-w-0 items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
                GurshaAI
                <span
                  className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full",
                    isStreaming ? "bg-amber-500" : "bg-emerald-500",
                    isStreaming && !reduceMotion && "animate-pulse",
                  )}
                />
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-90"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3.5 overflow-y-auto overscroll-contain px-4 py-4 [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]">
            {messages.length === 0 && (
              <div className="flex h-full flex-col justify-center">
                <p className="text-lg font-semibold leading-tight tracking-tight text-foreground">
                  What are we cooking today?
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Find restaurants, generate recipes, or plan your week.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {CHAT_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => void handleSendMessage(suggestion)}
                      className="rounded-full border border-border px-3.5 py-2 text-left text-xs font-medium leading-snug text-foreground/90 transition-colors duration-150 hover:border-primary/40 hover:bg-primary/[0.06] hover:text-foreground active:scale-[0.98]"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, messageIndex) => (
              <div
                key={`${message.id}-${messageIndex}`}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "flex max-w-[85%] flex-col gap-1",
                    message.role === "user" ? "items-end" : "items-start",
                  )}
                >
                  {message.parts.map((part, partIndex) => {
                    if (part.type === "text") {
                      return message.role === "user" ? (
                        <div
                          key={`${message.id}-${partIndex}`}
                          className="rounded-[1.25rem] bg-primary px-3.5 py-2.5 text-sm text-primary-foreground"
                        >
                          <p className="whitespace-pre-wrap">{part.text}</p>
                        </div>
                      ) : (
                        <div
                          key={`${message.id}-${partIndex}`}
                          className="text-sm leading-relaxed"
                        >
                          <ChatMarkdown text={part.text} />
                        </div>
                      );
                    }
                    return renderToolPart(part, partIndex);
                  })}
                </div>
              </div>
            ))}

            {isStreaming && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 py-2">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full bg-muted-foreground/50",
                        !reduceMotion && "animate-pulse",
                      )}
                      style={{ animationDelay: `${i * 0.18}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p className="text-xs leading-relaxed text-error">
                {error.message}
              </p>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Composer */}
          <div className="shrink-0 border-t border-border/60 bg-background px-3 pb-3 pt-3">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-4 pr-1.5 transition-colors focus-within:border-primary/50"
            >
              <input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about Ethiopian cooking…"
                className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {isStreaming ? (
                <button
                  type="button"
                  onClick={stop}
                  aria-label="Stop generating"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-error transition-colors hover:bg-error/10 active:scale-95"
                >
                  <StopCircle className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  aria-label="Send message"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-[background-color,transform] hover:bg-primary/90 active:scale-95 disabled:opacity-35"
                >
                  <Send className="h-4 w-4" />
                </button>
              )}
            </form>
            <p className="mt-2 text-center text-[0.6875rem] text-muted-foreground/70">
              GurshaAI can make mistakes — double-check important details.
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.button
          key="launcher"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, scale: 0.9, y: 8 }}
          whileHover={reduceMotion ? undefined : { scale: 1.04 }}
          whileTap={reduceMotion ? undefined : { scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => setIsOpen(true)}
          aria-label="Open GurshaAI chat assistant"
          className="fixed bottom-6 right-6 z-50 inline-flex h-12 items-center gap-2 rounded-full bg-primary pr-5 pl-4 text-sm font-semibold tracking-tight text-primary-foreground shadow-lg shadow-primary/25"
        >
          <FireSolid className="h-4 w-4" />
          GurshaAI
        </motion.button>
      )}
    </AnimatePresence>
  );
}
