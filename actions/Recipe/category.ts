import { supabase } from "@/lib/supabase-client";

export const getCategories = async () => {
  const { data, error } = await supabase.rpc("get_all_categories");

  if (error) throw error;
  return data || [];
};

export const getRecipesByCategory = async (category: string) => {
  const { data, error } = await supabase.rpc("get_recipe_by_category", {
    _category: category
  });

  if (error) throw error;
  return data || [];
};


