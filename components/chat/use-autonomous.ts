"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  clearPendingAIGeneration,
  getPendingAIGeneration,
  type PendingAIGeneration,
} from "@/lib/auth-gate";

export interface AutonomousState {
  /** True while the AI is about to auto-run something. */
  active: boolean;
  /** Milliseconds left before auto-run fires. */
  remainingMs: number;
  /** Total countdown in ms. */
  totalMs: number;
  /** Stop the automation and let the human take over. */
  cancel: () => void;
  /** Trigger the action immediately. */
  runNow: () => void;
}

/**
 * Reads a pending AI action from the auth gate and  when it was flagged
 * autoRun  waits a short countdown before calling `onRun`. The intent is
 * only cleared when the action actually fires (or the user cancels), so
 * React re-mounts / StrictMode can't silently cancel it.
 *
 * While `active` the UI should render <AutonomousBanner /> so the user can
 * see it's in autonomous mode and cancel.
 */
export function useAutonomousAction(
  action: PendingAIGeneration["action"],
  enabled: boolean,
  onRun: (pending: PendingAIGeneration) => void,
  onPrefill?: (pending: PendingAIGeneration) => void,
  totalMs = 5000,
): AutonomousState {
  const [active, setActive] = useState(false);
  const [remainingMs, setRemainingMs] = useState(totalMs);
  const startedAtRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingRef = useRef<PendingAIGeneration | null>(null);
  const onRunRef = useRef(onRun);
  const onPrefillRef = useRef(onPrefill);

  useEffect(() => {
    onRunRef.current = onRun;
    onPrefillRef.current = onPrefill;
  });

  useEffect(() => {
    if (!enabled) return;
    const pending = getPendingAIGeneration();
    if (!pending || pending.action !== action) return;

    pendingRef.current = pending;
    onPrefillRef.current?.(pending);

    // No auto-run requested: consume the intent and let the human submit.
    if (!pending.autoRun) {
      clearPendingAIGeneration();
      return;
    }

    // Kick the countdown off on a later tick so every setState happens
    // from an async callback (keeps effects pure).
    const kickoff = setTimeout(() => {
      setActive(true);
      setRemainingMs(totalMs);
      startedAtRef.current = performance.now();
      intervalRef.current = setInterval(() => {
        const left = totalMs - (performance.now() - startedAtRef.current);
        if (left <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          clearPendingAIGeneration();
          setActive(false);
          onRunRef.current(pending);
        } else {
          setRemainingMs(left);
        }
      }, 100);
    }, 0);

    return () => {
      clearTimeout(kickoff);
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [enabled, action, totalMs]);

  const finish = useCallback(() => {
    const pending = pendingRef.current;
    clearPendingAIGeneration();
    setActive(false);
    if (pending) onRunRef.current(pending);
  }, []);

  const cancel = useCallback(() => {
    clearPendingAIGeneration();
    setActive(false);
  }, []);

  const runNow = useCallback(() => finish(), [finish]);

  return { active, remainingMs, totalMs, cancel, runNow };
}
