"use server";
import { createClient } from "@/utils/supabase/server";

export const getCategories = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_all_categories");

  if (error) throw error;
  return data || [];
};

export const getRecipesByCategory = async (category_id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_recipe_by_category", {
    _category_id: category_id,
  });

  if (error) throw error;
  return data || [];
};
