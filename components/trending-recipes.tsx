"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { recipeStore } from "@/store/Recipe";
import { TrendingRecipe } from "@/utils/types/recipe";
import RecipeListSkeleton from "./skeleton/RecipeList";
import RecipeCard from "./recipe/RecipeCard";

export function TrendingRecipes() {
  const trendingRecipes = recipeStore((state) => state.trendingRecipes);
  const fetchTrendingRecipes = recipeStore(
    (state) => state.fetchTrendingRecipes,
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
          className="border-popular text-popular hover:bg-popular/5"
        >
          <Link href="/recipes?sorted_by=trending">View All</Link>
        </Button>
      </div>

      {loading ? (
        <RecipeListSkeleton />
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {trendingRecipes.map((recipe: TrendingRecipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} badge="trending" />
          ))}
        </div>
      )}
    </section>
  );
}
