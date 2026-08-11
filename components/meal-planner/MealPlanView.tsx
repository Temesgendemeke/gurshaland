"use client";

import { getMealplanById } from "@/actions/meal/crud";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChevronLeft, Download, Info, Wand2 } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { GetMealPannerTyp } from "@/schema/meal-planner";
import MealPlanSkeleton from "../skeleton/MealPlanSkeleton";

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

const Dot = () => (
  <span className="h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
);

const Macros = ({ meal }: { meal: MealItem }) => {
  const macros = [
    meal.protein ? `Protein ${meal.protein}g` : null,
    meal.carbs ? `Carbs ${meal.carbs}g` : null,
    meal.fat ? `Fat ${meal.fat}g` : null,
  ].filter(Boolean);

  if (macros.length === 0) return null;

  return (
    <p className="mt-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {macros.join("  ·  ")}
    </p>
  );
};

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
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
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
                <h1 className="line-clamp-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {plan.name}
                </h1>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                  <span className="font-medium capitalize text-primary">
                    {plan.goal?.replace(/_/g, " ")}
                  </span>
                  <Dot />
                  <span className="capitalize">{plan.timeframe} plan</span>
                  <Dot />
                  <span>{days.length} days</span>
                  <Dot />
                  <span>{plan.meals_per_day} meals/day</span>
                  {plan.calories ? (
                    <>
                      <Dot />
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        {plan.calories} kcal/day
                      </span>
                    </>
                  ) : null}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-primary"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              {hasTips && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Wand2 className="h-4 w-4" />
                      Tips
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-80">
                    <p className="text-sm font-semibold text-foreground">
                      Pro Tips
                    </p>
                    <div className="mt-3 space-y-4">
                      {plan.pro_tips?.map((tip, i) => (
                        <div
                          key={i}
                          className="text-sm leading-relaxed text-muted-foreground [&_p]:m-0 [&_p]:leading-relaxed [&_strong]:text-foreground"
                        >
                          <ReactMarkdown>{tip}</ReactMarkdown>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
          <Separator className="mt-6 opacity-60" />
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
                className="shrink-0 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {String(idx + 1).padStart(2, "0")} · {d.day}
              </a>
            ))}
          </nav>
        )}

        {plan.notes ? (
          <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
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
              <Card
                key={day.id ?? index}
                id={`day-${index + 1}`}
                className="scroll-mt-24"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4">
                  <CardTitle className="flex items-center gap-3 text-base font-bold sm:text-lg">
                    <span className="font-mono text-sm text-muted-foreground">
                      Day {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="capitalize">{day.day}</span>
                  </CardTitle>
                  {day.total_calories ? (
                    // <Badge variant="secondary" className="font-mono">
                    //   {day.total_calories} kcal
                    // </Badge>
                    <>
                      <Dot />
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        {day.total_calories} kcal
                      </span>
                    </>
                  ) : null}
                </CardHeader>
                <CardContent className="divide-y divide-border/60 border-t border-border/60 pt-4">
                  {day.meals?.map((meal) => (
                    <div key={meal.id ?? meal.name} className="py-4">
                      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                        <h4 className="font-semibold text-foreground">
                          {meal.name}
                        </h4>
                        {meal.calories ? (
                          <span className="font-mono text-xs text-muted-foreground">
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
                </CardContent>
              </Card>
            ))}
          </div>

          {hasShopping && (
            <div className="flex flex-col lg:col-span-4">
              <Card className="flex flex-col">
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-semibold">
                    Shopping List
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pt-0">
                  <ul className="divide-y divide-border/60">
                    {plan.shopping_list?.map((item, i) => (
                      <li
                        key={i}
                        className="py-2 text-sm text-muted-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealPlanView;
