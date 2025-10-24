"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Loader2 } from "lucide-react";
import Image from "next/image";
import { insertRecipe, uploadRecipeImage } from "@/actions/Recipe/recipe";
import { toast } from "sonner";
import { useAuth } from "@/store/useAuth";
import { useLazyImageGeneration } from "@/hooks/useLazyImageGeneration";
import { useState, useEffect } from "react";
import { uploadInstructionImage } from "@/actions/Recipe/instruction";
import NutritionSection from "./RecipeModel/NutritionSection";
import InstructionsSection from "./RecipeModel/InstructionsSection";
import IngredientsSection from "./RecipeModel/IngredientsSection";
import RecipeStats from "./RecipeModel/RecipeStats";
import YoutubeVideoSection from "./YoutubeVideoSection";
import ImageBoxSkeleton from "../skeleton/ImageBoxSkeleton";
import { generateUniqueSlug } from "@/utils/slugify";
import { uploadAIImageToStorage } from "@/utils/genAI";

const FullRecipeModel = ({ recipe }: { recipe: any }) => {
  const user = useAuth((store) => store.user);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // const { stepImages, generateImageForStep, isGenerating } =
  //   useLazyImageGeneration({
  //     instructions: recipe.instructions || [],
  //   });

  // useEffect(() => {
  //   if (recipe.instructions && recipe.instructions.length > 0) {
  //     Promise.all(
  //       recipe.instructions.map((_: any, idx: number) => generateImageForStep(idx))
  //     ).catch((e) => console.error("Error generating step images:", e));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [recipe.instructions]);

  // useEffect(() => {
  //   if (recipe.instructions && recipe.instructions.length > 0) {
  //     recipe.instructions.forEach((_: any, idx: number) => {
  //       if (stepImages[idx]) {
  //         recipe.instructions[idx].image = stepImages[idx];
  //       }
  //     });
  //   }
  // }, [stepImages, recipe.instructions]);

  const handleSaveRecipe = async () => {
        console.log("recipe ", recipe, "ingredients ", recipe.ingredients, " instructions ", recipe.instructions, " nutrition ", recipe.nutrition);
    setIsSaving(true);
    if (!user) {
      toast.error("Please login to save recipe");
      return;
    }
    try {
      console.log("recipe ", recipe, "ingredients ", recipe.ingredients, " instructions ", recipe.instructions, " nutrition ", recipe.nutrition);
      // Only upload if we actually have a File selected for the main image.
      const recipe_image = await uploadAIImageToStorage(
        recipe.image.url,
        recipe.title.replace(/\s+/g, "_"),
      );

      // set additional recipe fields
      recipe.author_id = user.id;
      recipe.rating = 0;
      recipe.status = "draft";
      recipe.slug = await generateUniqueSlug(recipe.title, "recipe");
      recipe.image = {
        url: recipe_image?.url,
        path: recipe_image?.path,
      };


      console.log("recipe " , recipe);
      console.log("author id ", recipe.author_id)

      await Promise.all(
        recipe.instructions.map(
          async (instruction: any) => {
            if (instruction?.image?.url) {

                const uploaded = await uploadAIImageToStorage(
                instruction.image.url,
                instruction.title.replace(/\s+/g, "_"),
                );
              // ensure image object exists
              instruction.image = {
                // ...(instruction.image || {}),
                url: uploaded?.url,
                path: uploaded?.path,
              };
            }
          }
        )
      );

      // upload recipe and instructions images to supabase storage and get the urls
      // then save the recipe to supabase database

      await insertRecipe({
        recipe: {...recipe, profile_id: user.id},
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        nutrition: recipe.nutrition,
      });
      toast.success("Recipe saved successfully");
    } catch (error) {
      toast.error("Failed to save recipe");
      console.log(error);
    }
    setIsDialogOpen(false);
    setIsSaving(false);
  };


  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <form>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="btn-primary-modern hover:text-white"
          >
            Open Dialog
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-7xl p-0 bg-white  dark:bg-slate-900 ">
          <DialogTitle className="sr-only">{recipe.title}</DialogTitle>


            <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
              isSaving ? "opacity-100 pointer-events-auto delay-0" : "opacity-0 pointer-events-none delay-1000"
            }`}
            >
            <div
              role="status"
              aria-live="polite"
              className="flex items-center gap-3 px-10 py-6 rounded-lg shadow-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
            >
              {isSaving ? (
              <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
              ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-emerald-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
              )}
              <span className="text-lg text-slate-700 dark:text-slate-300">
              {isSaving ? "Saving recipe..." : "Saved"}
              </span>
            </div>
            </div>

          {/*  */}
          <div className={`flex justify-center items-center w-full bg-white dark:bg-slate-900 ${isSaving ?  "blur-lg pointer-events-none" : ""}`}>
            <div className="dark:bg-slate-900 bg-white rounded-2xl  max-w-9xl w-full overflow-y-auto flex flex-col max-h-[80vh]">
              {/* Modal Header */}
              <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6 rounded-t-2xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-emerald-100 text-emerald-700">
                      AI Generated
                    </Badge>
                    <h2 className="text-2xl font-bold heading-primary">
                      {recipe.title}
                    </h2>
                  </div>
                </div>
                <p className="text-body text-sm mt-3 max-w-4xl">
                  {recipe.description}
                </p>
              </div>


              {/* Modal Content */}
              <div className="p-6 space-y-10 flex-1">
                {/* Recipe Image */}
                <div className="relative w-full h-96 mb-4">
                  {recipe.image?.url ? <Image
                    src={recipe.image?.url}
                    alt={recipe.title}
                    fill
                    className="object-contain w-full h-full rounded-lg"
                  />  : (
                    <ImageBoxSkeleton/>
                  )}
                </div>

                {/* Recipe Stats */}
                <RecipeStats stats={{
                    cooktime: recipe.cooktime,
                    servings: recipe.servings,
                    difficulty: recipe.difficulty,
                  }
                } />
                

                {/* Ingredients Section */}
                <IngredientsSection ingredients={recipe.ingredients}/>


                {/* Instructions Section */}
                <InstructionsSection instructions={recipe.instructions}/>


                {/* Nutrition Section */}
                <NutritionSection nutrition={recipe.nutrition}/>
                
                {/* Youtube video section */}
                <YoutubeVideoSection videoId={recipe.youtubeVideoId}  videoQuery={recipe.youtube_search_query}/>
              </div>
            </div>
          </div>
          
          <DialogFooter className={`pb-4 mr-5 ${isSaving ? "pointer-events-none blur-lg" : ""}`}>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSaveRecipe}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default FullRecipeModel;
