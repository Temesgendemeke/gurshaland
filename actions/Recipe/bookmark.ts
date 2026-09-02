"use server";

import { createClient } from "@/utils/supabase/client";
import { createClient as createServerClient } from "@/utils/supabase/server";
import Recipe from "@/utils/types/recipe";

export const getBookmarkedRecipes = async (user_id: string): Promise<Recipe[]> => {
  const supabase = await createServerClient();

  const { data: bookmarks, error: bookmarkError } = await supabase
    .from("recipe_bookmark")
    .select("recipe_id")
    .eq("user_id", user_id);

  if (bookmarkError) throw bookmarkError;
  if (!bookmarks || bookmarks.length === 0) return [];

  const recipeIds = bookmarks.map((b) => b.recipe_id);

  const { data: recipes, error: recipeError } = await supabase
    .from("recipe")
    .select(`
      id,
      title,
      description,
      difficulty,
      servings,
      slug,
      preptime,
      cooktime,
      totaltime,
      tags,
      cultural_notes,
      status,
      category:category(id, name),
      author:author_id(
        id,
        username,
        full_name,
        bio
      ),
      image:recipe_image!recipe_image_recipe_id_fkey(
        id, url, path, recipe_id
      )
    `)
    .in("id", recipeIds)
    .eq("status", "published");

  if (recipeError) throw recipeError;

  const recipeList = (recipes || []) as any[];

  const recipesWithRatings = await Promise.all(
    recipeList.map(async (recipe) => {
      const { data: ratings } = await supabase
        .from("recipe_rating")
        .select("rating")
        .eq("recipe_id", recipe.id);

      const avg =
        ratings && ratings.length > 0
          ? ratings.reduce((sum: number, r: any) => sum + r.rating, 0) /
            ratings.length
          : 0;

      return {
        ...recipe,
        category: recipe.category || { id: 0, name: "Uncategorized" },
        author: recipe.author
          ? {
              ...recipe.author,
              avatar_url: null,
            }
          : null,
        image: recipe.image || null,
        average_rating: Math.round(avg * 100) / 100,
        preptime: recipe.preptime ?? 0,
        cooktime: recipe.cooktime ?? 0,
        servings: recipe.servings ?? 0,
        tags: recipe.tags ?? [],
      };
    })
  );

  return recipesWithRatings as Recipe[];
};

export const toggleBookmark = async(user_id: string, recipe_id: string)=>{
    const supabase = createClient()
    const {error: deleteError, count} = await supabase
    .from("recipe_bookmark")
    .delete({count:"exact"})
    .eq("user_id", user_id)
    .eq("recipe_id", recipe_id);


    if(deleteError) throw deleteError;

    if(count === 0){
        const {error: insertError} = await supabase
        .from("recipe_bookmark")
        .insert({user_id, recipe_id})

        if(insertError) throw insertError

        return {bookmarked: false}
    }
    return {bookmarked: true}
}