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

export function FeaturedCards() {
  // const { featuredContent, getFeaturedContent } = useAppStore()
  const featuredRecipes = recipeStore((state) => state.featuredRecipes);
  const fetchFeaturedRecipes = recipeStore(
    (state) => state.fetchFeaturedRecipes
  );
  const blogs = blogStore((state) => state.blogs);
  const fetchBlogs = blogStore((state) => state.fetchBlogs);
  console.log(featuredRecipes);
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
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
          >
            <Link href="/recipes">View All</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredRecipes?.map((recipe: FeaturedRecipe) => (
            <Card
              key={recipe.id}
              className="modern-card modern-card-hover group"
            >
              <div className="relative">
                <img
                  src={recipe.image?.url || "/placeholder.svg"}
                  alt={recipe.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-emerald-600 text-white">Featured</Badge>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">
                    {recipe.average_rating || 0}
                  </span>
                </div>
                {recipe.rating_count && recipe.rating_count > 10 && (
                  <div className="absolute bottom-4 left-4">
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-700"
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold heading-primary mb-2 group-hover:text-emerald-600 transition-colors">
                  {recipe.title}
                </h3>
                <p className="text-body mb-4 line-clamp-2">
                  {recipe.description}
                </p>

                <div className="flex items-center justify-between text-sm text-body-muted mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <ChefHat className="w-4 h-4" />
                      <span>{recipe.difficulty}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{recipe.servings}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-body-muted">
                    Rating: {recipe.average_rating || 0} ({recipe.rating_count}{" "}
                    reviews)
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full btn-primary-modern rounded-full"
                >
                  <Link href={`/recipes/${recipe.slug}`}>View Recipe</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
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
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
          >
            <Link href="/blog">Read More</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {blogs?.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}?from=/`}>
              <Card className="modern-card modern-card-hover group">
                <div className="relative">
                  <img
                    src={post.image?.url || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-600 text-white">Featured</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge
                      variant="secondary"
                      className="bg-white/90 text-gray-700"
                    >
                      {post.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold heading-primary mb-2 group-hover:text-emerald-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-body mb-4">{post?.description}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags?.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-body-muted">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{post.author?.username}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{post?.readTime}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
