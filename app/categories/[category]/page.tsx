import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft, Star, Clock, Users, ChefHat } from "lucide-react";
import BackNavigation from "@/components/BackNavigation";
import CategoryHeader from "@/components/CategoryHeader";
import { getRecipesByCategory } from "@/actions/Recipe/category";

type CategoryPageProps = {
  params: { category: string };
};

const CategoryPage: React.FC<CategoryPageProps> = async ({ params }) => {
  try {
    const recipes = await getRecipesByCategory(params.category);

    if (!recipes || recipes.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <Header />
          <div className="max-w-7xl mx-auto px-6 py-12">
            <BackNavigation route={"/categories"} pagename={"Categories"} />
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                No recipes found in this category
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This category doesn't have any recipes yet.
              </p>
              <Button asChild>
                <Link href="/categories">Back to Categories</Link>
              </Button>
            </div>
          </div>
          <Footer />
        </div>
      );
    }

    const currentCategory = recipes[0]?.category || params.category;

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Back Navigation */}
          <BackNavigation route={"/categories"} pagename={"Categories"} />

          {/* Category Header */}
          <CategoryHeader currentCategory={currentCategory} />

          {/* Filters and Sorting */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="text-gray-600 dark:text-gray-400">
              Showing {recipes.length} recipes in {currentCategory}
            </div>

            <Select defaultValue="popular">
              <SelectTrigger className="w-48 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe: any) => (
              <Card
                key={recipe.id}
                className="overflow-hidden hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-emerald-100 dark:border-emerald-800"
              >
                <div className="relative">
                  <img
                    src={recipe.image?.url || "/placeholder.svg"}
                    alt={recipe.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">
                      {recipe.rating || 0}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap gap-1">
                      {recipe.tags?.map((tag: any, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-black/50 text-white hover:bg-black/60"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {recipe.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <ChefHat className="w-4 h-4" />
                        <span>{recipe.difficulty}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{recipe.servings} servings</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      by {recipe.author?.username || "Unknown"}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {recipe.rating_count || 0} reviews
                    </div>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-emerald-600 to-yellow-500 hover:from-emerald-700 hover:to-yellow-600 text-white rounded-full"
                  >
                    <Link href={`/recipes/${recipe.slug}`}>View Recipe</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-full px-8"
            >
              Load More Recipes
            </Button>
          </div>
        </div>

        <Footer />
      </div>
    );
  } catch (error) {
    console.error("Error fetching category recipes:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <BackNavigation route={"/categories"} pagename={"Categories"} />
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Error loading recipes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              There was an error loading recipes for this category.
            </p>
            <Button asChild>
              <Link href="/categories">Back to Categories</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
};

export default CategoryPage;
