"use client";

import * as React from "react";
import { useState, useTransition, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateMealPlan } from "@/actions/meal/generator";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Calendar,
  Target,
  Utensils,
  Flame,
  ShoppingCart,
  Sparkles,
  ChefHat,
  Apple,
  Salad,
  Clock,
  TrendingUp,
  Heart,
  Zap,
  Weight,
  HandMetal,
  Trophy,
  Ruler,
  User,
  Watch,
} from "lucide-react";
import { mealPlannerType, mealPlannerSchema } from "@/schema/meal-planner";
import PreviewSection from "./PreviewSection";
import { ScrollArea } from "../ui/scroll-area";
import FullMealPlanModel from "./FullMealPlanModel";
import {
  heightMeasurements,
  weightMeasurements,
} from "@/constants/measurements";

export default function MealPlanner() {
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<mealPlannerType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

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

  const onSubmit = async (data: mealPlannerType) => {
    setError(null);
    setPlan(null);
    setIsLoading(true);
    const res = await generateMealPlan(data);
    if (!res?.success) {
      setError(res?.error || "Failed to generate meal plan");
      setIsLoading(false);
      return;
    }
    setPlan(res);
    setIsLoading(false);
  };

  useEffect(() => {
    if (plan && previewRef.current) {
      setTimeout(() => {
        previewRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
  }, [plan]);

  const activityLevelOptions = [
    { value: "sedentary", label: "sedentary" },
    { value: "lightly_active", label: "lightly active" },
    { value: "moderately_active", label: "moderately active" },
    { value: "extremely_active", label: "extremely active" },
  ];

  return (
    <div className="pt-10 z-0 mt-6 md:mt-10">
      <div className="max-w-7xl mx-auto space-y-8 mb-10 p-2">
        {/* Header */}
        <div className="text-center space-y-4 mb-12 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-border mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              AI-Powered Nutrition
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold heading-primary pb-1">
            Meal Planner
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            Create personalized meal plans tailored to your goals, dietary
            preferences, and lifestyle
          </p>
        </div>

        <div
          className={`grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden ${plan?.timeframe ? "grid" : "block"}`}
        >
          {/* Main Form Card */}
          <Card className="bg-card border border-border/40 shadow-sm relative overflow-hidden order-2 lg:order-0">
            <CardHeader className="relative pb-8">
              <CardTitle className="text-3xl font-bold flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary text-primary-foreground">
                  <ChefHat className="h-6 w-6 text-primary-foreground" />
                </div>
                Configure Your Plan
              </CardTitle>
              <CardDescription className="text-base">
                Customize your meal plan with your preferences and let AI do the
                rest
              </CardDescription>
            </CardHeader>

            <CardContent className="relative">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {/* Timeframe Selection */}
                  <FormField
                    control={form.control}
                    name="timeframe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          Planning Period
                        </FormLabel>
                        <FormControl>
                          <Tabs
                            value={field.value}
                            onValueChange={field.onChange}
                            className="w-full"
                          >
                            <TabsList className="grid grid-cols-2 w-full h-14 rounded-lg bg-muted p-1.5 border border-border">
                              <TabsTrigger
                                value="today"
                                className="rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all font-semibold text-base"
                              >
                                <Clock className="h-4 w-4 mr-2" />
                                Today
                              </TabsTrigger>
                              <TabsTrigger
                                value="full-week"
                                className="rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all font-semibold text-base"
                              >
                                <Calendar className="h-4 w-4 mr-2" />
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Goal Selection */}
                    <FormField
                      control={form.control}
                      name="goal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary" />
                            Your Goal
                          </FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl border-2 bg-background hover:border-primary transition-colors">
                                <SelectValue placeholder="Select your goal" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem
                                value="fat_loss"
                                className="cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <Flame className="h-4 w-4 text-muted-foreground" />
                                  <span>Fat Loss</span>
                                </div>
                              </SelectItem>
                              <SelectItem
                                value="muscle_gain"
                                className="cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                  <span>Muscle Gain</span>
                                </div>
                              </SelectItem>
                              <SelectItem
                                value="maintenance"
                                className="cursor-pointer"
                              >
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

                    {/* Diet Selection */}
                    <FormField
                      control={form.control}
                      name="diet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold flex items-center gap-2">
                            <Utensils className="h-4 w-4 text-primary" />
                            Diet Type
                          </FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl border-2 bg-background hover:border-primary transition-colors">
                                <SelectValue placeholder="Select diet type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem
                                value="standard"
                                className="cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <Utensils className="h-4 w-4 text-muted-foreground" />
                                  <span>Standard</span>
                                </div>
                              </SelectItem>
                              <SelectItem
                                value="vegetarian"
                                className="cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <Apple className="h-4 w-4 text-muted-foreground" />
                                  <span>Vegetarian</span>
                                </div>
                              </SelectItem>
                              <SelectItem
                                value="vegan"
                                className="cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <Salad className="h-4 w-4 text-muted-foreground" />
                                  <span>Vegan</span>
                                </div>
                              </SelectItem>
                              <SelectItem
                                value="keto"
                                className="cursor-pointer"
                              >
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

                    {/* Meals Per Day */}
                    <FormField
                      control={form.control}
                      name="meals_per_day"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold flex items-center gap-2">
                            <Utensils className="h-4 w-4 text-primary" />
                            Meals Per Day
                          </FormLabel>
                          <Select
                            value={String(field.value)}
                            onValueChange={(v) => field.onChange(parseInt(v))}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl border-2 bg-background hover:border-primary transition-colors">
                                <SelectValue placeholder="Select meals" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[2, 3, 4, 5, 6].map((n) => (
                                <SelectItem
                                  key={n}
                                  value={String(n)}
                                  className="cursor-pointer"
                                >
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

                  <div className="grid lg:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold flex items-center gap-2">
                            <Watch className="h-4 w-4 text-primary" />
                            Age (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              inputMode="numeric"
                              placeholder="e.g., 20 years"
                              className="h-12 rounded-xl border-2 bg-background hover:border-primary transition-colors text-base"
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
                          <FormDescription className="text-sm">
                            Leave empty for AI to suggest based on your goal
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
                          <FormLabel className="text-base font-semibold flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            Gender (Optional)
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="h-12 rounded-xl border-2 bg-background hover:border-primary transition-colors">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem
                                  value="male"
                                  className="cursor-pointer"
                                >
                                  Male
                                </SelectItem>
                                <SelectItem
                                  value="female"
                                  className="cursor-pointer"
                                >
                                  Female
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription className="text-sm">
                            Leave empty for AI to suggest based on your goal
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Height Input Group */}
                    <div className="space-y-2">
                      <FormLabel className="text-base font-semibold flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-primary" />
                        Height (Optional)
                      </FormLabel>
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
                                  className="h-12 rounded-xl border-2 bg-background hover:border-primary transition-colors text-base"
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
                            <FormItem className="w-30">
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="h-12 rounded-xl border-2 bg-background hover:border-primary transition-colors">
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
                      <FormDescription className="text-sm">
                        Leave empty for AI to suggest
                      </FormDescription>
                    </div>

                    {/* Weight Input Group */}
                    <div className="space-y-2">
                      <FormLabel className="text-base font-semibold flex items-center gap-2">
                        <Weight className="h-4 w-4 text-primary" />
                        Weight (Optional)
                      </FormLabel>
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
                                  className="h-12 rounded-xl border-2 bg-background hover:border-primary transition-colors text-base"
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
                            <FormItem className="w-30">
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="h-12 rounded-xl border-2 bg-background hover:border-primary transition-colors">
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
                      <FormDescription className="text-sm">
                        Leave empty for AI to suggest
                      </FormDescription>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="activity_level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-primary" />
                            Activity Level (Optional)
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="h-12 rounded-xl border-2 bg-background hover:border-primary transition-colors">
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
                          <FormDescription className="text-sm">
                            How active you are throughout the day.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Calories Input */}
                    <FormField
                      control={form.control}
                      name="calories"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold flex items-center gap-2">
                            <Zap className="h-4 w-4 text-primary" />
                            Daily Calorie Target (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              inputMode="numeric"
                              min={800}
                              max={5000}
                              placeholder="e.g., 2000 calories"
                              className="h-12 rounded-xl border-2 bg-background hover:border-primary transition-colors text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-sm">
                            Leave empty for AI to suggest based on your goal
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* AI Prompt */}
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          Special Instructions for AI
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., High-protein vegetarian meals, quick breakfasts, avoid peanuts, prefer Mediterranean cuisine, budget-friendly options..."
                            className="min-h-32 rounded-xl border-2 bg-background hover:border-primary transition-colors resize-none text-base"
                            {...field}
                            rows={4}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          <span className="inline-flex items-start gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-muted-foreground w-full my-4">
                            <span>
                              This is not medical advice. Consult a healthcare
                              professional for personalized nutrition guidance.
                            </span>
                          </span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Generate Button */}
                  <div className="">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      size="lg"
                      className="w-full h-14 text-lg font-bold rounded-xl btn-primary-modern"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating Your Perfect Plan...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Generate Meal Plan
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* meal planner preview section */}
          {plan && (
            <div ref={previewRef} className="scroll-mt-20">
              <PreviewSection plan={plan} />
              <FullMealPlanModel plan={plan} />
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-2 border-error/20 bg-error/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-error/10">
                  <Flame className="h-5 w-5 text-error" />
                </div>
                <div>
                  <h3 className="font-semibold text-error">Error</h3>
                  <p className="text-sm text-error/80">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
