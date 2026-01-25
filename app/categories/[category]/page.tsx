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
import { Star, Users, ChefHat } from "lucide-react";
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
        <div className="min-h-screen bg-background">
          <Header />
          <div className="max-w-7xl mx-auto px-6 py-12">
            <BackNavigation route={"/categories"} pagename={"Categories"} />
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-foreground mb-4">
                No recipes found in this category
              </h1>
              <p className="text-muted-foreground mb-6">
                This category doesn&apos;t have any recipes yet.
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
      <div className="min-h-screen bg-background">
        <Header />

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Back Navigation */}
          <BackNavigation route={"/categories"} pagename={"Categories"} />

          {/* Category Header */}
          <CategoryHeader currentCategory={currentCategory} />

          {/* Filters and Sorting */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="text-muted-foreground">
              Showing {recipes.length} recipes in {currentCategory}
            </div>

            <Select defaultValue="popular">
              <SelectTrigger className="w-48 border-border bg-background">
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
                className="overflow-hidden hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 group bg-card/70 backdrop-blur-sm border-border/50"
              >
                <div className="relative">
                  <img
                    src={recipe.image?.url || "/placeholder.svg"}
                    alt={recipe.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-background/80 border border-border/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span className="text-sm font-medium text-foreground">
                      {recipe.rating || 0}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap gap-1">
                      {recipe.tags?.map((tag: any, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-background/70 border border-border/50 text-foreground hover:bg-muted"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {recipe.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
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
                    <div className="text-sm text-muted-foreground">
                      by {recipe.author?.username || "Unknown"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {recipe.rating_count || 0} reviews
                    </div>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
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
              className="border-2 border-primary text-primary hover:bg-primary/5 rounded-full px-8"
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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <BackNavigation route={"/categories"} pagename={"Categories"} />
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Error loading recipes
            </h1>
            <p className="text-muted-foreground mb-6">
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
