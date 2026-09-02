"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Ingredient } from "@/utils/types/recipe";

type IngredientWithUnit = Ingredient & { unit?: string };

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const IngredientsView = ({
  ingredients,
}: {
  ingredients: IngredientWithUnit[];
}) => {
  const reduce = useReducedMotion();
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const done = checked.size;
  const pct = ingredients.length ? (done / ingredients.length) * 100 : 0;

  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-border/80 px-4 py-3">
        <h3 className="text-[0.6875rem] font-semibold uppercase tracking-widest text-foreground">
          Ingredients
        </h3>
        {ingredients.length > 0 && (
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold tabular-nums transition-colors duration-300",
                done === ingredients.length
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-muted/40 text-muted-foreground",
              )}
            >
              {done}/{ingredients.length} ready
            </span>
            {done > 0 && (
              <button
                type="button"
                onClick={() => setChecked(new Set())}
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground active:scale-95"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {ingredients.length === 0 ? (
        <p className="px-4 py-3 text-sm text-muted-foreground">
          No ingredients listed yet.
        </p>
      ) : (
        <>
          <div
            className="mx-4 mt-3 h-1 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={done}
            aria-valuemin={0}
            aria-valuemax={ingredients.length}
          >
            <motion.div
              className="h-full origin-left rounded-full bg-primary"
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: pct / 100 }}
              transition={{ duration: 0.4, ease }}
            />
          </div>

          <ul className="divide-y divide-border/80">
            {ingredients.map((ingredient, index) => {
              const isChecked = checked.has(index);
              return (
                <li
                  key={index}
                  className={cn(
                    "group flex items-start gap-3 px-4 py-3",
                    isChecked && "bg-muted/30",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    aria-pressed={isChecked}
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200 active:scale-90",
                      isChecked
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-transparent hover:border-primary/50",
                    )}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {isChecked && (
                        <motion.span
                          key="check"
                          initial={reduce ? false : { scale: 0.3, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={reduce ? undefined : { scale: 0.3, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 20,
                          }}
                          className="flex"
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>

                  <div className="relative min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span
                        className={cn(
                          "text-sm font-medium text-foreground transition-colors duration-200",
                          isChecked && "text-muted-foreground",
                        )}
                      >
                        {ingredient.item}
                      </span>
                      {ingredient.amount !== undefined && (
                        <span className="text-sm tabular-nums text-muted-foreground">
                          {ingredient.amount}
                          {ingredient.unit ? ` ${ingredient.unit}` : ""}
                        </span>
                      )}
                    </div>
                    {ingredient.notes ? (
                      <p
                        className={cn(
                          "mt-0.5 text-xs text-muted-foreground transition-opacity duration-200",
                          isChecked && "opacity-50",
                        )}
                      >
                        {ingredient.notes}
                      </p>
                    ) : null}
                    <motion.span
                      aria-hidden
                      initial={false}
                      animate={{ scaleX: isChecked ? 1 : 0 }}
                      transition={{ duration: 0.3, ease }}
                      className="absolute left-0 top-[1.1em] h-px w-full origin-left bg-foreground/50"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

export default IngredientsView;
