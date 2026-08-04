"use client";

import { getMealplanById } from "@/actions/meal/crud";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ShoppingCart,
  Sparkles,
  NotebookPen,
  Info,
  Download,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import MealPlanSkeleton from "../skeleton/MealPlanSkeleton";

const MealPlanView = ({ id }: { id: string }) => {
  const { data: plan, isLoading } = useQuery({
    queryKey: ["meal-plan", id],
    queryFn: () => getMealplanById(id),
  });

  if (isLoading) {
    return <MealPlanSkeleton />;
  }

  if (!plan) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Meal plan not found.
      </div>
    );
  }

  return (
    <div className="mx-auto w-[calc(100%-1rem)] max-w-7xl py-8 px-4 space-y-6 md:space-y-8">
      <div className="bg-background border border-border p-5 md:p-6 space-y-5">
        {/* Header / Navigation */}
        <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-start">
          <div className="flex items-start gap-4 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              asChild
              aria-label="Back to my meal plans"
              className="rounded-lg hover:bg-muted"
            >
              <Link href="/meal-planner/my-meal-plans">
                <ChevronLeft className="w-6 h-6" />
              </Link>
            </Button>
            <div className="space-y-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl leading-tight font-extrabold tracking-tight text-foreground">
                {plan.name}
              </h1>
              <p className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm">
                <span className="capitalize font-medium text-primary">
                  {plan.goal?.replace("_", " ")}
                </span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <span className="capitalize">{plan.timeframe} Plan</span>
              </p>
            </div>
          </div>

          <div className="flex gap-2 sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 w-full sm:w-auto text-primary border-primary hover:bg-primary/5 hover:border-primary "
            >
              <Download className="w-4 h-4" /> Download PDF
            </Button>
          </div>
        </div>

        {/* Summary strip */}
        <div className="flex flex-wrap gap-2.5">
          {plan.diet && (
            <Badge
              variant="outline"
              className="px-3 py-1.5 text-xs text-muted-foreground sm:text-sm font-medium border border-border"
            >
              {plan.diet}
            </Badge>
          )}
          {plan.calories && (
            <Badge
              variant="outline"
              className="px-3 py-1.5 text-xs text-muted-foreground sm:text-sm font-medium border border-border"
            >
              {plan.calories} kcal/day
            </Badge>
          )}
          <Badge
            variant="outline"
            className="px-3 py-1.5 text-xs text-muted-foreground sm:text-sm font-medium"
          >
            {plan.meals_per_day} Meals / Day
          </Badge>
          <Badge
            variant="outline"
            className="px-3 py-1.5 text-xs text-muted-foreground sm:text-sm font-medium"
          >
            {plan.days?.length || 0} Days Total
          </Badge>
        </div>

        {plan.notes && (
          <div className="bg-muted/30 p-4 rounded-xl border border-border/50 text-sm leading-relaxed text-muted-foreground flex gap-3 items-start">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">
                Notes
              </p>
              {plan.notes}
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-12 lg:items-start">
        {/* Main Content: Days & Meals */}
        <div className="lg:col-span-8 space-y-6">
          {plan.days?.map((day: any, index: number) => (
            <Card
              key={day.id}
              id={`day-${index + 1}`}
              className="bg-card overflow-hidden border border-border/50 shadow-sm scroll-mt-28"
            >
              <CardHeader className="bg-muted/30 border-b pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-base">
                      {index + 1}
                    </div>
                    <span className="capitalize">{day.day}</span>
                  </CardTitle>
                  {day.total_calories > 0 && (
                    <Badge
                      variant="secondary"
                      className="font-mono text-xs sm:text-sm"
                    >
                      Total: {day.total_calories} kcal
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {day.meals?.map((meal: any, mIdx: number) => (
                  <div
                    key={meal.id}
                    className="relative pl-6 pr-4 py-3 rounded-xl border-l-2 border-border/60 hover:border-primary/50 hover:bg-muted/20 transition-colors group"
                  >
                    <div className="absolute -left-1.25 top-1.5 w-2.5 h-2.5 rounded-full bg-border group-hover:bg-primary transition-colors ring-4 ring-background" />

                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-base sm:text-lg leading-snug text-foreground group-hover:text-primary transition-colors">
                            {meal.name}
                          </h4>
                          <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                            {meal.description}
                          </p>
                        </div>
                        {meal.calories && (
                          <Badge
                            variant="outline"
                            className="shrink-0 font-mono text-xs sm:text-sm bg-background"
                          >
                            {meal.calories} kcal
                          </Badge>
                        )}
                      </div>

                      {(meal.protein || meal.carbs || meal.fat) && (
                        <div className="flex flex-wrap gap-2 text-xs pt-1">
                          {meal.protein && (
                            <span className="px-2 py-1 rounded-md bg-muted text-muted-foreground border border-border font-medium leading-none">
                              Protein: {meal.protein}g
                            </span>
                          )}
                          {meal.carbs && (
                            <span className="px-2 py-1 rounded-md bg-muted text-muted-foreground border border-border font-medium leading-none">
                              Carbs: {meal.carbs}g
                            </span>
                          )}
                          {meal.fat && (
                            <span className="px-2 py-1 rounded-md bg-muted text-muted-foreground border border-border font-medium leading-none">
                              Fat: {meal.fat}g
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {mIdx !== day.meals.length - 1 && (
                      <Separator className="mt-6 opacity-40" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar: Shopping List & Tips */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
          {/* Jump to Day */}
          {plan.days && plan.days.length > 1 && (
            <Card className="bg-card border border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  Jump to day
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-3 gap-2">
                  {plan.days.map((d: any, idx: number) => (
                    <Button
                      key={d.id ?? idx}
                      asChild
                      variant="outline"
                      size="sm"
                      className="justify-start bg-card hover:bg-muted text-xs"
                    >
                      <a href={`#day-${idx + 1}`}>
                        <span className="font-mono text-xs text-muted-foreground mr-2">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="capitalize truncate">{d.day}</span>
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Shopping List */}
          {plan.shopping_list && plan.shopping_list.length > 0 && (
            <Card className="bg-card border border-border/40 shadow-sm">
              <CardHeader className="pb-3 bg-success/5 border-b border-border/40">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <div className="p-2 rounded-lg bg-success/10 border border-success/20 text-success">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  Shopping List
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {plan.shopping_list.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-success/60 group-hover:bg-success transition-colors" />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Pro Tips */}
          {plan.pro_tips && plan.pro_tips.length > 0 && (
            <Card className="bg-card border border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Sparkles className="w-5 h-5 text-muted-foreground" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {plan.pro_tips.map((tip: string, i: number) => (
                  <div
                    key={i}
                    className="flex gap-3 bg-muted/30 p-3 rounded-lg border border-border/50"
                  >
                    <NotebookPen className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                    <div className="text-sm leading-relaxed text-muted-foreground [&_p]:m-0 [&_p]:leading-relaxed [&_strong]:text-foreground">
                      <ReactMarkdown>{tip}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealPlanView;
