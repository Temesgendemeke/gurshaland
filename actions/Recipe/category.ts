import { createClient } from "@/utils/supabase/client";

export const getCategories = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_all_categories");

  if (error) throw error;
  return data || [];
};

export const getRecipesByCategory = async (category_id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_recipe_by_category", {
    _category_id: category_id,
  });

  if (error) throw error;
  return data || [];
};
