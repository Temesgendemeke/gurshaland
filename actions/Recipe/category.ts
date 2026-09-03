"use server";
import { createClient } from "@/utils/supabase/server";

export const getCategories = async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_all_categories");

    if (error) {
      console.error("Failed to fetch categories:", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Supabase connection error in getCategories:", err);
    return [];
  }
};

export const getRecipesByCategory = async (category_id: string) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_recipe_by_category", {
      _category_id: category_id,
    });

    if (error) {
      console.error("Failed to fetch recipes by category:", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Supabase connection error in getRecipesByCategory:", err);
    return [];
  }
};
