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
import { getRecipes } from "@/actions/Recipe/recipe";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/store/useAuth";
import { recipeStore } from "@/store/Recipe";
import RecipeListSkeleton from "@/components/skeleton/RecipeList";

export default function RecipesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [data, setData] = useState([]);
  const user = useAuth((store) => store.user);
  const fetchRecipes = recipeStore((store) => store.fetchRecipes);
  const recipes = recipeStore((store) => store.recipes) || [];
  const loading = recipeStore((store) => store.loading);

  useEffect(() => {
    fetchRecipes();
    supabase.storage.from("gurshaland-bucket").list().then(console.log);
    supabase.storage.from("gurshaland-bucket").list("recipe").then(console.log);

    const fetchRecipe = async () => {
      try {
        const data = await getRecipes();
        console.log(data);
        setData(data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch recipes. Please try again.");
      }
    };

    fetchRecipe();
  }, []);

  // const recipes = [
  //   ...data,
  // {
  //   id: 1,
  //   title: "Traditional Injera",
  //   slug: "traditional-injera",
  //   description:
  //     "Fermented flatbread made from teff flour - the foundation of Ethiopian cuisine",
  //   image: "/placeholder.svg?height=200&width=300",
  //   category: "Bread",
  //   difficulty: "Medium",
  //   time: "3 days",
  //   servings: 8,
  //   rating: 4.8,
  //   reviews: 124,
  //   author: "Almaz Tadesse",
  //   tags: ["Traditional", "Gluten-Free", "Fermented"],
  // },
  // {
  //   id: 2,
  //   title: "Doro Wat",
  //   slug: "doro-wat",
  //   description:
  //     "Ethiopia's national dish - spicy chicken stew with berbere and hard-boiled eggs",
  //   image: "/placeholder.svg?height=200&width=300",
  //   category: "Meat",
  //   difficulty: "Hard",
  //   time: "2 hours",
  //   servings: 6,
  //   rating: 4.9,
  //   reviews: 89,
  //   author: "Kebede Alemu",
  //   tags: ["Spicy", "Traditional", "Festive"],
  // },
  // {
  //   id: 3,
  //   title: "Shiro Wat",
  //   slug: "shiro-wat",
  //   description: "Creamy chickpea flour stew - a beloved vegetarian staple",
  //   image: "/placeholder.svg?height=200&width=300",
  //   category: "Vegetarian",
  //   difficulty: "Easy",
  //   time: "45 min",
  //   servings: 4,
  //   rating: 4.7,
  //   reviews: 156,
  //   author: "Hanan Mohammed",
  //   tags: ["Vegetarian", "Quick", "Protein-Rich"],
  // },
  // {
  //   id: 4,
  //   title: "Kitfo",
  //   slug: "kitfo",
  //   description:
  //     "Ethiopian steak tartare seasoned with mitmita spice and clarified butter",
  //   image: "/placeholder.svg?height=200&width=300",
  //   category: "Meat",
  //   difficulty: "Medium",
  //   time: "30 min",
  //   servings: 2,
  //   rating: 4.6,
  //   reviews: 67,
  //   author: "Dawit Bekele",
  //   tags: ["Raw", "Spicy", "Gourmet"],
  // },
  // {
  //   id: 5,
  //   title: "Berbere Spice Blend",
  //   slug: "berbere-spice-blend",
  //   description:
  //     "The soul of Ethiopian cooking - aromatic spice blend with over 15 ingredients",
  //   image: "/placeholder.svg?height=200&width=300",
  //   category: "Spices",
  //   difficulty: "Easy",
  //   time: "1 hour",
  //   servings: 20,
  //   rating: 4.9,
  //   reviews: 203,
  //   author: "Tigist Haile",
  //   tags: ["Spice", "Essential", "Homemade"],
  // },
  // {
  //   id: 6,
  //   title: "Ethiopian Coffee",
  //   slug: "ethiopian-coffee",
  //   description:
  //     "Traditional coffee ceremony - from green beans to the perfect cup",
  //   image: "/placeholder.svg?height=200&width=300",
  //   category: "Beverages",
  //   difficulty: "Medium",
  //   time: "1 hour",
  //   servings: 6,
  //   rating: 4.8,
  //   reviews: 91,
  //   author: "Selamawit Girma",
  //   tags: ["Coffee", "Ceremony", "Traditional"],
  // },
  // ];

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
      selectedCategory === "all" || recipe.category === selectedCategory;
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
            <span className="gradient-text-primary">Ethiopian Recipes</span>
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
            {filteredRecipes.map((recipe) => (
              <Card
                key={recipe.id}
                className="modern-card modern-card-hover overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={recipe.image?.url || "/placeholder.svg"}
                    alt={recipe.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-gray-700 hover:bg-white">
                      {recipe.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{recipe.rating}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap gap-1">
                      {recipe.tags?.slice(0, 2).map((tag: string) => (
                        <Badge
                          key={tag}
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
                  <h3 className="heading-secondary break-words whitespace-normal max-w-full group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    {recipe.title}
                  </h3>
                  <p className="text-body mb-4 line-clamp-2">
                    {recipe.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-body-muted mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{recipe.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{recipe.servings}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ChefHat className="w-4 h-4" />
                        <span>{recipe.difficulty}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-body-muted">
                      by {recipe.author?.username || "noname"}
                    </div>
                    <div className="text-sm text-body-muted">
                      {recipe.reviews} reviews
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
