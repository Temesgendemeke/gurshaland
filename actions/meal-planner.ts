"use server";

type Input = {
  timeframe: "today" | "weekend" | "custom";
  goal: "fat_loss" | "muscle_gain" | "maintenance";
  diet: "standard" | "vegetarian" | "vegan" | "keto";
  mealsPerDay: number;
  calories?: number;
  prompt?: string;
};

type DayPlan = {
  day: string;
  meals: { name: string; description: string; calories?: number; protein?: number; carbs?: number; fat?: number }[];
  totalCalories?: number;
};

type Plan = {
  timeframe: Input["timeframe"];
  goal: Input["goal"];
  diet: Input["diet"];
  calories?: number;
  mealsPerDay: number;
  days: DayPlan[];
  shoppingList?: string[];
  notes?: string;
};

export async function generateMealPlan(input: Input): Promise<{ success: boolean; plan?: Plan; error?: string }> {
  try {
    // If you want to call an AI model, plug it here and return the same shape.
    // Fallback: simple deterministic generator (no external calls).
    const days =
      input.timeframe === "today"
        ? ["Today"]
        : input.timeframe === "weekend"
        ? ["Saturday", "Sunday"]
        : ["Day 1", "Day 2", "Day 3"];

    const kcal = input.calories ?? (input.goal === "fat_loss" ? 1800 : input.goal === "muscle_gain" ? 2600 : 2200);
    const perMeal = Math.round(kcal / Math.max(1, input.mealsPerDay));

    const proteinBias = input.goal === "muscle_gain" ? 0.35 : input.goal === "fat_loss" ? 0.3 : 0.25;
    const fatBias = input.diet === "keto" ? 0.6 : 0.25;
    const carbsBias = Math.max(0.15, 1 - proteinBias - fatBias);

    const mealsForDiet = (diet: Input["diet"]) => {
      switch (diet) {
        case "vegetarian":
          return ["Greek Yogurt Parfait", "Lentil Salad", "Paneer Stir-fry", "Veggie Omelette", "Tofu Scramble"];
        case "vegan":
          return ["Tofu Scramble", "Quinoa Bowl", "Chickpea Curry", "Avocado Toast", "Lentil Stew"];
        case "keto":
          return ["Eggs & Avocado", "Chicken Caesar (no croutons)", "Salmon & Greens", "Zucchini Noodles", "Nut Bowl"];
        default:
          return ["Oatmeal & Berries", "Chicken & Rice", "Beef Stir-fry", "Egg Sandwich", "Tuna Salad"];
      }
    };

    const mealNames = mealsForDiet(input.diet);

    const daysPlan: DayPlan[] = days.map((day) => {
      const meals = Array.from({ length: input.mealsPerDay }).map((_, idx) => {
        const cals = perMeal + (idx === 0 ? 50 : 0) - (idx === input.mealsPerDay - 1 ? 50 : 0);
        const protein = Math.round((cals * proteinBias) / 4);
        const fat = Math.round((cals * fatBias) / 9);
        const carbs = Math.round((cals * carbsBias) / 4);
        const name = mealNames[(idx + day.length) % mealNames.length];
        return {
          name,
          description: input.prompt
            ? `${name} • ${input.prompt}`
            : `${name} tailored for ${input.goal.replace("_", " ")}`,
          calories: cals,
          protein,
          carbs,
          fat,
        };
      });
      return { day, meals, totalCalories: meals.reduce((s, m) => s + (m.calories || 0), 0) };
    });

    const plan: Plan = {
      timeframe: input.timeframe,
      goal: input.goal,
      diet: input.diet,
      calories: kcal,
      mealsPerDay: input.mealsPerDay,
      days: daysPlan,
      shoppingList: ["Eggs", "Chicken breast", "Leafy greens", "Greek yogurt", "Olive oil", "Berries"].slice(
        0,
        2 + input.mealsPerDay
      ),
      notes: "This plan is informational only and not medical advice.",
    };

    return { success: true, plan };
  } catch (e: any) {
    return { success: false, error: e?.message || "Failed to generate plan" };
  }
}