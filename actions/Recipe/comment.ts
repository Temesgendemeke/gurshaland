import { createClient } from "@/utils/supabase/client";
import { RecipeComment } from "@/utils/types/recipe";

export const postComment = async (comment: RecipeComment) => {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("post_recipe_comment", {
    _comment: comment,
  });

  if (error) throw error;
  console.log("from error ", error);
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
