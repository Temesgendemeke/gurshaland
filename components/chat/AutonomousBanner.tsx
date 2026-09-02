"use client";
import { useReducedMotion } from "motion/react";
import { Sparkles, X } from "lucide-react";

interface AutonomousBannerProps {
  /** Short label, e.g. "Meal plan" or "Recipe". */
  label: string;
  description: string;
  remainingMs: number;
  totalMs: number;
  onCancel: () => void;
  onRunNow: () => void;
}

export default function AutonomousBanner({
  label,
  description,
  remainingMs,
  totalMs,
  onCancel,
  onRunNow,
}: AutonomousBannerProps) {
  const reduceMotion = useReducedMotion();
  const seconds = Math.max(1, Math.ceil(remainingMs / 1000));
  const pct = Math.max(0, Math.min(100, (remainingMs / totalMs) * 100));

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 left-1/2 z-[60] w-[calc(100vw-1.5rem)] max-w-md -translate-x-1/2"
    >
      <div className="overflow-hidden rounded-2xl border border-primary/40 bg-background/95 shadow-2xl shadow-black/15 backdrop-blur">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 bg-primary px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold leading-tight text-primary-foreground">
                GurshaAI is in control
                <span className="inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-primary-foreground">
                  Autonomous
                </span>
              </p>
              <p className="text-[0.6875rem] text-primary-foreground/85">
                {label} · auto-generating in {seconds}s
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel autonomous mode"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-primary-foreground/80 transition-colors hover:bg-white/15 hover:text-primary-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-3.5">
          <p className="text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>

          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: reduceMotion ? "0%" : `${pct}%`,
                transition: reduceMotion
                  ? undefined
                  : "width 120ms linear",
              }}
            />
          </div>

          <div className="mt-3.5 flex items-center gap-2">
            <button
              type="button"
              onClick={onRunNow}
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98]"
            >
              <Sparkles className="h-4 w-4" />
              Generate now
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cancel — I&apos;ll do it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
