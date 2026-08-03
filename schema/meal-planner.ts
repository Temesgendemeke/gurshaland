import { z } from "zod";

export const mealSchema = z.object({
  name: z.string(),
  description: z.string(),
  calories: z.number().optional(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
  fat: z.number().optional(),
  type: z.string().optional(),
});

export const dayPlanSchema = z.object({
  day: z.string(),
  meals: z.array(mealSchema),
  totalCalories: z.number().optional(),
});

export const mealPlannerSchema = z.object({
  timeframe: z.enum(["today",  "full-week"]),
  goal: z.enum(["fat_loss", "muscle_gain", "maintenance"]),
  diet: z.enum(["standard", "vegetarian", "vegan", "keto"]),
  calories: z.number().optional(),
  meals_per_day: z.number(),
  days: z.array(dayPlanSchema),
  shopping_list: z.array(z.string()).optional(),
  notes: z.string().optional(),   
  pro_tips: z.array(z.string()).optional(),
  age: z.number().optional(),
  gender: z.enum(["male", "female"]).optional(),
  height: z.object({
    value: z.number(),
    unit: z.string(),
  }).optional(),
  weight: z.object({
    value: z.number(),
    unit: z.enum(["kg", "lb"]),
  }).optional(),
  activity_level: z.enum([
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extremely_active",
  ]).optional(),
  prompt: z.string().optional(),
});

const GetMealPannerSchema = mealPlannerSchema.extend({
  name: z.string(),
  id: z.string(),
});

export type MealType = z.infer<typeof mealSchema>;
export type DayPlanType = z.infer<typeof dayPlanSchema>;
export type mealPlannerType = z.infer<typeof mealPlannerSchema>;
export type PlanType = mealPlannerType;
export type GetMealPannerTyp = z.infer<typeof GetMealPannerSchema>;
