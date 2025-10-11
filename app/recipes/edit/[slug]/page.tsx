import SubmitRecipeForm from "@/components/SubmitRecipe";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();
import { getRecipebySlug } from "@/actions/Recipe/recipe";
import React from "react";

async function EditRecipe({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = await getRecipebySlug(slug);

  return <SubmitRecipeForm recipe={recipe} />;
}

export default EditRecipe;
