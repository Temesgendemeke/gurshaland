import { createClient } from "@/utils/supabase/client";

const isRecipeOwner = async (
  userId: string,
  recipeId: string,
): Promise<boolean> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("recipe")
    .select("author_id")
    .eq("id", recipeId)
    .single();

  if (error) {
    throw error;
  }

  return data?.author_id === userId;
};

export const postOrDeleteLike = async (liked_by: string, recipe_id: string) => {
    if (await isRecipeOwner(liked_by, recipe_id)) {
        throw new Error("You can't like your own recipe.");
    }

    const supabase = createClient();
    const { error: deleteError, count } = await supabase
        .from("recipe_like")
        .delete({ count: "exact" })
        .eq("liked_by", liked_by)
        .eq("recipe_id", recipe_id);

    if (deleteError) {
        console.log(deleteError);

        throw deleteError;
    }

    if (count === 0) {
        const { error: insertError } = await supabase
            .from("recipe_like")
            .insert({ liked_by, recipe_id });

        if (insertError) {
            console.log(insertError);
            throw insertError;
        }

        return { liked: true };
    }

    return { liked: false };
};
