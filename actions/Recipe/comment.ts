import { createClient } from "@/utils/supabase/client";
import { RecipeComment } from "@/utils/types/recipe";

export const postComment = async (comment: RecipeComment) => {
  const supabase = createClient();

  const { data: recipe, error: recipeError } = await supabase
    .from("recipe")
    .select("author_id")
    .eq("id", comment.recipe_id)
    .single();

  if (recipeError) throw recipeError;

  if (recipe?.author_id === comment.author_id) {
    throw new Error("You can't comment on your own recipe.");
  }

  const { data, error } = await supabase.rpc("post_recipe_comment", {
    _comment: comment,
  });

  if (error) throw error;
  return data;
};

export const deleteComment = async (comment_id: string) => {
  const supabase = createClient();
  const { error } = await supabase
    .from("recipe_comment")
    .delete()
    .eq("id", comment_id);

  if (error) throw error;
};
