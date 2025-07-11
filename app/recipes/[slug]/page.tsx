"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Clock,
  Users,
  ChefHat,
  Star,
  Heart,
  Bookmark,
  Share2,
  MessageCircle,
  ThumbsUp,
  ArrowLeft,
  Trash,
} from "lucide-react";
import { recipeStore } from "@/store/Recipe";
import Recipe, { PostComment } from "@/utils/types/recipe";
import { useParams } from "next/navigation";
import RecipeComment from "@/components/RecipeComment";
import { useAuth } from "@/store/useAuth";
import Image from "next/image";
import { useRef } from "react";
import RecipeRating from "@/components/RecipeRating";
import RecipeDetailSkeleton from "@/components/skeleton/RecipeDetailSkeleton";
import RecipeCommentList from "@/components/RecipeCommentList";
import { useRecipeDetailStore } from "@/store/Recipedetail";
import { toast } from "sonner";

export default function RecipeDetailPage() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
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
        <div className="w-full md:max-w-9xl mx-auto px-6 py-12">
          {/* Back Navigation */}
          <Button
            asChild
            variant="ghost"
            className="mb-6 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
          >
            <Link href="/recipes">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Recipes
            </Link>
          </Button>

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
                    {recipe.prepTime + recipe.cookTime || "unkown"}
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
              <div className="flex flex-wrap gap-4 mb-6">
                <Button
                  onClick={() => setIsLiked(!isLiked)}
                  variant={isLiked ? "default" : "outline"}
                  className="flex-1 sm:flex-none"
                >
                  <Heart
                    className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`}
                  />
                  {isLiked ? "Liked" : "Like"} ({recipe.likes.length})
                </Button>
                <Button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  variant={isBookmarked ? "default" : "outline"}
                  className="flex-1 sm:flex-none"
                >
                  <Bookmark
                    className={`w-4 h-4 mr-2 ${
                      isBookmarked ? "fill-current" : ""
                    }`}
                  />
                  {isBookmarked ? "Saved" : "Save"}
                </Button>
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              {/* Author Info */}
              <Card className="p-4 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      recipe.author?.avatar_url ||
                      "https://avatar.iran.liara.run/public/boy"
                    }
                    alt={recipe.author?.full_name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      @{recipe.author?.username}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {recipe.author?.bio}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {recipe.author?.recipes} recipes shared
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Recipe Content */}
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {/* Ingredients */}
              <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                  Ingredients
                </h2>
                <ul className="space-y-4">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {ingredient.amount}
                        </span>
                        <span className="ml-2 text-gray-700 dark:text-gray-300">
                          {ingredient.item}
                        </span>
                        {ingredient.notes && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {ingredient.notes}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Instructions */}
              <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                  Instructions
                </h2>
                <div className="space-y-6">
                  {recipe.instructions.map((instruction) => (
                    <div key={instruction.step} className="flex space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-emerald-600 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                        {instruction.step}
                      </div>

                      {instruction.image?.url && (
                        <Image
                          src={instruction.image?.url}
                          width={400}
                          height={400}
                          alt={`${instruction.step} image`}
                        />
                      )}

                      <div className="flex-1">
                        <h2 className="font-semibold text-2xl text-gray-800 dark:text-gray-200 mb-2">
                          {instruction.title}
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                          {instruction.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>⏱️ {instruction.time}</span>
                        </div>
                        {instruction.tips && (
                          <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-l-4 border-emerald-500">
                            <p className="text-sm text-emerald-700 dark:text-emerald-300">
                              <strong>Tip:</strong> {instruction.tips}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Cultural Note */}
              {recipe.culturalNote && (
                <Card className="p-6 bg-gradient-to-r from-emerald-50 to-yellow-50 dark:from-emerald-900/20 dark:to-yellow-900/20 border-emerald-200 dark:border-emerald-700">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                    Cultural Significance
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {recipe.culturalNote}
                  </p>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Nutrition */}
              <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  Nutrition (per serving)
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Calories
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {recipe.nutrition?.calories ?? "unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Protein
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {recipe.nutrition?.protein}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Carbs
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {recipe.nutrition?.carbs}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Fat
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {recipe.nutrition?.fat}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Fiber
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {recipe.nutrition?.fiber}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
                <h2 className="text-xl font-bold dark:bg-gray-800 dark:text-gray-100 mb-4 flex items-center">
                  Rate this recipe
                </h2>
                <RecipeRating
                  user_id={user?.id ?? ""}
                  recipe_id={recipe.id ?? ""}
                  rating={
                    recipe.rating.find((r) => r.user_id === user?.id)?.rating ||
                    0
                  }
                />
              </Card>

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
