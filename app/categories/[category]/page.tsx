import React from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import CategoryHeader from "@/components/CategoryHeader";
import { getRecipesByCategory } from "@/actions/Recipe/category";
import Recipe from "@/utils/types/recipe";
import RecipeCard from "@/components/recipe/RecipeCard";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ id: string }>;
};

const CategoryPage: React.FC<CategoryPageProps> = async ({
  params,
  searchParams,
}) => {
  const { id } = await searchParams;
  const { category } = await params;

  let recipes: Recipe[] = [];
  let fetchError: unknown = null;
  try {
    recipes = await getRecipesByCategory(id);
  } catch (error) {
    console.error("Error fetching category recipes:", error);
    fetchError = error;
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-7xl px-3.5 py-12 sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <h1 className="mb-4 text-2xl font-bold text-foreground">
              Error loading recipes
            </h1>
            <p className="mb-6 text-muted-foreground">
              There was an error loading recipes for this category.
            </p>
            <Button asChild>
              <Link href="/categories">Back to Categories</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-7xl px-3.5 py-12 sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <h1 className="mb-4 text-2xl font-bold text-foreground">
              No recipes found in this category
            </h1>
            <p className="mb-6 text-muted-foreground">
              This category doesn&apos;t have any recipes yet.
            </p>
            <Button asChild>
              <Link href="/categories">Back to Categories</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentCategory = category.replace(/-/g, " ");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-3.5 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Category Header */}
        <CategoryHeader />

        {/* Filters and Sorting */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-medium text-muted-foreground">
            Showing {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"} in {currentCategory}
          </div>

          <Select defaultValue="popular">
            <SelectTrigger className="w-full sm:w-48 border-border bg-card">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="time">Cooking Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Recipe Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe: any) => (
            <RecipeCard recipe={recipe} key={recipe.id} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;
