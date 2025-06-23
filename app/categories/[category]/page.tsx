"use client";

import React, { useState } from "react";
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

const categoryInfo = {
  bread: {
    name: "Bread & Grains",
    description:
      "Traditional Ethiopian breads and grain-based dishes that form the foundation of Ethiopian cuisine",
    color: "from-amber-500 to-orange-500",
  },
  meat: {
    name: "Meat Dishes",
    description:
      "Hearty stews and meat preparations that are central to Ethiopian celebrations",
    color: "from-red-500 to-red-600",
  },
  vegetarian: {
    name: "Vegetarian",
    description:
      "Plant-based dishes perfect for fasting periods and everyday meals",
    color: "from-green-500 to-emerald-600",
  },
  beverages: {
    name: "Beverages",
    description:
      "Traditional drinks including the famous Ethiopian coffee ceremony",
    color: "from-brown-500 to-amber-700",
  },
  desserts: {
    name: "Desserts & Sweets",
    description: "Traditional sweets and festive treats for special occasions",
    color: "from-pink-500 to-rose-500",
  },
  spices: {
    name: "Spices & Sauces",
    description:
      "Essential spice blends and condiments that define Ethiopian flavors",
    color: "from-orange-500 to-red-500",
  },
};

const recipes = [
  {
    id: 1,
    title: "Traditional Injera",
    description: "Fermented flatbread made from teff flour",
    image: "/placeholder.svg?height=200&width=300",
    difficulty: "Medium",
    time: "3 days",
    servings: 8,
    rating: 4.8,
    reviews: 124,
    author: "Almaz Tadesse",
    tags: ["Traditional", "Gluten-Free"],
  },
  {
    id: 2,
    title: "Doro Wat",
    description: "Spicy chicken stew with berbere spice",
    image: "/placeholder.svg?height=200&width=300",
    difficulty: "Hard",
    time: "2 hours",
    servings: 6,
    rating: 4.9,
    reviews: 89,
    author: "Kebede Alemu",
    tags: ["Spicy", "Traditional"],
  },
  {
    id: 3,
    title: "Shiro Wat",
    description: "Creamy chickpea flour stew",
    image: "/placeholder.svg?height=200&width=300",
    difficulty: "Easy",
    time: "45 min",
    servings: 4,
    rating: 4.7,
    reviews: 156,
    author: "Hanan Mohammed",
    tags: ["Vegetarian", "Quick"],
  },
];

type CategoryPageProps = {
  params: { category: string };
};

const CategoryPage: React.FC<CategoryPageProps> = ({ params }) => {
  const [sortBy, setSortBy] = useState("popular");

  const currentCategory =
    categoryInfo[params.category as keyof typeof categoryInfo] ||
    categoryInfo.bread;

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
            Showing {recipes.length} recipes in {currentCategory.name}
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
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
          {recipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="overflow-hidden hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-emerald-100 dark:border-emerald-800"
            >
              <div className="relative">
                <img
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{recipe.rating}</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex flex-wrap gap-1">
                    {recipe.tags.map((tag) => (
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
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {recipe.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {recipe.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
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
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    by {recipe.author}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {recipe.reviews} reviews
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-emerald-600 to-yellow-500 hover:from-emerald-700 hover:to-yellow-600 text-white rounded-full"
                >
                  <Link href={`/recipes/${recipe.id}`}>View Recipe</Link>
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
};

export default CategoryPage;
