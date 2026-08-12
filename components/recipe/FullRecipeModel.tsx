"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Loader2, Save, Sparkles, X } from "lucide-react";
import { insertRecipe } from "@/actions/Recipe/recipe";
import { toast } from "sonner";
import { useAuth } from "@/store/useAuth";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import NutritionSection from "./RecipeModel/NutritionSection";
import InstructionsSection from "./RecipeModel/InstructionsSection";
import IngredientsSection from "./RecipeModel/IngredientsSection";
import RecipeStats from "./RecipeModel/RecipeStats";
import YoutubeVideoSection from "./YoutubeVideoSection";
import RecipeImage from "./RecipeModel/RecipeImage";
import { generateUniqueSlug, generateUniqueTitle } from "@/utils/slugify";
import { uploadAIImageToStorage } from "@/utils/genAI";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FullRecipeModel = ({ recipe }: { recipe: any }) => {
  const user = useAuth((store) => store.user);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const reduce = useReducedMotion();

  const isStoredImage = (img?: { url?: string; path?: string }) =>
    !!img?.url && !String(img.url).startsWith("data:") && !!img.path;

  const handleSaveRecipe = async () => {
    setIsSaving(true);
    if (!user) {
      toast.error("Please login to save recipe");
      setIsSaving(false);
      return;
    }
    try {
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
    } catch (error) {
      toast.error("Failed to save recipe");
      console.log(error);
    }
    setIsDialogOpen(false);
    setIsSaving(false);
  };

  const categoryName =
    typeof recipe.category === "string"
      ? recipe.category
      : recipe.category?.name;

  const galleryImages = [
    ...(recipe.image?.url ? [recipe.image] : []),
    ...(recipe.instructions?.map((i: any) => i?.image).filter((i: any) => i?.url) ?? []),
  ];

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="btn-primary-modern active:scale-[0.97]"
        >
          <Eye className="mr-2 h-4 w-4" />
          View Recipe
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl overflow-hidden bg-background p-0 h-[100dvh] max-h-[100dvh] sm:h-auto sm:max-h-[85vh] sm:rounded-2xl">
        <DialogTitle className="sr-only">{recipe.title}</DialogTitle>
        <DialogDescription className="sr-only">
          {recipe.description || recipe.title}
        </DialogDescription>
        <DialogClose className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all duration-200 hover:bg-black/60 active:scale-90">
          <X className="h-5 w-5" />
        </DialogClose>

        <div className="relative flex h-full flex-col">
          {/* Hero */}
          <div className="relative h-[40dvh] min-h-56 w-full shrink-0 sm:h-64 md:h-72">
            <RecipeImage
              src={recipe.image?.url}
              alt={recipe.title}
              priority
              sizes="100vw"
              className="h-full w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease }}
              className="absolute inset-x-0 bottom-0 flex flex-col gap-2.5 p-5 sm:gap-3 sm:p-7"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-primary text-white">
                  <Sparkles className="mr-1 h-3 w-3" />
                  AI Generated
                </Badge>
                {categoryName && (
                  <Badge
                    variant="outline"
                    className="border-white/40 bg-black/30 text-white backdrop-blur-sm"
                  >
                    {categoryName}
                  </Badge>
                )}
              </div>
              <h2 className="heading-primary text-xl font-bold leading-tight text-white sm:text-2xl md:text-3xl">
                {recipe.title}
              </h2>
              <p className="line-clamp-2 max-w-2xl text-xs leading-relaxed text-white/85 sm:line-clamp-3 sm:text-sm">
                {recipe.description}
              </p>
            </motion.div>
          </div>

          {/* Saving overlay */}
          {isSaving && (
            <div
              role="status"
              aria-live="polite"
              className="absolute inset-0 z-30 flex items-center justify-center bg-background/70 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-6 py-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Saving recipe...
                </span>
              </div>
            </div>
          )}

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45, ease }}
              className="p-5 pb-8 sm:p-7 sm:pb-10"
            >
              <RecipeStats
                stats={{
                  prepTime: recipe.preptime,
                  cooktime: recipe.cooktime,
                  servings: recipe.servings,
                  difficulty: recipe.difficulty,
                }}
              />

              {galleryImages.length > 1 && (
                <div className="mt-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Gallery
                  </p>
                  <div className="scrollbar-hide -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
                    {galleryImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="group relative h-20 w-28 shrink-0 snap-start overflow-hidden rounded-lg ring-1 ring-border/40 transition-shadow duration-200 hover:shadow-[0_8px_24px_-12px_hsl(var(--primary)/0.35)]"
                      >
                        <RecipeImage
                          src={img.url}
                          alt={`${recipe.title} gallery ${idx + 1}`}
                          sizes="112px"
                          imgClassName="transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[340px_1fr] lg:gap-10">
                <div className="space-y-8">
                  <IngredientsSection ingredients={recipe.ingredients} />
                  <NutritionSection nutrition={recipe.nutrition} />
                </div>
                <div className="space-y-8">
                  <InstructionsSection instructions={recipe.instructions} />
                  <YoutubeVideoSection
                    videoId={recipe.youtube_video_id}
                    videoQuery={recipe.youtube_search_query}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <DialogFooter className="shrink-0 gap-2 border-t border-border bg-background px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 sm:space-x-0 sm:px-7 sm:pb-5">
            <DialogClose asChild>
              <Button
                variant="outline"
                disabled={isSaving}
                className="w-full active:scale-[0.97] sm:w-auto"
              >
                Close
              </Button>
            </DialogClose>
            <Button
              onClick={handleSaveRecipe}
              disabled={isSaving}
              className="w-full active:scale-[0.97] sm:w-auto"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Recipe
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullRecipeModel;
