import { createClient } from "@/utils/supabase/client";
import { Rating } from "@/utils/types/recipe";

export const postRating = async (rating: Rating) => {
  const supabase = createClient();

  const { data: recipe, error: recipeError } = await supabase
    .from("recipe")
    .select("author_id")
    .eq("id", rating.recipe_id)
    .single();

  if (recipeError) throw recipeError;

  if (recipe?.author_id === rating.user_id) {
    throw new Error("You can't rate your own recipe.");
  }

  const { error } = await supabase
    .from("recipe_rating")
    .upsert([rating], {
      onConflict: "user_id,recipe_id",
    });

  if (error) throw error;
};
