"use client";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Star,
  Clock,
  Users,
  ChefHat,
  TrendingUp,
  Sparkles,
  User,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { recipeStore } from "@/store/Recipe";
import { FeaturedRecipe } from "@/utils/types/recipe";
import { TrendingRecipes } from "./trending-recipes";
import { blogStore } from "@/store/Blog";
import Image from "next/image";
import RecipeListSkeleton from "./skeleton/RecipeList";
import RecipeCard from "./recipe/RecipeCard";
import BlogPostCard from "./BlogPostCard";

export function FeaturedCards() {
  // const { featuredContent, getFeaturedContent } = useAppStore()
  const featuredRecipes = recipeStore((state) => state.featuredRecipes);
  const fetchFeaturedRecipes = recipeStore(
    (state) => state.fetchFeaturedRecipes,
  );
  const blogs = blogStore((state) => state.blogs);
  const fetchBlogs = blogStore((state) => state.fetchBlogs);
  const RecipeLoading = recipeStore((store) => store.loading) ?? true;
  const BlogLoading = blogStore((store) => store.loading) ?? true;

  useEffect(() => {
    fetchFeaturedRecipes();
    fetchBlogs();
  }, [fetchFeaturedRecipes, fetchBlogs]);

  return (
    <div className="space-y-16">
      {/* Featured Recipes */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold heading-primary mb-2">
              Featured Recipes
            </h2>
            <p className="text-body">Top-rated recipes with high engagement</p>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-primary text-primary hover:bg-primary/5"
          >
            <Link href="/recipes">View All</Link>
          </Button>
        </div>

        {RecipeLoading ? (
          <RecipeListSkeleton />
        ) : featuredRecipes?.length ? (
          <div className="grid md:grid-cols-3 gap-6">
            {featuredRecipes.map((recipe: FeaturedRecipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <p className="text-body">No featured recipes yet.</p>
        )}
      </section>

      {/* Trending Recipes */}
      <TrendingRecipes />

      {/* Featured Blog Posts */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold heading-primary mb-2">
              Latest from Our Blog
            </h2>
            <p className="text-body">
              Tips, techniques, and insights from Ethiopian cooking experts
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            className="border-primary text-primary hover:bg-primary/5"
          >
            <Link href="/blog">Read More</Link>
          </Button>
        </div>

        {BlogLoading ? (
          <RecipeListSkeleton />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {blogs?.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
