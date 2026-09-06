import { createClient } from "@/utils/supabase/client";
import { RecipeComment } from "@/utils/types/recipe";

export const postComment = async (comment: RecipeComment) => {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("post_recipe_comment", {
    _comment: comment,
  });

  if (error) throw error;
  return data;
};

export const deleteComment = async (comment_id: string | number) => {
  const supabase = createClient();
  const { error } = await supabase
    .from("recipe_comment")
    .delete()
    .eq("id", comment_id);

  if (error) throw error;
};

export const updateComment = async (comment_id: string | number, newComment: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("recipe_comment")
    .update({ comment: newComment })
    .eq("id", comment_id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

