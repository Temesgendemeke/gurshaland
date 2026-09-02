"use client";

import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { PostComment } from "@/utils/types/recipe";
import { useParams } from "next/navigation";
import RecipeComment from "@/components/RecipeComment";
import { useAuth } from "@/store/useAuth";
import RecipeRating from "@/components/RecipeRating";
import RecipeDetailSkeleton from "@/components/skeleton/RecipeDetailSkeleton";
import RecipeCommentList from "@/components/RecipeCommentList";
import { useRecipeDetailStore } from "@/store/Recipedetail";
import { toast } from "sonner";
import NutritionView from "@/components/NutritionView";
import AuthorInfo from "@/components/AuthorInfo";
import RecipeCulturalNote from "@/components/RecipeCulturalNote";
import InstructionsView from "@/components/InstructionsView";
import IngredientsView from "@/components/IngredientsView";
import ActionButtons from "@/components/recipe/ActionButtons";
import BackNavigation from "@/components/BackNavigation";
import PreviewWarning from "@/components/PreviewWarning";
import YoutubeVideoSection from "@/components/recipe/YoutubeVideoSection";
import ViewTracker from "@/components/ViewTracker";
import { formatCount } from "@/utils/formatCount";
import { cn } from "@/lib/utils";
import DownloadPdfButton from "@/components/pdf/DownloadPdfButton";
import { generateRecipePdf } from "@/actions/pdf";
import { RECIPE_PDF_CREDIT_COST } from "@/constants/creditCosts";
import Image from "next/image";

export default function RecipeDetailPage() {
  const params = useParams();
  const { slug } = params;
  const user = useAuth((store) => store.user);
  const recipe = useRecipeDetailStore((state) => state.recipe);
  const loading = useRecipeDetailStore((state) => state.loading);
  const fetchRecipe = useRecipeDetailStore((state) => state.fetchRecipe);
  const error = useRecipeDetailStore((store) => store.error);

  useEffect(() => {
    if (error) {
      toast.error("An error occurred. Please try again.");
    }
  }, [error]);

  useEffect(() => {
    fetchRecipe(slug as string, user?.id);
  }, [slug, user]);

  const isOwner =
    !!user?.id &&
    (recipe?.author_id === user.id || recipe?.author?.id === user.id);

  const stats = recipe
    ? [
        {
          label: "Total Time",
          value:
            recipe.preptime && recipe.cooktime
              ? `${recipe.preptime + recipe.cooktime} min`
              : "Unknown",
        },
        { label: "Servings", value: recipe.servings },
        { label: "Difficulty", value: recipe.difficulty },
        {
          label: "Rating",
          value: recipe.average_rating ? recipe.average_rating : "N/A",
        },
        {
          label: "Views",
          value: formatCount(recipe.view_count ?? 0),
        },
      ]
    : [];

  return (
    <div className="min-h-screen ">
      <Header />
      {!isOwner && <ViewTracker type="recipe" id={recipe?.id ?? 0} />}
      {loading || !recipe ? (
        <RecipeDetailSkeleton />
      ) : (
        <div className="w-full max-w-7xl mx-auto px-6 py-6 space-y-6">
          {/* Back Navigation */}
          <BackNavigation pagename={"Recipes"} />

          {/* Preview Mode Warning */}
          <PreviewWarning
            slug={recipe.slug}
            postType="recipe"
            author_id={recipe?.author_id || ""}
            user_id={user?.id || ""}
            status={recipe?.status || ""}
          />

          {/* Recipe Header */}
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-10 items-stretch">
            {/* Image */}
            <div className="overflow-hidden rounded-2xl ring-1 ring-border/60">
              <Image
                width={800}
                height={600}
                src={recipe.image.url || "/placeholder.svg"}
                alt={recipe.title}
                className="h-full  w-full object-cover"
              />
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {recipe.category?.name && (
                  <Badge
                    variant="outline"
                    className="rounded-full border-border/80 bg-transparent font-medium text-muted-foreground"
                  >
                    {recipe.category.name}
                  </Badge>
                )}
                {recipe.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="rounded-full border-border/80 bg-transparent font-medium text-muted-foreground"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="font-gosh text-2xl font-bold leading-tight tracking-tight text-foreground wrap-break-word max-w-full sm:text-3xl md:text-[2.5rem] md:leading-[1.1]">
                {recipe.title}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
                {recipe.description}
              </p>

              {/* Recipe Meta */}
              <div className="mt-5 border-t border-border">
                <dl className="grid grid-cols-2 sm:grid-cols-5">
                  {stats.map((stat, idx) => (
                    <div
                      key={stat.label}
                      className={cn(
                        "py-3.5 sm:px-5 sm:first:pl-0 sm:last:pr-0",
                        idx % 2 === 1 && "border-l border-border pl-5",
                        idx > 1 && "border-t border-border sm:border-t-0",
                        idx > 0 && "sm:border-l",
                      )}
                    >
                      <dt className="text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground">
                        {stat.label}
                      </dt>
                      <dd className="mt-1 text-base font-semibold tracking-tight text-foreground">
                        {stat.value ?? "—"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div>
                <ActionButtons
                  recipe_id={recipe.id ?? ""}
                  user_id={user?.id ?? ""}
                  isOwner={isOwner}
                />
              </div>
              <div>
                {recipe.author && <AuthorInfo author={recipe.author} />}
              </div>
            </div>
          </div>

          {/* Recipe Content */}
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {/* Instructions */}
              <InstructionsView instructions={recipe?.instructions} />

              {/* Cultural Note */}
              <RecipeCulturalNote culturalNote={recipe?.culturalNote} />

              {/* youtube video section */}
              <YoutubeVideoSection
                videoId={recipe.youtube_video_id}
                videoQuery={recipe.youtube_search_query}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Ingredients */}
              <IngredientsView ingredients={recipe?.ingredients} />

              {/* Nutrition */}
              <NutritionView nutrition={recipe?.nutrition} />

              <RecipeRating
                user_id={user?.id ?? ""}
                recipe_id={recipe.id ?? ""}
                rating={
                  recipe.rating.find((r) => r.user_id === user?.id)?.rating || 0
                }
                isOwner={isOwner}
              />

              {/* Comments */}
              <div className="rounded-xl border border-border/80 bg-card p-5">
                <h3 className="mb-4 text-lg font-bold tracking-tight text-foreground">
                  Comments ({recipe.comments.length})
                </h3>

                {/* Add Comment */}
                <RecipeComment
                  user_id={user?.id}
                  recipe_id={recipe.id}
                  isOwner={isOwner}
                />

                {/* Comments List */}
                <RecipeCommentList
                  user_id={user?.id || ""}
                  comments={recipe.comments as PostComment[]}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
