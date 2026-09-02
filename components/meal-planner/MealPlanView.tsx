"use client";

import { getMealplanById } from "@/actions/meal/crud";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  NotebookPen,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type { ReactNode } from "react";
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
    meal.protein ? `P ${meal.protein}g` : null,
    meal.carbs ? `C ${meal.carbs}g` : null,
    meal.fat ? `F ${meal.fat}g` : null,
  ].filter(Boolean);

  if (macros.length === 0) return null;

  return (
    <p className="mt-1 text-xs tabular-nums text-muted-foreground/80">
      {macros.join(" · ")}
    </p>
  );
};

const StripTitle = ({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) => (
  <div className="flex items-center gap-2 border-b border-border/80 pb-2">
    {icon}
    <h3 className="text-[0.6875rem] font-semibold uppercase tracking-widest text-foreground">
      {children}
    </h3>
  </div>
);

const MealPlanView = ({ id }: { id: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["meal-plan", id],
    queryFn: () => getMealplanById(id),
  });

  const plan = data as GetMealPannerTyp | undefined;
  const days = (plan?.days as DayItem[] | undefined) ?? [];

  const hasShopping = !!plan?.shopping_list?.length;
  const hasTips = !!plan?.pro_tips?.length;

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

  return (
    <div className="mx-auto w-full px-4 py-8 sm:px-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <Button
              variant="ghost"
              size="icon"
              asChild
              aria-label="Back to my meal plans"
              className="shrink-0 rounded-lg hover:bg-muted"
            >
              <Link href="/meal-planner/my-meal-plans">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="min-w-0 space-y-1.5">
              <h1 className="line-clamp-1 font-gosh text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {plan.name}
              </h1>
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                <span className="font-medium capitalize text-primary">
                  {plan.goal?.replace(/_/g, " ")}
                </span>
                <span aria-hidden>·</span>
                <span className="capitalize">{plan.timeframe} plan</span>
                <span aria-hidden>·</span>
                <span>{days.length} days</span>
                <span aria-hidden>·</span>
                <span>{plan.meals_per_day} meals/day</span>
                {plan.calories ? (
                  <>
                    <span aria-hidden>·</span>
                    <span>{plan.calories} kcal/day</span>
                  </>
                ) : null}
              </p>
            </div>
          </div>
          <DownloadPdfButton
            generate={() => generateMealPlanPdf(plan)}
            cost={MEAL_PLAN_PDF_CREDIT_COST}
            variant="outline"
            size="sm"
            className="text-primary"
          />
        </div>

        {/* Jump nav for multi-day plans */}
        {days.length > 1 && (
          <nav
            aria-label="Jump to day"
            className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
          >
            {days.map((d, idx) => (
              <a
                key={d.id ?? idx}
                href={`#day-${idx + 1}`}
                className="shrink-0 rounded-full border border-border/80 bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {String(idx + 1).padStart(2, "0")} · {d.day}
              </a>
            ))}
          </nav>
        )}

        {plan.notes ? (
          <div className="flex items-start gap-3 rounded-xl border border-border/80 px-4 py-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <div className="text-sm leading-relaxed">
              <p className="font-medium text-foreground">Notes</p>
              <p className="mt-0.5 text-muted-foreground">{plan.notes}</p>
            </div>
          </div>
        ) : null}

        {/* Days + Shopping List */}
        <div
          className={cn(
            "gap-6",
            hasShopping ? "grid lg:grid-cols-12" : "space-y-6",
          )}
        >
          <div
            className={hasShopping ? "space-y-6 lg:col-span-8" : "space-y-6"}
          >
            {days.map((day, index) => (
              <section
                key={day.id ?? index}
                id={`day-${index + 1}`}
                className="scroll-mt-24 rounded-xl border border-border/80 bg-card"
              >
                <header className="flex items-center justify-between gap-3 border-b border-border/80 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                    <h2 className="text-lg font-bold tracking-tight capitalize text-foreground">
                      {day.day}
                    </h2>
                  </div>
                  {day.total_calories ? (
                    <span className="text-sm tabular-nums text-muted-foreground">
                      {day.total_calories} kcal
                    </span>
                  ) : null}
                </header>

                <div className="divide-y divide-border/80 px-5">
                  {day.meals?.map((meal) => (
                    <div key={meal.id ?? meal.name} className="py-4">
                      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                        <h4 className="font-semibold text-foreground">
                          {meal.name}
                        </h4>
                        {meal.calories ? (
                          <span className="text-sm tabular-nums text-muted-foreground">
                            {meal.calories} kcal
                          </span>
                        ) : null}
                      </div>
                      {meal.description ? (
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {meal.description}
                        </p>
                      ) : null}
                      <Macros meal={meal} />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {hasShopping && (
            <div className="flex flex-col gap-8 lg:col-span-4">
              <div>
                <StripTitle
                  icon={<ShoppingCart className="h-4 w-4 text-primary" />}
                >
                  Shopping list
                </StripTitle>
                <ul className="divide-y divide-border/80">
                  {plan.shopping_list?.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 py-2.5">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      <span className="text-sm leading-snug text-foreground/90">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {hasTips && (
                <div>
                  <StripTitle
                    icon={<NotebookPen className="h-4 w-4 text-primary" />}
                  >
                    Chef&apos;s notes
                  </StripTitle>
                  <div className="space-y-3 pt-4">
                    {plan.pro_tips?.map((tip, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-border/80 px-4 py-3 text-sm leading-relaxed text-foreground/90 [&_p]:m-0"
                      >
                        <ReactMarkdown>{tip}</ReactMarkdown>
                      </div>
                    ))}
                  </div>
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
