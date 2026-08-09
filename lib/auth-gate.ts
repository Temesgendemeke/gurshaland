"use client";

export type PendingAIAction = "recipe-generator" | "ai-chat" | "meal-plan";

export interface PendingAIGeneration {
  action: PendingAIAction;
  prompt?: string;
  values?: Record<string, unknown>;
}

const PENDING_AI_KEY = "gurshaland:pending-ai";

export function savePendingAIGeneration(intent: PendingAIGeneration): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_AI_KEY, JSON.stringify(intent));
}

export function getPendingAIGeneration(): PendingAIGeneration | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_AI_KEY);
    return raw ? (JSON.parse(raw) as PendingAIGeneration) : null;
  } catch {
    return null;
  }
}

export function clearPendingAIGeneration(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PENDING_AI_KEY);
}

export function requireLogin(next?: string): void {
  if (typeof window === "undefined") return;
  const target = next ?? window.location.pathname + window.location.search;
  window.location.href = `/login?next=${encodeURIComponent(target)}`;
}
