"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ChefHat, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

const AUTO_RUN_MS = 5000;

interface ActionCardProps {
  kind: "recipe" | "meal-plan";
  title: string;
  description: string;
  summary: string;
  onRun: () => void;
}

export default function ActionCard({
  kind,
  title,
  description,
  summary,
  onRun,
}: ActionCardProps) {
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const ranRef = useRef(false);
  const onRunRef = useRef(onRun);

  useEffect(() => {
    onRunRef.current = onRun;
  });

  useEffect(() => {
    if (paused) return;
    let raf = 0;
    let done = false;

    const run = () => {
      if (ranRef.current) return;
      ranRef.current = true;
      done = true;
      setPaused(true);
      onRunRef.current();
    };

    const timer = setTimeout(run, AUTO_RUN_MS);

    if (!reduceMotion) {
      const started = performance.now();
      const tick = (now: number) => {
        if (done) return;
        const pct = Math.min(100, ((now - started) / AUTO_RUN_MS) * 100);
        setProgress(pct);
        if (pct < 100) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [paused, reduceMotion]);

  const Icon = kind === "recipe" ? ChefHat : Utensils;
  const cta = kind === "recipe" ? "Generate recipe" : "Build my meal plan";
  const secondsLeft = Math.max(1, Math.ceil((AUTO_RUN_MS - progress) / 1000));

  const handleRunNow = () => {
    if (ranRef.current) return;
    ranRef.current = true;
    setPaused(true);
    onRunRef.current();
  };

  return (
    <div className="relative mt-2 w-full max-w-[19rem] overflow-hidden rounded-[1rem] border border-border bg-card">
      {/* Progress rail */}
      {!paused && (
        <span className="absolute inset-y-0 left-0 w-[3px] bg-muted" aria-hidden>
          <span
            className={cn(
              "block h-full w-full bg-primary",
              !reduceMotion && "transition-[height] duration-150 ease-linear",
            )}
            style={{ height: `${progress}%` }}
          />
        </span>
      )}

      <div className="flex items-start gap-3 p-3.5 pl-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-sm font-semibold leading-tight text-foreground">
            {title}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        <span
          className={cn(
            "mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[0.625rem] font-semibold tabular-nums",
            paused ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary",
          )}
        >
          {paused ? "Paused" : `${secondsLeft}s`}
        </span>
      </div>

      {summary && (
        <div className="mx-4 rounded-lg border border-border/60 bg-muted/40 px-3 py-2">
          <p className="line-clamp-3 text-[0.6875rem] leading-relaxed text-muted-foreground">
            {summary}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 p-3.5 pt-2.5 pl-4">
        <button
          type="button"
          onClick={handleRunNow}
          className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98]"
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
          {cta}
        </button>
        {!paused && (
          <button
            type="button"
            onClick={() => setPaused(true)}
            aria-label="Cancel auto-run"
            className="h-9 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
