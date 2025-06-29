import { supabase } from "@/lib/supabase-client";

export const getRecipebySlug = async (slug: string) => {
  const { data: recipe, error } = await supabase
    .from("recipe")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;

  return recipe;
};


export const postRecipe = async (recipe) =>{
  await supabase.from("recipe").insert(
    
  )
}