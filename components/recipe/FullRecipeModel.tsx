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
import { Eye, Loader2, Save, X } from "lucide-react";
import { insertRecipe } from "@/actions/Recipe/recipe";
import { toast } from "sonner";
import { useAuth } from "@/store/useAuth";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import NutritionSection from "./RecipeModel/NutritionSection";
import InstructionsSection from "./RecipeModel/InstructionsSection";
import IngredientsSection from "./RecipeModel/IngredientsSection";
import RecipeStats from "./RecipeModel/RecipeStats";
import YoutubeVideoSection from "./YoutubeVideoSection";
import RecipeImage from "./RecipeModel/RecipeImage";
import { generateUniqueSlug, generateUniqueTitle } from "@/utils/slugify";
import { uploadAIImageToStorage } from "@/utils/genAI";
import { cn } from "@/lib/utils";
import DownloadPdfButton from "@/components/pdf/DownloadPdfButton";
import { generateRecipePdf } from "@/actions/pdf";
import { RECIPE_PDF_CREDIT_COST } from "@/constants/creditCosts";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FullRecipeModel = ({
  recipe,
  variant = "dialog",
}: {
  recipe: any;
  variant?: "dialog" | "inline";
}) => {
  const user = useAuth((store) => store.user);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeImageUrl, setActiveImageUrl] = useState<string | undefined>(
    recipe.image?.url,
  );
  const reduce = useReducedMotion();

  useEffect(() => {
    setActiveImageUrl(recipe.image?.url);
  }, [recipe.image?.url]);

  const isInline = variant === "inline";

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
    ...(recipe.instructions
      ?.map((i: any) => i?.image)
      .filter((i: any) => i?.url) ?? []),
  ].filter(
    (img, idx, arr) =>
      arr.findIndex((other) => other?.url === img?.url) === idx,
  );

  const content = (
    <div className="relative flex h-full flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-border px-6 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
          {categoryName && (
            <Badge
              variant="outline"
              className="rounded-full border-border/80 bg-transparent font-medium text-muted-foreground"
            >
              {categoryName}
            </Badge>
          )}
          <span className="text-muted-foreground">AI-generated recipe</span>
        </div>

        <h2 className="mt-3 font-gosh text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl md:text-[2.5rem] md:leading-[1.1]">
          {recipe.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
          {recipe.description}
        </p>

        <div className="mt-5 border-t border-border">
          <RecipeStats
            stats={{
              prepTime: recipe.preptime,
              cooktime: recipe.cooktime,
              servings: recipe.servings,
              difficulty: recipe.difficulty,
            }}
          />
        </div>
      </div>

      {/* Saving overlay */}
      {isSaving && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-30 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-6 py-4 shadow-lg">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm font-medium text-foreground">
              Saving recipe...
            </span>
          </div>
        </div>
      )}

      {/* Body */}
      <div
        className={cn(
          "flex-1",
          !isInline && "overflow-y-auto overscroll-contain",
        )}
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className=" px-2 md:px-6 py-6 sm:px-8 sm:py-8"
        >
          {/* Framed photo */}
          <div className="overflow-hidden rounded-2xl ring-1 ring-border/60  ">
            <RecipeImage
              src={activeImageUrl}
              alt={recipe.title}
              priority
              className="aspect-video md:aspect-21/9 "
            />
          </div>

          {/* Gallery */}
          {galleryImages.length > 1 && (
            <div className="mt-8 border-t border-border/70 pt-5 mx-2">
              <div className="scrollbar-hide -mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-1 pt-2 sm:-mx-8 sm:px-8">
                {galleryImages.map((img, idx) => {
                  const isActive = img.url === activeImageUrl;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setActiveImageUrl(img.url);
                        recipe.image = img;
                      }}
                      aria-label={`Show ${recipe.title} image ${idx + 1}`}
                      className={cn(
                        "group relative h-20 w-28 shrink-0 snap-start overflow-hidden rounded-lg ring-1 transition-all active:scale-[0.97]",
                        isActive
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                          : "ring-border/50 hover:ring-primary/60",
                      )}
                    >
                      <RecipeImage
                        src={img.url}
                        alt={`${recipe.title} gallery ${idx + 1}`}
                        sizes="112px"
                        imgClassName="transition-transform duration-500 group-hover:scale-105"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="mt-10 grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)] xl:gap-12">
            <div className="space-y-10">
              <IngredientsSection ingredients={recipe.ingredients} />
              <NutritionSection nutrition={recipe.nutrition} />
            </div>
            <div className="space-y-10">
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
      <DialogFooter className="shrink-0 gap-2 border-t border-border bg-card px-2 py-4 sm:space-x-0 sm:px-8">
        {!isInline && (
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={isSaving}
              className="w-full active:scale-[0.97] sm:w-auto"
            >
              Close
            </Button>
          </DialogClose>
        )}
        <DownloadPdfButton
          generate={() => generateRecipePdf(recipe)}
          cost={RECIPE_PDF_CREDIT_COST}
          variant="outline"
          className="w-full active:scale-[0.97] sm:w-auto"
        />
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
  );

  if (isInline) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        {content}
      </div>
    );
  }

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
        <DialogClose className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-card/90 text-muted-foreground backdrop-blur transition-colors hover:text-foreground active:scale-90">
          <X className="h-4.5 w-4.5" />
        </DialogClose>

        {content}
      </DialogContent>
    </Dialog>
  );
};

export default FullRecipeModel;
