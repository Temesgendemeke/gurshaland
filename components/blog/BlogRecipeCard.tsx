"use client";

import React, { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { Ingredient } from "@/utils/types/blog";
import { cn } from "@/lib/utils";

interface BlogRecipeCardProps {
  title?: string;
  ingredients?: Ingredient[];
  instructions?: string[];
  tips?: string[];
  className?: string;
}

export default function BlogRecipeCard({
  title,
  ingredients = [],
  instructions = [],
  tips = [],
  className,
}: BlogRecipeCardProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(
    new Set()
  );

  const hasIngredients = ingredients && ingredients.length > 0;
  const hasInstructions = instructions && instructions.length > 0;
  const hasTips = tips && tips.length > 0;

  if (!hasIngredients && !hasInstructions) return null;

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const doneCount = checkedIngredients.size;

  return (
    <div
      className={
        className ??
        "my-6 rounded-xl border border-border/70 bg-card/60 p-4 sm:p-6"
      }
    >
      {title && (
        <h3 className="mb-5 text-xl font-bold tracking-tight text-foreground font-gosh">
          {title}
        </h3>
      )}

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Ingredients Column */}
        {hasIngredients && (
          <div
            className={
              hasInstructions
                ? "lg:col-span-5 space-y-3"
                : "lg:col-span-12 space-y-3"
            }
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Ingredients
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
                  {doneCount}/{ingredients.length}
                </span>
                {doneCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setCheckedIngredients(new Set())}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </button>
                )}
              </div>
            </div>

            <ul className="space-y-1">
              {ingredients.map((ing, idx) => {
                const isChecked = checkedIngredients.has(idx);
                const hasAmount = ing.amount !== undefined && ing.amount !== null;
                const hasMeasurement = !!ing.measurement?.trim();

                return (
                  <li
                    key={idx}
                    onClick={() => toggleIngredient(idx)}
                    className={cn(
                      "group flex cursor-pointer items-start gap-2.5 rounded-lg p-2 transition-colors duration-150 select-none hover:bg-muted/40",
                      isChecked && "bg-muted/20 text-muted-foreground"
                    )}
                  >
                    {/* Checkbox box */}
                    <button
                      type="button"
                      aria-label={`Toggle ${ing.name}`}
                      className={cn(
                        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                        isChecked
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/40 bg-background group-hover:border-primary/60"
                      )}
                    >
                      {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                    </button>

                    {/* Text Details */}
                    <div className="min-w-0 flex-1 leading-snug break-words">
                      {(hasAmount || hasMeasurement) && (
                        <span
                          className={cn(
                            "font-semibold text-sm mr-1.5 transition-colors",
                            isChecked
                              ? "line-through text-muted-foreground"
                              : "text-foreground"
                          )}
                        >
                          {hasAmount && <span>{ing.amount}</span>}
                          {hasAmount && hasMeasurement && " "}
                          {hasMeasurement && <span>{ing.measurement}</span>}
                        </span>
                      )}
                      <span
                        className={cn(
                          "text-sm transition-colors",
                          isChecked
                            ? "line-through text-muted-foreground"
                            : "text-foreground/90"
                        )}
                      >
                        {ing.name}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Instructions Column */}
        {hasInstructions && (
          <div
            className={
              hasIngredients
                ? "lg:col-span-7 space-y-3"
                : "lg:col-span-12 space-y-3"
            }
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Instructions
              </h4>
              <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
                {instructions.length} {instructions.length === 1 ? "step" : "steps"}
              </span>
            </div>

            <ol className="space-y-3">
              {instructions.map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-muted/20 "
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-[11px] font-bold text-primary tabular-nums mt-1">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1 text-sm leading-relaxed text-foreground/90 break-words whitespace-pre-line font-normal">
                    {step}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Tips */}
      {hasTips && (
        <div className="mt-6 border-t border-border/50 pt-4">
          <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tips & Notes
          </h5>
          <ul className="space-y-1.5 text-xs sm:text-sm text-foreground/80">
            {tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span className="break-words">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
