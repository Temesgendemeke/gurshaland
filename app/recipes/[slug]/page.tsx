"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import {
  Clock,
  Users,
  ChefHat,
  Star,
  MessageCircle,
} from "lucide-react";
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
    fetchRecipe(slug as string);
  }, [slug]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      {loading || !recipe ? (
        <RecipeDetailSkeleton />
      ) : (
        <div className="w-full md:max-w-7xl mx-auto px-6 py-12 space-y-4">
          {/* Back Navigation */}
          <BackNavigation pagename={"Recipes"}/>

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
                <Badge className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                  {recipe.category}
                </Badge>
                {recipe.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="dark:bg-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl break-words max-w-full font-bold text-gray-800 dark:text-gray-100 mb-4">
                {recipe.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {recipe.description}
              </p>

              {/* Recipe Meta */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-emerald-100 dark:border-emerald-800">
                  <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total Time
                  </div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">
                    {recipe.preptime + recipe.cooktime || "unkown"}
                  </div>
                </div>
                <div className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-emerald-100 dark:border-emerald-800">
                  <Users className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Servings
                  </div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">
                    {recipe.servings}
                  </div>
                </div>
                <div className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-emerald-100 dark:border-emerald-800">
                  <ChefHat className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Difficulty
                  </div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">
                    {recipe.difficulty}
                  </div>
                </div>
                <div className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-emerald-100 dark:border-emerald-800">
                  <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2 fill-current" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Rating
                  </div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">
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
              <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
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
