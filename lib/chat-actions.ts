/**
 * Shared types between the AI chat API route (server) and the chat widget (client).
 * The route's tools return these shapes; the widget renders them as actions.
 */

export interface MealPlanPrefill {
  timeframe: "today" | "full-week";
  goal: "fat_loss" | "muscle_gain" | "maintenance";
  diet: "standard" | "vegetarian" | "vegan" | "keto";
  meals_per_day: number;
  calories?: number;
  age?: number;
  gender?: "male" | "female";
  height?: { value: number; unit: string };
  weight?: { value: number; unit: "kg" | "lb" };
  activity_level?:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active"
    | "extremely_active";
  prompt?: string;
}

export type ChatNavigationAction =
  | { action: "navigate-recipe-generator"; prompt: string }
  | { action: "navigate-meal-planner"; values: MealPlanPrefill };

export type RestaurantSearchItem = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  rating?: number | null;
  image?: { url?: string } | null;
  cuisines?: string[] | null;
  google_map_url?: string | null;
  website?: string | null;
  matched_menu?: string[] | null;
};

export type RecipeSearchItem = {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  difficulty?: string | null;
  servings?: number | null;
  tags?: string[] | null;
  preptime?: number | null;
  cooktime?: number | null;
  rating?: number | null;
  image?: { url?: string } | null;
  matched_ingredients?: string[] | null;
};

export const CHAT_SUGGESTIONS = [
  "Find restaurants that serve shiro",
  "Generate a doro wat recipe",
  "Plan my week of healthy meals",
  "How do I make injera?",
  "Where can I get kitfo near me?",
];
