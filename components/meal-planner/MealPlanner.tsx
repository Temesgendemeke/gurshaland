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
import { Input } from "@/components/ui/input";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertCircle,
  Apple,
  ArrowLeft,
  Calendar,
  ChefHat,
  ChevronDown,
  Clock,
  Coins,
  Flame,
  Heart,
  Loader2,
  RefreshCw,
  Salad,
  SaveIcon,
  TrendingUp,
  Utensils,
} from "lucide-react";
import { mealPlannerType, mealPlannerSchema } from "@/schema/meal-planner";
import PreviewSection from "./PreviewSection";
import MealPlanProgressBar from "./MealPlanProgressBar";
import {
  heightMeasurements,
  weightMeasurements,
} from "@/constants/measurements";
import { IconSparkles2Filled } from "@tabler/icons-react";
import Link from "next/link";
import DownloadPdfButton from "@/components/pdf/DownloadPdfButton";
import { generateMealPlanPdf } from "@/actions/pdf";
import { MEAL_PLAN_PDF_CREDIT_COST } from "@/constants/creditCosts";

const fieldClasses = "h-11 rounded-xl border bg-background";

const PLACEHOLDER_EXAMPLES = [
  "High-protein vegetarian meals, quick breakfasts, avoid peanuts",
  "Prefer Mediterranean cuisine, keep cooking time under 30 min",
  "Low-carb dinners, easy to meal prep for the week",
];

function useTypingPlaceholder(
  examples: string[],
  options: { typing?: number; deleting?: number; hold?: number } = {},
) {
  const { typing = 45, deleting = 18, hold = 1800 } = options;
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = examples[index % examples.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && text === current) {
      timeout = setTimeout(() => setIsDeleting(true), hold);
    } else if (isDeleting && text === "") {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setIndex((i) => (i + 1) % examples.length);
      });
    } else {
      timeout = setTimeout(
        () => {
          setText(
            isDeleting
              ? current.slice(0, text.length - 1)
              : current.slice(0, text.length + 1),
          );
        },
        isDeleting ? deleting : typing,
      );
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, index, examples, typing, deleting, hold]);

  return text;
}

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
      await saveMealplan({ ...plan, author_id: user.id } as mealPlannerType & { author_id: string });
      toast.message("Meal plan saved successfully");
      router.push("/meal-planner/my-meal-plans");
    } catch (error) {
      console.log(error);
      toast.message(generate_error(error));
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

  const activityLevelOptions = [
    { value: "sedentary", label: "sedentary" },
    { value: "lightly_active", label: "lightly active" },
    { value: "moderately_active", label: "moderately active" },
    { value: "extremely_active", label: "extremely active" },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6">
      {/* Header */}
      <Link
        href="/ai-features"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to AI Features
      </Link>

      <div className="mt-6 max-w-2xl  mx-auto text-center">
        <h1 className="font-gosh text-3xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          Build your Ethiopian meal plan
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
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
                              className="rounded-lg text-sm data-[state=active]:bg-card data-[state=active]:font-medium data-[state=active]:shadow-sm"
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              Today
                            </TabsTrigger>
                            <TabsTrigger
                              value="full-week"
                              className="rounded-lg text-sm data-[state=active]:bg-card data-[state=active]:font-medium data-[state=active]:shadow-sm"
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
                <div className="grid gap-4 @lg:grid-cols-3">
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
                          onValueChange={(v) => field.onChange(parseInt(v))}
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

                {/* Advanced Options */}
                <Collapsible className="group">
                  <CollapsibleTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-sm font-medium text-primary"
                    >
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      Advanced options
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-4 grid gap-4 @md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                inputMode="numeric"
                                placeholder="e.g., 20"
                                className={`${fieldClasses} text-base`}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? parseInt(e.target.value)
                                      : undefined,
                                  )
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              Leave empty for AI to suggest
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger
                                  className={`${fieldClasses} hover:border-primary/60`}
                                >
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormDescription>
                              Leave empty for AI to suggest
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <FormLabel>Height</FormLabel>
                        <div className="flex gap-2">
                          <FormField
                            control={form.control}
                            name="height.value"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Value"
                                    className={`${fieldClasses} text-base`}
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(e.target.valueAsNumber)
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="height.unit"
                            render={({ field }) => (
                              <FormItem className="w-32">
                                <FormControl>
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <SelectTrigger
                                      className={`${fieldClasses} hover:border-primary/60`}
                                    >
                                      <SelectValue placeholder="Unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {heightMeasurements.map((m) => (
                                        <SelectItem key={m.code} value={m.code}>
                                          {m.code} ({m.name})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormDescription>
                          Leave empty for AI to suggest
                        </FormDescription>
                      </div>

                      <div className="space-y-2">
                        <FormLabel>Weight</FormLabel>
                        <div className="flex gap-2">
                          <FormField
                            control={form.control}
                            name="weight.value"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Value"
                                    className={`${fieldClasses} text-base`}
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(e.target.valueAsNumber)
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="weight.unit"
                            render={({ field }) => (
                              <FormItem className="w-32">
                                <FormControl>
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <SelectTrigger
                                      className={`${fieldClasses} hover:border-primary/60`}
                                    >
                                      <SelectValue placeholder="Unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {weightMeasurements.map((m) => (
                                        <SelectItem key={m.code} value={m.code}>
                                          {m.code} ({m.name})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormDescription>
                          Leave empty for AI to suggest
                        </FormDescription>
                      </div>

                      <FormField
                        control={form.control}
                        name="activity_level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Activity level</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger
                                  className={`${fieldClasses} hover:border-primary/60`}
                                >
                                  <SelectValue placeholder="Select activity level" />
                                </SelectTrigger>
                                <SelectContent>
                                  {activityLevelOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormDescription>
                              How active you are throughout the day
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="calories"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Daily calorie target</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                inputMode="numeric"
                                min={800}
                                max={5000}
                                placeholder="e.g., 2000"
                                className={`${fieldClasses} text-base`}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Leave empty for AI to suggest
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>

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

                {/* Generate Button */}
                <div>
                  {needsLogin ? (
                    <p className="mb-3 rounded-lg border border-border/80 bg-muted/50 px-3 py-2.5 text-sm text-muted-foreground">
                      <button
                        type="button"
                        onClick={() => handleLoginRedirect()}
                        className="font-medium text-primary underline underline-offset-2"
                      >
                        Log in
                      </button>{" "}
                      to generate meal plans. New users get 100 free credits.
                    </p>
                  ) : outOfCredits ? (
                    <p className="mb-3 rounded-lg border border-error/25 bg-error/5 px-3 py-2.5 text-sm leading-relaxed text-muted-foreground">
                      You&apos;re out of credits. Each meal plan costs{" "}
                      {MEAL_PLAN_CREDIT_COST} credits.{" "}
                      <a
                        href="/credits"
                        className="font-medium text-primary underline underline-offset-2"
                      >
                        Buy more credits
                      </a>
                      .
                    </p>
                  ) : (
                    <p className="mb-3 text-xs text-muted-foreground">
                      Costs {MEAL_PLAN_CREDIT_COST} credits per generation.
                    </p>
                  )}
                  <Button
                    ref={submitBtnRef}
                    type="submit"
                    disabled={isLoading || outOfCredits}
                    className="h-11 w-full rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating your meal plan...
                      </>
                    ) : (
                      <>
                        <IconSparkles2Filled className="mr-2 h-5 w-5" />
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
            <div className="w-full space-y-5 rounded-xl bg-card p-4 py-6 ring-1 ring-border/10 ">
              <div className="flex flex-col gap-4 border-b border-border/70 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Generated plan
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    Review the schedule, then save it when it looks right.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <DownloadPdfButton
                    generate={() => generateMealPlanPdf(plan)}
                    cost={MEAL_PLAN_PDF_CREDIT_COST}
                    variant="outline"
                    size="sm"
                  />
                  <Button
                    type="button"
                    onClick={handleSave}
                    className="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    <SaveIcon className="mr-1.5 h-4 w-4" />
                    Save plan
                  </Button>
                </div>
              </div>
              <PreviewSection plan={plan} />
            </div>
          ) : error ? (
            <div className="w-full border-y border-error/30 px-1 py-8">
              <div className="flex items-start gap-3">
                <AlertCircle
                  className="mt-0.5 h-5 w-5 shrink-0 text-error"
                  strokeWidth={1.75}
                />
                <div>
                  <h3 className="font-gosh text-lg font-semibold tracking-tight text-foreground">
                    Couldn&apos;t generate your meal plan
                  </h3>
                  <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    {error}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-5 rounded-md"
                    onClick={() => form.handleSubmit(onSubmit)()}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try again
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full flex-col items-center justify-center self-stretch rounded-xl   p-8 text-center min-h-[16rem] lg:min-h-0">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Calendar className="h-6 w-6" strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 font-gosh text-lg font-semibold tracking-tight text-foreground">
                Your meal plan will appear here
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                Set a timeframe, goal, and diet then generate to see your
                full Ethiopian menu, nutrition breakdown, and shopping list.
              </p>
            </div>
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
