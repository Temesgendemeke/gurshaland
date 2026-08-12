"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import { toast } from "sonner";
import { generateUniqueSlug, generateUniqueTitle } from "@/utils/slugify";
import { uploadAIImageToStorage } from "@/utils/genAI";
import { insertRecipe } from "@/actions/Recipe/recipe";

interface SaveAIRecipeOptions {
  recipe: any;
  onSuccess?: (slug: string) => void;
}

export function useSaveAIRecipe() {
  const router = useRouter();
  const user = useAuth((store) => store.user);
  const [isSaving, setIsSaving] = useState(false);

  const isStoredImage = (img?: { url?: string; path?: string }) =>
    !!img?.url && !String(img.url).startsWith("data:") && !!img.path;

  const saveAndNavigate = async ({ recipe, onSuccess }: SaveAIRecipeOptions) => {
    if (!user) {
      toast.error("Please login to save recipe");
      return;
    }

    setIsSaving(true);
    try {
      // Store in sessionStorage for preview page
      sessionStorage.setItem("recipe_preview", JSON.stringify(recipe));

      // Generate unique title to avoid duplicate key constraint violation
      const uniqueTitle = await generateUniqueTitle(recipe.title);
      recipe.title = uniqueTitle;

      // Upload main image only if it isn't already stored in Supabase
      let recipe_image = recipe.image;
      if (recipe.image?.url && !isStoredImage(recipe.image)) {
        const uploaded = await uploadAIImageToStorage(
          recipe.image.url,
          recipe.title.replace(/\s+/g, "_"),
        );
        recipe_image = uploaded || recipe.image;
      }

      recipe.author_id = user.id;
      recipe.rating = 0;
      recipe.status = "draft";
      recipe.slug = await generateUniqueSlug(recipe.title, "recipe");
      recipe.image = {
        url: recipe_image?.url,
        path: recipe_image?.path,
      };

      // Upload instruction images
      await Promise.all(
        recipe.instructions.map(async (instruction: any) => {
          if (instruction?.image?.url && !isStoredImage(instruction.image)) {
            const uploaded = await uploadAIImageToStorage(
              instruction.image.url,
              instruction.title.replace(/\s+/g, "_"),
            );
            instruction.image = {
              url: uploaded?.url,
              path: uploaded?.path,
            };
          }
        }),
      );

      await insertRecipe({
        recipe: { ...recipe, profile_id: user.id },
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        nutrition: recipe.nutrition,
      });

      toast.success("Recipe saved successfully");
      onSuccess?.(recipe.slug);
      router.push(`/recipes/${recipe.slug}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save recipe");
    } finally {
      setIsSaving(false);
    }
  };

  return { saveAndNavigate, isSaving };
}