import SubmitRecipeForm from "@/components/SubmitRecipe";
import { supabase } from "@/lib/supabase-client";
import { getRecipebySlug } from "@/actions/recipe";
import React from "react";

async function EditRecipe({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = await getRecipebySlug(slug);

  console.log(recipe);

  return <SubmitRecipeForm recipe={recipe} />;
}

export default EditRecipe;
