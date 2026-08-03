import { createClient } from "@/utils/supabase/client";
import { Rating } from "@/utils/types/recipe";

export const postRating = async (rating: Rating) => {
  const supabase = createClient();
  const { error } = await supabase
    .from("recipe_rating")
    .upsert([rating], {
      onConflict: "user_id,recipe_id",
    });

  if (error) throw error;
};
