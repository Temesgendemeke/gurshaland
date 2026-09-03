"use client";

import { useState } from "react";
import { getMealplanById } from "@/actions/meal/crud";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  Check,
  ShoppingBag,
  Sparkles,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { GetMealPannerTyp } from "@/schema/meal-planner";
import MealPlanSkeleton from "../skeleton/MealPlanSkeleton";
import DownloadPdfButton from "@/components/pdf/DownloadPdfButton";
import { generateMealPlanPdf } from "@/actions/pdf";
import { MEAL_PLAN_PDF_CREDIT_COST } from "@/constants/creditCosts";

interface MealItem {
  id?: string;
  name: string;
  description?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  type?: string;
}

interface DayItem {
  id?: string;
  day: string;
  total_calories?: number;
  meals: MealItem[];
}

const Macros = ({ meal }: { meal: MealItem }) => {
  const macros = [
    meal.protein ? { label: "Protein", val: `${meal.protein}g` } : null,
    meal.carbs ? { label: "Carbs", val: `${meal.carbs}g` } : null,
    meal.fat ? { label: "Fat", val: `${meal.fat}g` } : null,
  ].filter(Boolean);

  if (macros.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border/50 pt-2.5 text-[11px] text-muted-foreground">
      {macros.map((m, idx) => (
        <span key={idx} className="inline-flex items-center gap-1">
          <span className="text-muted-foreground/60">{m?.label}:</span>
          <span className="font-medium text-foreground/85">{m?.val}</span>
        </span>
      ))}
    </div>
  );
};

const MealPlanView = ({ id }: { id: string }) => {
  const [selectedDay, setSelectedDay] = useState<number | "all">(0);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["meal-plan", id],
    queryFn: () => getMealplanById(id),
  });

  const plan = data as GetMealPannerTyp | undefined;
  const days = (plan?.days as DayItem[] | undefined) ?? [];

  const hasShopping = !!plan?.shopping_list?.length;
  const hasTips = !!plan?.pro_tips?.length;
  const hasGuidance = !!plan?.notes || hasTips;

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (isLoading) {
    return <MealPlanSkeleton />;
  }

  if (!plan) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Meal plan not found.
      </div>
    );
  }

  const displayedDays =
    selectedDay === "all"
      ? days
      : days[selectedDay]
        ? [days[selectedDay]]
        : days.slice(0, 1);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="space-y-8">
        {/* Serene Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div className="flex min-w-0 items-center gap-3.5">
            <Button
              variant="ghost"
              size="icon"
              asChild
              aria-label="Back to my meal plans"
              className="h-9 w-9 shrink-0 rounded-xl border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <Link href="/meal-planner/my-meal-plans">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="min-w-0 space-y-1">
              <h1 className="line-clamp-1 font-gosh text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {plan.name}
              </h1>
              <p className="flex flex-wrap items-center gap-x-2 text-xs sm:text-sm text-muted-foreground">
                <span className="font-semibold text-primary capitalize">
                  {plan.goal?.replace(/_/g, " ")}
                </span>
                <span>·</span>
                <span className="capitalize">{plan.timeframe} plan</span>
                <span>·</span>
                <span>{days.length} days</span>
                <span>·</span>
                <span>{plan.meals_per_day} meals/day</span>
                {plan.calories && (
                  <>
                    <span>·</span>
                    <span>~{plan.calories} kcal/day</span>
                  </>
                )}
              </p>
            </div>
          </div>
          <DownloadPdfButton
            generate={() => generateMealPlanPdf(plan)}
            cost={MEAL_PLAN_PDF_CREDIT_COST}
            variant="outline"
            size="sm"
            className="rounded-xl border-border/80 text-foreground font-medium hover:border-primary/50 hover:text-primary"
          />
        </div>

        {/* Day Switcher Tabs (Un-bloated Navigation) */}
        {days.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {days.map((d, idx) => {
              const isActive = selectedDay === idx;
              return (
                <button
                  key={d.id ?? idx}
                  onClick={() => setSelectedDay(idx)}
                  className={cn(
                    "shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                      : "border border-border/70 bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  Day {idx + 1}
                  <span className="ml-1.5 opacity-70 font-normal">
                    ({d.day})
                  </span>
                </button>
              );
            })}
            <button
              onClick={() => setSelectedDay("all")}
              className={cn(
                "shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer",
                selectedDay === "all"
                  ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                  : "border border-border/70 bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              All Days
            </button>
          </div>
        )}

        {/* Main Grid: Days Schedule + Quiet Sidebar */}
        <div
          className={cn(
            "gap-8",
            hasShopping || hasGuidance ? "grid lg:grid-cols-12" : "space-y-6"
          )}
        >
          {/* Days & Meals Column */}
          <div
            className={
              hasShopping || hasGuidance
                ? "space-y-6 lg:col-span-8"
                : "space-y-6 max-w-4xl"
            }
          >
            {displayedDays.map((day, dIdx) => {
              const actualIndex =
                selectedDay === "all" ? dIdx : (selectedDay as number);
              return (
                <section
                  key={day.id ?? dIdx}
                  className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6 transition-all"
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/60">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold font-mono">
                        {String(actualIndex + 1).padStart(2, "0")}
                      </span>
                      <h2 className="text-lg font-bold tracking-tight capitalize text-foreground">
                        {day.day}
                      </h2>
                    </div>
                    {day.total_calories && (
                      <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground tabular-nums">
                        <Flame className="h-3.5 w-3.5 text-amber-500" />
                        {day.total_calories} kcal
                      </span>
                    )}
                  </div>

                  {/* Meals List */}
                  <div className="space-y-3.5">
                    {day.meals?.map((meal, mIdx) => (
                      <div
                        key={meal.id ?? meal.name ?? mIdx}
                        className="group rounded-xl border border-border/60 bg-muted/20 p-4 transition-all hover:border-border/90 hover:bg-card hover:shadow-xs"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                {meal.type || `Meal ${mIdx + 1}`}
                              </span>
                              {meal.calories && (
                                <span className="text-xs text-muted-foreground">
                                  {meal.calories} kcal
                                </span>
                              )}
                            </div>
                            <h4 className="font-semibold text-foreground text-base tracking-tight group-hover:text-primary transition-colors">
                              {meal.name}
                            </h4>
                            {meal.description && (
                              <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                {meal.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <Macros meal={meal} />
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Quiet Sidebar: Shopping List + Unified Guidance */}
          {(hasShopping || hasGuidance) && (
            <div className="space-y-6 lg:col-span-4">
              {/* Interactive Zen Shopping List */}
              {hasShopping && (
                <div className="rounded-2xl border border-border/70 bg-card p-5">
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-primary" />
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                        Shopping List
                      </h3>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {
                        Object.values(checkedItems).filter(Boolean).length
                      }
                      /{plan.shopping_list?.length}
                    </span>
                  </div>

                  <ul className="divide-y divide-border/40 max-h-[380px] overflow-y-auto pr-1 mt-2">
                    {plan.shopping_list?.map((item, i) => {
                      const isChecked = !!checkedItems[i];
                      return (
                        <li
                          key={i}
                          onClick={() => toggleCheck(i)}
                          className={cn(
                            "flex items-start gap-3 py-2.5 text-sm cursor-pointer select-none transition-colors group",
                            isChecked
                              ? "text-muted-foreground/60 line-through"
                              : "text-foreground hover:text-primary"
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-md border transition-colors",
                              isChecked
                                ? "bg-primary border-primary text-primary-foreground"
                                : "border-border/80 group-hover:border-primary"
                            )}
                          >
                            {isChecked && (
                              <Check className="h-3 w-3 stroke-[3]" />
                            )}
                          </span>
                          <span className="leading-tight">{item}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Unified Chef Guidance (Notes + Tips) */}
              {hasGuidance && (
                <div className="rounded-2xl border border-border/70 bg-card p-5 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                      Chef&apos;s Guidance
                    </h3>
                  </div>

                  {plan.notes && (
                    <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed font-serif italic bg-muted/30 p-3 rounded-xl border border-border/50">
                      &ldquo;{plan.notes}&rdquo;
                    </p>
                  )}

                  {hasTips && (
                    <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                      {plan.pro_tips?.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealPlanView;
