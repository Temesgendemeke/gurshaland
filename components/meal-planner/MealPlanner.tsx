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
  Watch
} from "lucide-react";
import {
  mealPlannerType,
  mealPlannerSchema

} from "@/schema/meal-planner";
import PreviewSection from "./PreviewSection";
import { ScrollArea } from "../ui/scroll-area";
import FullMealPlanModel from "./FullMealPlanModel";
import { heightMeasurements, weightMeasurements } from "@/constants/measurements";

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
        unit: 'm'
      },
      weight: {
        value: 0,
        unit: 'kg',
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
    <div className="pt-10 z-0"
      style={{
        backgroundImage: `
        linear-gradient(to right, #e5e7eb 1px, transparent 1px),
        linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
      `,
        backgroundSize: "40px 40px",
      }}
    >



      <div className="max-w-7xl mx-auto space-y-8 mb-10 p-2">
        {/* Header */}
        <div className="text-center space-y-4 mb-12 relative">
          {/* Background blur to make text pop against grid */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-40 bg-white/80 dark:bg-gray-950/80 blur-2xl -z-10 rounded-full" />

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-sky-500/10 border border-emerald-500/20 mb-4 backdrop-blur-sm shadow-sm">
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">AI-Powered Nutrition</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-emerald-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent drop-shadow-sm pb-1">
            Meal Planner
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Create personalized meal plans tailored to your goals, dietary preferences, and lifestyle
          </p>
        </div>

        <div className={`grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden ${plan?.timeframe ? 'grid' : 'block'}`}>

          {/* Main Form Card */}
          <Card className="relative overflow-hidden border-2 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl order-2 lg:order-none">
            {/* Decorative gradients */}
            <div className="pointer-events-none absolute -top-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-500/20 to-transparent blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-sky-500/20 to-transparent blur-3xl" />

            <CardHeader className="relative pb-8">
              <CardTitle className="text-3xl font-bold flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500">
                  <ChefHat className="h-6 w-6 text-white" />
                </div>
                Configure Your Plan
              </CardTitle>
              <CardDescription className="text-base">
                Customize your meal plan with your preferences and let AI do the rest
              </CardDescription>
            </CardHeader>

            <CardContent className="relative">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Timeframe Selection */}
                  <FormField
                    control={form.control}
                    name="timeframe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-emerald-600" />
                          Planning Period
                        </FormLabel>
                        <FormControl>
                          <Tabs
                            value={field.value}
                            onValueChange={field.onChange}
                            className="w-full"
                          >
                            <TabsList className="grid grid-cols-2 w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-50 to-sky-50 dark:from-gray-800 dark:to-gray-800 p-1.5 border-2 border-emerald-200/50 dark:border-emerald-800/50">
                              <TabsTrigger
                                value="today"
                                className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-lg data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 transition-all font-semibold text-base"
                              >
                                <Clock className="h-4 w-4 mr-2" />
                                Today
                              </TabsTrigger>
                              <TabsTrigger
                                value="weekend"
                                className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-lg data-[state=active]:text-sky-600 dark:data-[state=active]:text-sky-400 transition-all font-semibold text-base"
                              >
                                <Calendar className="h-4 w-4 mr-2" />
                                Weekend
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
                            <Target className="h-4 w-4 text-emerald-600" />
                            Your Goal
                          </FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl border-2 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                                <SelectValue placeholder="Select your goal" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fat_loss" className="cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <Flame className="h-4 w-4 text-orange-500" />
                                  <span>Fat Loss</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="muscle_gain" className="cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="h-4 w-4 text-blue-500" />
                                  <span>Muscle Gain</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="maintenance" className="cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <Heart className="h-4 w-4 text-pink-500" />
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
                            <Utensils className="h-4 w-4 text-emerald-600" />
                            Diet Type
                          </FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl border-2 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                                <SelectValue placeholder="Select diet type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="standard" className="cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <Utensils className="h-4 w-4 text-gray-500" />
                                  <span>Standard</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="vegetarian" className="cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <Apple className="h-4 w-4 text-red-500" />
                                  <span>Vegetarian</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="vegan" className="cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <Salad className="h-4 w-4 text-green-500" />
                                  <span>Vegan</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="keto" className="cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <ChefHat className="h-4 w-4 text-purple-500" />
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
                            <Utensils className="h-4 w-4 text-emerald-600" />
                            Meals Per Day
                          </FormLabel>
                          <Select
                            value={String(field.value)}
                            onValueChange={(v) => field.onChange(parseInt(v))}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl border-2 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                                <SelectValue placeholder="Select meals" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[2, 3, 4, 5, 6].map((n) => (
                                <SelectItem key={n} value={String(n)} className="cursor-pointer">
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
                            <Watch className="h-4 w-4 text-emerald-600" />
                            Age (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              inputMode="numeric"
                              placeholder="e.g., 20 years"
                              className="h-12 rounded-xl border-2 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors text-base"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
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
                            <User className="h-4 w-4 text-emerald-600" />
                            Gender (Optional)
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="h-12 rounded-xl border-2 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male" className="cursor-pointer">
                                  Male
                                </SelectItem>
                                <SelectItem value="female" className="cursor-pointer">
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
                        <Ruler className="h-4 w-4 text-emerald-600" />
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
                                  className="h-12 rounded-xl border-2 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors text-base"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                            <FormItem className="w-[120px]">
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="h-12 rounded-xl border-2 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
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
                        <Weight className="h-4 w-4 text-emerald-600" />
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
                                  className="h-12 rounded-xl border-2 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors text-base"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                            <FormItem className="w-[120px]">
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="h-12 rounded-xl border-2 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
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
                            <Trophy className="h-4 w-4 text-emerald-600" />
                            Activity Level (Optional)
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="h-12 rounded-xl border-2 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                                <SelectValue placeholder="Select activity level" />
                              </SelectTrigger>
                              <SelectContent>
                                {activityLevelOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
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
                            <Zap className="h-4 w-4 text-emerald-600" />
                            Daily Calorie Target (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              inputMode="numeric"
                              min={800}
                              max={5000}
                              placeholder="e.g., 2000 calories"
                              className="h-12 rounded-xl border-2 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors text-base"
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
                          <Sparkles className="h-4 w-4 text-emerald-600" />
                          Special Instructions for AI
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., High-protein vegetarian meals, quick breakfasts, avoid peanuts, prefer Mediterranean cuisine, budget-friendly options..."
                            className="min-h-32 rounded-xl border-2 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors resize-none text-base"
                            {...field}
                            rows={4}
                          />
                        </FormControl>
                        <FormDescription className="text-xs flex items-start gap-1">
                          <span className="text-amber-600 dark:text-amber-400">⚠️</span>
                          This is not medical advice. Consult a healthcare professional for personalized nutrition guidance.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Generate Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      size="lg"
                      className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
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
              <div className="relative">
                <div className="absolute -top-20 left-0 w-full h-40 bg-background blur-2xl pointer-events-none"></div>
                <FullMealPlanModel plan={plan} />
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900">
                  <Flame className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-100">Error</h3>
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>


    </div >
  );
}
