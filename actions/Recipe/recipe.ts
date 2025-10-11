import { BUCKET } from "@/constants/image";
import { createClient } from "@/utils/supabase/client";
import Recipe, {
  Ingredient,
  Instruction,
  Nutrition,
  Rating,
  RecipeComment,
} from "@/utils/types/recipe";



const supabase = createClient()

export const getRecipebySlug = async (slug: string) => {
  const { data, error } = await supabase.rpc("get_full_recipe", {
    _slug: slug,
  });

  console.log("recipes error ", error)
  if (error) throw error;

  return data;
};



export const insertRecipe = async (formData: {
  recipe: any;
  ingredients: Ingredient[];
  instructions: Instruction[];
  nutrition: Nutrition;
}) => {
  const { data, error } = await supabase.rpc("insert_full_recipe", {
    _recipe: formData.recipe,
    _ingredients: formData.ingredients,
    _instructions: formData.instructions,
    _nutrition: formData.nutrition,
  });
  console.log("from db ", error);
  if (error) throw error;
  return data;
};

export const getRecipes = async () => {
  const { data, error } = await supabase.rpc("get_all_recipes");

  if (error) throw error;
  return data;
};

export const getFeaturedRecipes = async () => {
  const { data, error } = await supabase.rpc("get_featured_recipes");

  if (error) throw error;
  return data;
};

export const getTrendingRecipes = async () => {
  const { data, error } = await supabase.rpc("get_trending_recipes");

  if (error) throw error;
  return data;
};

export const deleteRecipe = async (_slug: string) => {
  const { data, error } = await supabase.rpc("get_full_recipe", {
    _slug,
  });

  if (error) throw error;

  const imagePaths = [
    data.recipe.image?.path,
    ...data.instructions
      .map((ins: Instruction) => ins?.image?.path)
      .filter((path: string | undefined) => path)
  ];


  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove(imagePaths);

  if (storageError) throw storageError;

  const { error: recipeError } = await supabase
    .from("recipe")
    .delete()
    .eq("slug", _slug);

  if (recipeError) throw recipeError;
};
export const uploadRecipeImage = async (
  image_file: File,
  user_id: string,
  recipe_id: string
) => {
  try {
    const path = `recipe/${user_id}/${image_file.name}_${Date.now()}`;
    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .upload(path, image_file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (storageError) throw storageError;

    const {
      data: { publicUrl: url },
    } = supabase.storage.from(BUCKET).getPublicUrl(path);

    const { data, error } = await supabase.from("recipe_image").insert({
      path,
      url,
      recipe_id,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};


export const getRecipeByAuthor = async(author_id: string)=>{
  const {data, error} = await supabase.rpc("get_recipe_by_author", {
    _author_id: author_id
  })

  if(error) throw error;
  return data
}

