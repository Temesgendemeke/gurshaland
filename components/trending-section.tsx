"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  TrendingUp,
  Star,
  Clock,
  Users,
  Sparkles,
  FlameIcon as Fire,
} from "lucide-react";
import { recipeStore } from "@/store/Recipe";
import { useEffect } from "react";
import RecipeListSkeleton from "./skeleton/RecipeList";

export function TrendingSection() {
  const fetchTrendingRecipes = recipeStore(
    (store) => store.fetchTrendingRecipes,
  );
  const trendingRecipes = recipeStore((store) => store.trendingRecipes);
  const fetchRecipes = recipeStore((store) => store.fetchRecipes);
  const newRecipes = recipeStore((store) => store.recipes);
  const loading = recipeStore((store) => store.loading);

  useEffect(() => {
    fetchTrendingRecipes();
    fetchRecipes();
  }, [fetchTrendingRecipes, fetchRecipes]);

  return (
    <div className="space-y-12">
      {/* Trending Recipes */}

      {/* New Recipes */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-3xl font-bold heading-primary">
                Fresh Additions
              </h2>
              <p className="text-body">Recently added to our collection</p>
            </div>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-primary/40 text-primary hover:bg-primary/10"
          >
            <Link href="/recipes?filter=new">View All New</Link>
          </Button>
        </div>

        {loading ? (
          <RecipeListSkeleton />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newRecipes?.map((recipe) => (
              <Card
                key={recipe.id}
                className="modern-card modern-card-hover group"
              >
                <div className="relative">
                  <img
                    src={recipe.image?.url || "/placeholder.svg"}
                    alt={recipe.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-primary text-primary-foreground text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      New
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2 bg-background/80 border border-border/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                    <Star className="w-3 h-3 text-warning fill-current" />
                    <span className="text-xs font-medium">
                      {recipe.average_rating}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold heading-primary text-sm mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-body mb-2 line-clamp-2">
                    {recipe.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-body-muted mb-2">
                    <span>by {recipe.author?.username}</span>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{recipe.servings}</span>
                    </div>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    className="w-full btn-primary-modern text-xs"
                  >
                    <Link href={`/recipes/${recipe.slug}`}>Try Recipe</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
