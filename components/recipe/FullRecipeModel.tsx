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

const FullRecipeModel = ({ recipe }: { recipe: any }) => {
  const user = useAuth((store) => store.user);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

    if (!user) {
      toast.error("Please login to save recipe");
      return;
    }
    try {
      console.log("recipe ", recipe, "ingredients ", recipe.ingredients, " instructions ", recipe.instructions, " nutrition ", recipe.nutrition);
      // Only upload if we actually have a File selected for the main image.
      if (recipe?.image?.file instanceof File) {
        await uploadRecipeImage(recipe.image.file as File, user.id, recipe.id as string);
      }

      await Promise.all(
        recipe.instructions.map(
          async (instruction: any) => {
            if (instruction?.image?.file instanceof File) {
              const uploaded = await uploadInstructionImage(
                instruction.image.file as File,
                user.id,
                instruction.id as string
              );
              // ensure image object exists
              instruction.image = {
                ...(instruction.image || {}),
                url: uploaded?.url ?? instruction.image.url,
                path: uploaded?.path ?? instruction.image.path,
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
        <DialogContent className="max-w-7xl p-0 bg-white  dark:bg-slate-900">
          <DialogTitle className="sr-only">{recipe.title}</DialogTitle>
          <div className="flex justify-center items-center w-full bg-white dark:bg-slate-900">
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
                  <Image
                    src={recipe.image?.url ?? "/placeholder.jpg"}
                    alt={recipe.title}
                    fill
                    className="object-contain w-full h-full rounded-lg"
                  />
                </div>

                {/* Recipe Stats */}
                <RecipeStats stats={{
                    cooktime: recipe.cooktime,
                    servings: recipe.servings,
                    difficulty: recipe.difficulty,
                  }
                } />
                {/* <div className="flex  sm:flex-row sm:items-center  text-sm text-body-muted bg-slate-50 dark:bg-slate-800 py-4  rounded-xl">
                  <div className="flex items-center gap-2 min-w-[120px] justify-center">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">{recipe.cooktime}min</span>
                  </div>
                  <div className="flex items-center gap-2 min-w-[120px] justify-center">
                    <Users className="w-5 h-5" />
                    <span className="font-medium">
                      {recipe.servings} servings
                    </span>
                  </div>
                  <div className="flex items-center gap-2 min-w-[120px] justify-center">
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      {recipe.difficulty}
                    </Badge>
                  </div>
                </div> */}

                {/* Ingredients Section */}
                <IngredientsSection ingredients={recipe.ingredients}/>
                {/* <div className="space-y-4 mt-4">
                  <h3 className="text-xl font-semibold text-body border-b border-slate-200 dark:border-slate-700 pb-3">
                    Ingredients
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {recipe?.ingredients?.map(
                      (
                        ingredient: {
                          amount: number;
                          unit: string;
                          item: string;
                        },
                        idx: number
                      ) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                        >
                          <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-body leading-relaxed">
                            {ingredient.amount} {ingredient.unit}{" "}
                            {ingredient.item}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div> */}

                {/* Instructions Section */}
                <InstructionsSection instructions={recipe.instructions}/>
                {/* <div className="space-y-4 mt-4">
                  <h3 className="text-xl font-semibold text-body border-b border-slate-200 dark:border-slate-700 pb-3">
                    Instructions
                  </h3>
                  <div className="flex flex-col gap-6">
                    {recipe?.instructions?.map(
                      (
                        instruction: {
                          step: number;
                          title: string;
                          description: string;
                          tips: string;
                          image: { url: string };
                        },
                        idx: number
                      ) => {
                        return (
                          <div key={idx} className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center text-lg font-bold">
                              {idx + 1}
                            </div>
                            <div className="flex-1 pt-2">
                              <div className="relative w-full h-96 mb-4">
                                <Image
                                  src={
                                    recipe.instructions[idx]?.url ??
                                    "/placeholder-step.svg"
                                  }
                                  alt={instruction.title}
                                  fill
                                  className="object-contain w-full h-full rounded-lg"
                                />
                                {recipe.instructions[idx]?.isLoading && (
                                  <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center rounded-lg">
                                    <div className="flex flex-col items-center gap-2">
                                      <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                                      <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Generating image...
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <p className="text-body leading-relaxed md:text-2xl font-bold">
                                {instruction.title}
                              </p>
                              <p className="text-body-muted text-sm">
                                {instruction.description}
                              </p>
                              <p className="text-body-muted text-sm">
                                {instruction.tips}
                              </p>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div> */}

                {/* Nutrition Section */}
                <NutritionSection nutrition={recipe.nutrition}/>
                {/* <div className="space-y-4 mt-4">
                  <h3 className="text-xl font-semibold text-body border-b border-slate-200 dark:border-slate-700 pb-3">
                    Nutrition
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recipe?.nutrition && (
                      <>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-body leading-relaxed">
                            Calories: {recipe.nutrition.calories}g
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-body leading-relaxed">
                            Protein: {recipe.nutrition.protein}g
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-body leading-relaxed">
                            Carbs: {recipe.nutrition.carbs}g
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-body leading-relaxed">
                            Fat: {recipe.nutrition.fat}g
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-body leading-relaxed">
                            Fiber: {recipe.nutrition.fiber}g
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div> */}
                <YoutubeVideoSection videoId={recipe.}  videoQuery={recipe.youtube_search_query}/>
              </div>
            </div>
          </div>
          <DialogFooter className="pb-4 mr-5">
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
