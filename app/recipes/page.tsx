"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Search, Filter, Star, Clock, Users, ChefHat } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getFeaturedRecipes, getTrendingRecipes, getRecipes } from "@/actions/Recipe/recipe";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();
import { useAuth } from "@/store/useAuth";
import { recipeStore } from "@/store/Recipe";
import RecipeListSkeleton from "@/components/skeleton/RecipeList";
import { format_date } from "@/utils/formatdate";
import format_time from "@/utils/format_time";
import RecipeCard from "@/components/recipe/RecipeCard";
import { useSearchParams } from "next/navigation";

export default function RecipesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [data, setData] = useState([]);
  const user = useAuth((store) => store.user);
  const fetchRecipes = recipeStore((store) => store.fetchRecipes);
  const recipes = recipeStore((store) => store.recipes) || [];
  const loading = recipeStore((store) => store.loading);
  const searchParams = useSearchParams();
  const sorted_by = searchParams.get("sorted_by");

  useEffect(() => {
    fetchRecipes();

    const fetchRecipe = async () => {
      try {
        let data = [];
        if (sorted_by == "trending") {
           data = await getTrendingRecipes();
        } else if (sorted_by == "featured") {
           data = await getFeaturedRecipes();
        }else{
          data = await getRecipes();
        }
        console.log(data);
        setData(data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch recipes. Please try again.");
      }
    };

    fetchRecipe();
  }, []);

  const categories = [
    "all",
    "Bread",
    "Meat",
    "Vegetarian",
    "Spices",
    "Beverages",
    "Desserts",
  ];
  const difficulties = ["all", "Easy", "Medium", "Hard"];

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || recipe.category.name === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "all" ||
      recipe.difficulty === selectedDifficulty.toLowerCase();

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="modern-gradient-bg min-h-screen">
      <Header />

      <div className="max-w-9xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="">Ethiopian Recipes</span>
          </h1>
          <p className="text-xl text-body max-w-2xl mx-auto">
            Discover authentic Ethiopian dishes from our community of passionate
            cooks
          </p>
        </div>

        {/* Search and Filters */}
        <div className="modern-card rounded-2xl p-6 mb-8 border border-emerald-100 dark:border-emerald-800">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search recipes, ingredients, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-modern"
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-48 h-12 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedDifficulty}
              onValueChange={setSelectedDifficulty}
            >
              <SelectTrigger className="w-full md:w-48 h-12 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty === "all" ? "All Levels" : difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button className="btn-primary-modern h-12 px-6">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredRecipes.length} of {recipes.length} recipes
          </p>
        </div>

        {/* Recipe Grid */}
        {loading ? (
          <RecipeListSkeleton />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe, index) => (
              <RecipeCard recipe={recipe} key={index} />
            ))}
          </div>
        )}

        {/* Load More */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-full px-8"
          >
            Load More Recipes
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
