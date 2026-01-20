"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import {
  ClockIcon as Clock,
  UsersIcon as Group,
  HomeModernIcon as Restaurant,
  StarIcon as Star,
  ChatBubbleLeftRightIcon as MessageRoundedDetail,
  PencilSquareIcon as PenBoxIcon,
} from "@heroicons/react/24/outline";
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
import Link from "next/link";
import PreviewWarning from "@/components/PreviewWarning";
import YoutubeVideoSection from "@/components/recipe/YoutubeVideoSection";

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {loading || !recipe ? (
        <RecipeDetailSkeleton />
      ) : (
        <div className="w-full md:max-w-7xl mx-auto px-6 py-12 space-y-4">
          {/* Back Navigation */}
          <BackNavigation pagename={"Recipes"} />
          {/* Compare user id with recipe author id */}

          {/* Preview Mode Warning */}
          <PreviewWarning
            slug={recipe.slug}
            postType="recipe"
            author_id={recipe?.author_id || ""}
            user_id={user?.id || ""}
            status={recipe?.status || ""}
          />

          {/* Recipe Header */}
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            <div>
              <img
                src={recipe.image.url || "/placeholder.svg"}
                alt={recipe.title}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {recipe.category?.name}
                </Badge>
                {recipe.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-secondary text-secondary-foreground border-transparent"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl break-words max-w-full font-bold text-foreground mb-4">
                {recipe.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {recipe.description}
              </p>

              {/* Recipe Meta */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-card/70 backdrop-blur-sm rounded-xl border border-border/50">
                  <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">
                    Total Time
                  </div>
                  <div className="font-semibold text-foreground">
                    {recipe.preptime + recipe.cooktime || "unkown"}
                  </div>
                </div>
                <div className="text-center p-4 bg-card/70 backdrop-blur-sm rounded-xl border border-border/50">
                  <Group className="w-6 h-6 text-warning mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">Servings</div>
                  <div className="font-semibold text-foreground">
                    {recipe.servings}
                  </div>
                </div>
                <div className="text-center p-4 bg-card/70 backdrop-blur-sm rounded-xl border border-border/50">
                  <Restaurant className="w-6 h-6 text-popular mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">
                    Difficulty
                  </div>
                  <div className="font-semibold text-foreground">
                    {recipe.difficulty}
                  </div>
                </div>
                <div className="text-center p-4 bg-card/70 backdrop-blur-sm rounded-xl border border-border/50">
                  <Star className="w-6 h-6 text-warning mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">Rating</div>
                  <div className="font-semibold text-foreground">
                    {recipe.average_rating
                      ? recipe.average_rating
                      : "Not rated yet"}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <ActionButtons
                recipe_id={recipe.id ?? ""}
                user_id={user?.id ?? ""}
              />

              {/* Author Info */}
              {recipe.author && <AuthorInfo author={recipe.author} />}
            </div>
          </div>

          {/* Recipe Content */}
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {/* Ingredients */}
              <IngredientsView ingredients={recipe?.ingredients} />

              {/* Instructions */}
              <InstructionsView instructions={recipe?.instructions} />

              {/* Cultural Note */}
              <RecipeCulturalNote culturalNote={recipe?.culturalNote} />

              {/* youtube video section */}
              <Card className="p-6 bg-card/70 backdrop-blur-sm border-border/50">
                <YoutubeVideoSection videoId={recipe.youtube_video_id} />
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Nutrition */}
              <NutritionView nutrition={recipe?.nutrition} />

              <RecipeRating
                user_id={user?.id ?? ""}
                recipe_id={recipe.id ?? ""}
                rating={
                  recipe.rating.find((r) => r.user_id === user?.id)?.rating || 0
                }
              />

              {/* Comments */}
              <Card className="p-6 bg-card/70 backdrop-blur-sm border-border/50">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                  <MessageRoundedDetail className="w-5 h-5 mr-2" />
                  Comments ({recipe.comments.length})
                </h3>

                {/* Add Comment */}
                <RecipeComment user_id={user?.id} recipe_id={recipe.id} />

                {/* Comments List */}
                <RecipeCommentList
                  user_id={user?.id || ""}
                  comments={recipe.comments as PostComment[]}
                />
              </Card>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
