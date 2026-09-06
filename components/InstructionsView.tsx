"use client";

import React from "react";
import { Clock } from "lucide-react";
import { Instruction } from "@/utils/types/recipe";
import RecipeImage from "./recipe/RecipeModel/RecipeImage";
import { cn } from "@/lib/utils";

interface InstructionsViewProps {
  instructions?: Instruction[];
}

export default function InstructionsView({ instructions = [] }: InstructionsViewProps) {
  const list = instructions ?? [];

  return (
    <section className="space-y-6">
      <div className="flex items-baseline justify-between border-b border-border/60 pb-3">
        <h3 className="font-gosh text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Instructions
        </h3>
        <span className="text-xs sm:text-sm font-medium tabular-nums text-muted-foreground">
          {list.length} {list.length === 1 ? "step" : "steps"}
        </span>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
          No step-by-step instructions provided for this recipe.
        </div>
      ) : (
        <ol className="relative space-y-8">
          {list.map((instruction: Instruction, idx: number) => {
            const isLast = idx === list.length - 1;
            const stepNumber = instruction.step || idx + 1;
            const stepTitle = instruction.title || `Step ${stepNumber}`;

            return (
              <li key={instruction.step ?? idx} className="relative flex items-start gap-4 sm:gap-6 group">
                {/* Timeline connector line */}
                {!isLast && (
                  <div
                    className="absolute left-[17px] sm:left-[19px] top-10 bottom-[-32px] w-0.5 bg-border/60"
                    aria-hidden="true"
                  />
                )}

                {/* Step badge */}
                <div className="relative z-10 flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary  text-xs sm:text-sm font-bold">
                  {String(stepNumber).padStart(2, "0")}
                </div>

                {/* Step Content */}
                <div className="min-w-0 flex-1 pt-0.5 space-y-2.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h4 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                      {stepTitle}
                    </h4>
                    {instruction.time ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        <Clock className="h-3 w-3 text-primary" />
                        {instruction.time} min
                      </span>
                    ) : null}
                  </div>

                  {/* Instruction description */}
                  <p className="text-sm sm:text-[15px] leading-relaxed text-muted-foreground">
                    {instruction.description}
                  </p>

                  {/* Optional Step Image */}
                  {instruction.image?.url && (
                    <div className="mt-3 max-w-lg overflow-hidden rounded-xl border border-border bg-muted">
                      <RecipeImage
                        src={instruction.image.url}
                        alt={stepTitle}
                        sizes="(max-width: 768px) 100vw, 480px"
                      />
                    </div>
                  )}

                  {/* Technique Note */}
                  {instruction.tips && (
                    <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-border/80 bg-muted/30 px-3.5 py-2.5 text-xs sm:text-sm">
                      <span className="shrink-0 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-primary">
                        Pro Tip
                      </span>
                      <p className="text-muted-foreground leading-relaxed pt-0.5">
                        {instruction.tips}
                      </p>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

