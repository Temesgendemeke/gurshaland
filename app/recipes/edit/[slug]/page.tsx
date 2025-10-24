import { getRecipebySlugAdmin } from "@/actions/Recipe/recipe";
import BackNavigation from "@/components/BackNavigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import SubmitRecipeForm from "@/components/SubmitRecipe";
import { createClient } from "@/utils/supabase/client";
// import { getRecipebySlug } from "@/actions/Recipe/recipe";
import React from "react";

const supabase = createClient();


async function EditRecipe({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  console.log("Editing recipe with slug: ", slug);
  const recipe = await getRecipebySlugAdmin(slug);


  console.log("Editing recipe: ", recipe);

  return (
   <>
   <Header/>
   <div className="mx-auto px-10 py-12 space-y-8">
    {JSON.stringify(recipe)}
    {JSON.stringify(slug)}
    
     <BackNavigation/>
     <div className="text-center ">
        <h1 className="text-6xl font-bold mb-4">
          <span className="">Edit Your Recipe</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Update and refine your Ethiopian culinary masterpiece below.
        </p>
      </div>
     <div>
       <SubmitRecipeForm recipe={recipe} />
     </div>
   </div>
   <Footer/>
   </>
  );
}

export default EditRecipe;
