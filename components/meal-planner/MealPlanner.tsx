"use client";

import * as React from "react";
import { useTransition, useState } from "react";
import { generateMealPlan } from "@/actions/meal-planner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

type DayPlan = {
  day: string;
  meals: {
    name: string;
    description: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  }[];
  totalCalories?: number;
};

type Plan = {
  timeframe: "today" | "weekend";
  goal: "fat_loss" | "muscle_gain" | "maintenance";
  diet: "standard" | "vegetarian" | "vegan" | "keto";
  calories?: number;
  mealsPerDay: number;
  days: DayPlan[];
  shoppingList?: string[];
  notes?: string;
};

export default function MealPlanner() {
  const [isPending, startTransition] = useTransition();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [timeframe, setTimeframe] = useState<"today" | "weekend">("today");
  const [goal, setGoal] = useState<"fat_loss" | "muscle_gain" | "maintenance">(
    "fat_loss"
  );
  const [diet, setDiet] = useState<
    "standard" | "vegetarian" | "vegan" | "keto"
  >("standard");
  const [mealsPerDay, setMealsPerDay] = useState<number>(3);
  const [calories, setCalories] = useState<number | undefined>(undefined);
  const [prompt, setPrompt] = useState<string>("");

  const onGenerate = () => {
    setError(null);
    setPlan(null);
    startTransition(async () => {
      const res = await generateMealPlan({
        timeframe,
        goal,
        diet,
        mealsPerDay,
        calories: calories || undefined,
        prompt,
      });
      if (!res?.success) {
        setError(res?.error || "Failed to generate meal plan");
        return;
      }
      setPlan(res.plan);
    });
  };

  return (
    <div className="space-y-8 ">
      {/* Input Card */}
      <Card className="relative overflow-hidden  backdrop-blur-xl">
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />

        <CardHeader>
          <CardTitle className="text-xl md:text-2xl tracking-tight bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
            Meal Planner
          </CardTitle>
          <CardDescription className="text-sm">
            Plan for today, the weekend, or a custom range. Add your goals and a
            short AI prompt.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Segmented tabs */}
          <Tabs
            value={timeframe}
            onValueChange={(v) => setTimeframe(v as any)}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full rounded-full bg-muted/50 p-1">
              {["today", "weekend"].map((t) => (
                <TabsTrigger
                  key={t}
                  value={t}
                  className="
                    rounded-full data-[state=active]:bg-background data-[state=active]:text-foreground
                    data-[state=active]:shadow-sm transition-colors
                    text-xs md:text-sm
                  "
                >
                  {t[0].toUpperCase() + t.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="today" />
            <TabsContent value="weekend" />
          </Tabs>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Goal</Label>
              <Select value={goal} onValueChange={(v) => setGoal(v as any)}>
                <SelectTrigger className="bg-background/70 backdrop-blur">
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fat_loss">Fat loss</SelectItem>
                  <SelectItem value="muscle_gain">Muscle gain</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Diet</Label>
              <Select value={diet} onValueChange={(v) => setDiet(v as any)}>
                <SelectTrigger className="bg-background/70 backdrop-blur">
                  <SelectValue placeholder="Select diet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="keto">Keto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Meals per day</Label>
              <Select
                value={String(mealsPerDay)}
                onValueChange={(v) => setMealsPerDay(parseInt(v))}
              >
                <SelectTrigger className="bg-background/70 backdrop-blur">
                  <SelectValue placeholder="Meals/day" />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Calories (optional)</Label>
              <Input
                type="number"
                inputMode="numeric"
                min={800}
                max={5000}
                placeholder="e.g. 2000"
                className="bg-background/70 backdrop-blur"
                value={calories ?? ""}
                onChange={(e) =>
                  setCalories(
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tell the AI what you want</Label>
            <Textarea
              placeholder="High-protein vegetarian meals, quick breakfasts, avoid peanuts..."
              className="bg-background/70 backdrop-blur"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
            <p className="text-[11px] text-muted-foreground">
              Note: This is not medical advice.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              onClick={onGenerate}
              disabled={isPending}
              className="relative overflow-hidden rounded-full px-5"
            >
              <span className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-500 to-sky-500 opacity-80" />
              <span className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(255,255,255,0.25),transparent)]" />
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate plan"
              )}
            </Button>
            

          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="text-sm text-red-500 bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {/* Results */}
      {plan && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Summary + Days */}
          <Card className="md:col-span-8 bg-background/60 backdrop-blur border border-foreground/10">
            <CardHeader className="pb-2">
              <CardTitle className="flex flex-wrap items-center gap-2">
                Plan
                <Badge variant="secondary" className="capitalize">
                  {plan.timeframe.replace("_", " ")}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {plan.goal.replace("_", " ")}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {plan.diet}
                </Badge>
                {plan.calories ? (
                  <Badge variant="outline">{plan.calories} kcal/day</Badge>
                ) : null}
              </CardTitle>
              {plan.notes ? (
                <CardDescription>{plan.notes}</CardDescription>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {plan.days.map((d) => (
                  <Card
                    key={d.day}
                    className="bg-card/50 border border-foreground/10 hover:border-foreground/20 transition-colors"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{d.day}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {d.meals.map((m, idx) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between gap-4 border-b border-border/60 pb-3 last:border-b-0"
                        >
                          <div>
                            <div className="font-medium">{m.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {m.description}
                            </div>
                          </div>
                          <div className="text-right text-xs text-muted-foreground space-y-0.5 min-w-[120px]">
                            {typeof m.calories === "number" ? (
                              <div>{m.calories} kcal</div>
                            ) : null}
                            <div className="flex items-center gap-2 justify-end">
                              {typeof m.protein === "number" ? (
                                <Badge variant="outline">P {m.protein}g</Badge>
                              ) : null}
                              {typeof m.carbs === "number" ? (
                                <Badge variant="outline">C {m.carbs}g</Badge>
                              ) : null}
                              {typeof m.fat === "number" ? (
                                <Badge variant="outline">F {m.fat}g</Badge>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ))}
                      {typeof d.totalCalories === "number" && (
                        <div className="text-right text-xs text-muted-foreground">
                          Day total: {d.totalCalories} kcal
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shopping list / Meta */}
          <div className="md:col-span-4 space-y-6">
            {plan.shoppingList?.length ? (
              <Card className="bg-background/60 backdrop-blur border border-foreground/10 sticky top-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Shopping list</CardTitle>
                  <CardDescription className="text-xs">
                    Auto-generated from your plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground grid gap-1">
                    {plan.shoppingList.map((i, idx) => (
                      <li key={idx}>{i}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : null}

            <Card className="bg-background/60 backdrop-blur border border-foreground/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Tips</CardTitle>
                <CardDescription className="text-xs">
                  Adjust meals for schedule and allergies.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <p>- Prep proteins in bulk to save time.</p>
                <p>
                  - Keep snacks aligned with your goal (protein/yogurt/nuts).
                </p>
                <p>- Hydrate consistently throughout the day.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
