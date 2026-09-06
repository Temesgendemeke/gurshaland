"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateMealPlan } from "@/actions/meal/generator";
import { saveMealplan } from "@/actions/meal/crud";
import { MEAL_PLAN_CREDIT_COST } from "@/constants/creditCosts";
import { getCredits } from "@/actions/credits";
import generate_error from "@/utils/generate_error";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import { requireLogin, savePendingAIGeneration } from "@/lib/auth-gate";
import { useAutonomousAction } from "@/components/chat/use-autonomous";
import AutonomousBanner from "@/components/chat/AutonomousBanner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertCircle,
  Apple,
  Calendar,
  ChefHat,
  Clock,
  Coins,
  Flame,
  Heart,
  Loader2,
  Salad,
  SaveIcon,
  TrendingUp,
  Utensils,
} from "lucide-react";
import { mealPlannerType, mealPlannerSchema } from "@/schema/meal-planner";
import PreviewSection from "./PreviewSection";
import MealPlanProgressBar from "./MealPlanProgressBar";
import AdvancedNutritionFields from "./AdvancedNutritionFields";
import MealPlanEmptyState from "./MealPlanEmptyState";
import { IconSparkles2Filled } from "@tabler/icons-react";
import MealPlanPdfModal from "@/components/pdf/MealPlanPdfModal";
import { generateMealPlanPdf } from "@/actions/pdf";
import { MEAL_PLAN_PDF_CREDIT_COST } from "@/constants/creditCosts";
import { useTypingPlaceholder } from "@/hooks/useTypingPlaceholder";

const fieldClasses = "h-11 rounded-xl border bg-background";

const PLACEHOLDER_EXAMPLES = [
  "High-protein vegetarian meals, quick breakfasts, avoid peanuts",
  "Prefer traditional fasting dishes, keep cooking time under 30 min",
  "Low-carb dinners, easy to meal prep for the week with teff injera",
];

export default function MealPlanner() {
  const user = useAuth((store) => store.user);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<mealPlannerType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const typedPlaceholder = useTypingPlaceholder(PLACEHOLDER_EXAMPLES);

  const loadCredits = () => getCredits().then((balance) => setCredits(balance));

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      getCredits().then((balance) => {
        if (!cancelled) setCredits(balance);
      });
    };

    if (useAuth.getState().user) load();

    const unsubscribe = useAuth.subscribe((state, prevState) => {
      if (state.user && !prevState.user) load();
      else if (!state.user && prevState.user) setCredits(null);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const needsLogin = !user;
  const outOfCredits =
    !!user && credits !== null && credits < MEAL_PLAN_CREDIT_COST;

  const form = useForm<mealPlannerType>({
    resolver: zodResolver(mealPlannerSchema),
    defaultValues: {
      timeframe: "today",
      goal: "fat_loss",
      diet: "standard",
      meals_per_day: 3,
      calories: undefined,
      days: [],
      notes: "",
      pro_tips: [],
      age: undefined,
      gender: undefined,
      height: {
        value: 0,
        unit: "m",
      },
      weight: {
        value: 0,
        unit: "kg",
      },
      activity_level: undefined,
      shopping_list: [],
    },
  });

  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const autonomous = useAutonomousAction(
    "meal-plan",
    !!user,
    () => submitBtnRef.current?.click(),
    (pending) => {
      const merged = {
        ...form.getValues(),
        ...(pending.values ?? {}),
      } as mealPlannerType;
      if (!merged.height?.value) merged.height = undefined;
      if (!merged.weight?.value) merged.weight = undefined;
      form.reset(merged);
    },
    5000,
  );

  const handleLoginRedirect = (values?: Record<string, unknown>) => {
    savePendingAIGeneration({
      action: "meal-plan",
      values: values ?? (form.getValues() as Record<string, unknown>),
    });
    requireLogin();
  };

  const onSubmit = async (data: mealPlannerType) => {
    setError(null);
    setPlan(null);

    if (needsLogin) {
      handleLoginRedirect(data as Record<string, unknown>);
      return;
    }

    setIsLoading(true);
    const res = await generateMealPlan(data);
    if (!res?.success) {
      setError(res?.error || "Failed to generate meal plan");
      setIsLoading(false);
      return;
    }
    setPlan(res);
    setIsLoading(false);
    await loadCredits();
  };

  const handleSave = async () => {
    if (!plan || !user?.id) return;
    try {
      await saveMealplan({
        ...plan,
        author_id: user.id,
      } as mealPlannerType & { author_id: string });
      toast.success("Meal plan saved successfully");
      router.push("/meal-planner/my-meal-plans");
    } catch (err) {
      toast.error(generate_error(err));
    }
  };

  useEffect(() => {
    if ((isLoading || plan) && previewRef.current) {
      setTimeout(() => {
        previewRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
  }, [isLoading, plan]);

  return (
    <div className="mx-auto w-full max-w-7xl px-3.5 sm:px-6 lg:px-8 pb-16 pt-6 sm:pt-8">
      <div className="mt-4 sm:mt-6 max-w-2xl mx-auto text-center">
        <h1 className="font-gosh text-2xl sm:text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-foreground">
          Build your Ethiopian meal plan
        </h1>
        <p className="mt-2.5 sm:mt-3 text-xs sm:text-base leading-relaxed text-muted-foreground">
          Set your goals, diet, and preferences. AI assembles an authentic
          Ethiopian meal plan for today or the whole week, with a shopping list
          and pro tips.
        </p>
      </div>

      <div
        className={cn(
          "mx-auto mt-10 grid items-start gap-6 rounded-2xl border border-border bg-card lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-2",
        )}
      >
        {/* Form column */}
        <div className="@container">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-gosh text-lg font-bold tracking-tight text-foreground">
                  Configure your plan
                </h2>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Set your preferences, then let AI build the rest.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[0.6875rem] font-medium text-muted-foreground">
                <Coins
                  className="h-3.5 w-3.5 text-primary"
                  strokeWidth={1.75}
                />
                {user
                  ? credits === null
                    ? "…"
                    : `${credits} credits`
                  : "100 free credits"}
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-6 space-y-6"
              >
                {/* Timeframe Selection */}
                <FormField
                  control={form.control}
                  name="timeframe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Planning period</FormLabel>
                      <FormControl>
                        <Tabs
                          value={field.value}
                          onValueChange={field.onChange}
                          className="w-full"
                        >
                          <TabsList className="grid w-full grid-cols-2 rounded-xl border border-border bg-muted p-1">
                            <TabsTrigger
                              value="today"
                              className="rounded-lg text-sm data-[state=active]:bg-card data-[state=active]:font-medium data-[state=active]:border data-[state=active]:border-border/80"
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              Today
                            </TabsTrigger>
                            <TabsTrigger
                              value="full-week"
                              className="rounded-lg text-sm data-[state=active]:bg-card data-[state=active]:font-medium data-[state=active]:border data-[state=active]:border-border/80"
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              Full Week
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Goal, Diet, Meals Grid */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="goal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your goal</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={`${fieldClasses} hover:border-primary/60`}
                            >
                              <SelectValue placeholder="Select your goal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="fat_loss">
                              <div className="flex items-center gap-2">
                                <Flame className="h-4 w-4 text-muted-foreground" />
                                <span>Fat Loss</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="muscle_gain">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                <span>Muscle Gain</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="maintenance">
                              <div className="flex items-center gap-2">
                                <Heart className="h-4 w-4 text-muted-foreground" />
                                <span>Maintenance</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="diet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diet type</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={`${fieldClasses} hover:border-primary/60`}
                            >
                              <SelectValue placeholder="Select diet type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard">
                              <div className="flex items-center gap-2">
                                <Utensils className="h-4 w-4 text-muted-foreground" />
                                <span>Standard</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="vegetarian">
                              <div className="flex items-center gap-2">
                                <Apple className="h-4 w-4 text-muted-foreground" />
                                <span>Vegetarian</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="vegan">
                              <div className="flex items-center gap-2">
                                <Salad className="h-4 w-4 text-muted-foreground" />
                                <span>Vegan</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="keto">
                              <div className="flex items-center gap-2">
                                <ChefHat className="h-4 w-4 text-muted-foreground" />
                                <span>Keto</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="meals_per_day"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meals per day</FormLabel>
                        <Select
                          value={String(field.value)}
                          onValueChange={(v) => field.onChange(parseInt(v, 10))}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={`${fieldClasses} hover:border-primary/60`}
                            >
                              <SelectValue placeholder="Select meals" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[2, 3, 4, 5, 6].map((n) => (
                              <SelectItem key={n} value={String(n)}>
                                {n} Meals
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Modular Advanced Nutrition & Body Metrics */}
                <AdvancedNutritionFields
                  form={form}
                  fieldClasses={fieldClasses}
                />

                {/* Special Instructions */}
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Special instructions{" "}
                        <span className="font-normal text-muted-foreground">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={typedPlaceholder}
                          className="min-h-24 resize-none rounded-xl border bg-background text-base"
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormDescription>
                        <span className="mt-3 flex items-start gap-2 rounded-lg border border-border/80 bg-muted/50 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          This is not medical advice. Consult a healthcare
                          professional for personalized nutrition guidance.
                        </span>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Action Area */}
                <div>
                  {needsLogin ? (
                    <p className="mb-3 rounded-lg border border-border/80 bg-muted/50 px-3 py-2.5 text-sm text-muted-foreground">
                      <button
                        type="button"
                        onClick={() => handleLoginRedirect()}
                        className="font-medium text-primary underline underline-offset-2"
                      >
                        Sign in
                      </button>{" "}
                      to generate and save your personalized meal plans.
                    </p>
                  ) : outOfCredits ? (
                    <p className="mb-3 rounded-lg border border-border/80 bg-muted/50 px-3 py-2.5 text-sm text-muted-foreground">
                      You need at least {MEAL_PLAN_CREDIT_COST} credits.{" "}
                      <button
                        type="button"
                        onClick={() => router.push("/pricing")}
                        className="font-medium text-primary underline underline-offset-2"
                      >
                        Get more credits
                      </button>
                    </p>
                  ) : null}

                  <Button
                    ref={submitBtnRef}
                    type="submit"
                    disabled={isLoading || outOfCredits}
                    className="h-11 w-full rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 shadow-none"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating your plan…
                      </>
                    ) : (
                      <>
                        <IconSparkles2Filled className="mr-2 h-4 w-4" />
                        Generate meal plan
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Result column */}
        <div ref={previewRef} className="flex min-w-0 scroll-mt-24 lg:self-stretch">
          {isLoading ? (
            <div className="w-full">
              <MealPlanProgressBar isGenerating={isLoading} />
            </div>
          ) : plan ? (
            <div className="w-full space-y-5 rounded-2xl bg-card p-4 sm:p-6 border border-border shadow-none">
              <div className="flex flex-col gap-4 border-b border-border/70 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Generated plan
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    Review the schedule, then save it when it looks right.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                  <MealPlanPdfModal
                    generate={() => generateMealPlanPdf(plan)}
                    cost={MEAL_PLAN_PDF_CREDIT_COST}
                    plan={plan}
                    variant="outline"
                    size="sm"
                  />
                  <Button
                    type="button"
                    onClick={handleSave}
                    className="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 shadow-none"
                  >
                    <SaveIcon className="mr-1.5 h-4 w-4" />
                    Save plan
                  </Button>
                </div>
              </div>
              <PreviewSection plan={plan} />
            </div>
          ) : (
            <MealPlanEmptyState
              error={error}
              onRetry={() => form.handleSubmit(onSubmit)()}
            />
          )}
        </div>
      </div>

      {autonomous.active && (
        <AutonomousBanner
          label="Meal plan"
          description="GurshaAI is filling in your preferences and will press Generate automatically."
          remainingMs={autonomous.remainingMs}
          totalMs={autonomous.totalMs}
          onCancel={autonomous.cancel}
          onRunNow={autonomous.runNow}
        />
      )}
    </div>
  );
}
