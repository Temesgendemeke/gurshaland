"use client";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Star,
  Users,
  ChefHat,
  TrendingUp,
  MessageCircle,
  Heart,
  Zap,
} from "lucide-react";
import { recipeStore } from "@/store/Recipe";
import { TrendingRecipe } from "@/utils/types/recipe";
import Image from "next/image";
import RecipeListSkeleton from "./skeleton/RecipeList";

export function TrendingRecipes() {
  const trendingRecipes = recipeStore((state) => state.trendingRecipes);
  const fetchTrendingRecipes = recipeStore(
    (state) => state.fetchTrendingRecipes
  );
  const loading = recipeStore((store) => store.loading) ?? true;

  useEffect(() => {
    fetchTrendingRecipes();
  }, [fetchTrendingRecipes]);

  if (!trendingRecipes || trendingRecipes.length === 0) {
    return null;
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold heading-primary mb-2">
            Trending Recipes
          </h2>
          <p className="text-body">Recipes that are hot this week</p>
        </div>
        <Button
          asChild
          variant="outline"
          className="border-orange-600 text-orange-600 hover:bg-orange-50"
        >
          <Link href="/recipes?sorted_by=trending">View All</Link>
        </Button>
      </div>

      {loading ? (
        <RecipeListSkeleton />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingRecipes.map((recipe: TrendingRecipe) => (
            <Card
              key={recipe.id}
              className="modern-card modern-card-hover group hover:scale-105 transition-transform duration-300"
            >
              <div className="relative">
                <Image
                  width={100}
                  height={100}
                  src={recipe.image?.url || "/placeholder.svg"}
                  alt={recipe.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-orange-600 text-white flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Trending
                  </Badge>
                </div>
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-medium">
                    {recipe.average_rating ?? 0}
                  </span>
                </div>

                {/* Recent activity indicators */}
                {recipe.recent_rating_count > 0 && (
                  <div className="absolute bottom-2 left-2">
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 text-xs"
                    >
                      {recipe.recent_rating_count} ratings this week
                    </Badge>
                  </div>
                )}
                {recipe.recent_comment_count > 0 && (
                  <div className="absolute bottom-2 right-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 text-xs"
                    >
                      {recipe.recent_comment_count} comments
                    </Badge>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold heading-primary mb-2 cursor-pointer group-hover:text-orange-600 transition-colors line-clamp-2">
                  {recipe.title}
                </h3>

                <div className="flex items-center justify-between text-sm text-body-muted mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <ChefHat className="w-3 h-3" />
                      <span className="text-xs">{recipe.difficulty}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span className="text-xs">{recipe.servings}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-body-muted mb-3">
                  <div className="flex items-center space-x-2">
                    <span>Score: {recipe.trending_score}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3 text-red-500" />
                    <span>{recipe.recent_like_count}</span>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full btn-primary-modern rounded-full text-sm"
                >
                  <Link href={`/recipes/${recipe.slug}`}>View Recipe</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
