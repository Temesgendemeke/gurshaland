import { create } from "zustand";
import { GetMealPannerTyp } from "@/schema/meal-planner";

interface MealStore {
    plans: GetMealPannerTyp[] | null;
    setMeals: (meals: GetMealPannerTyp[]) => void;
    removeMeals: (meal_plan_id: string) => void;
    updateMeal: (meal: GetMealPannerTyp) => void;
}


export const mealStore = create<MealStore>((set, get) => ({
    plans: null,
    setMeals: (meals: GetMealPannerTyp[]) => set({ plans: meals }),
    removeMeals: (meal_plan_id: string) => set(state => ({ plans: state.plans ? state.plans.filter(plan => plan.id !== meal_plan_id) : null })),
    updateMeal: (meal: GetMealPannerTyp) => set(state => ({ plans: state.plans ? state.plans.map(plan => plan.id === meal.id ? meal : plan) : null })),
}))