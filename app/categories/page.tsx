"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Utensils, Leaf, Coffee, Cookie, Flame, Wheat } from "lucide-react"

export default function CategoriesPage() {
  const categories = [
    {
      id: "bread",
      name: "Bread & Grains",
      description: "Traditional Ethiopian breads and grain-based dishes",
      icon: Wheat,
      color: "from-amber-500 to-orange-500",
      recipeCount: 45,
      featured: ["Injera", "Dabo Kolo", "Barley Bread"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "meat",
      name: "Meat Dishes",
      description: "Hearty stews and meat preparations",
      icon: Utensils,
      color: "from-red-500 to-red-600",
      recipeCount: 67,
      featured: ["Doro Wat", "Kitfo", "Siga Wat"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "vegetarian",
      name: "Vegetarian",
      description: "Plant-based dishes and fasting foods",
      icon: Leaf,
      color: "from-green-500 to-emerald-600",
      recipeCount: 89,
      featured: ["Shiro Wat", "Gomen", "Misir Wat"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "beverages",
      name: "Beverages",
      description: "Traditional drinks and coffee preparations",
      icon: Coffee,
      color: "from-brown-500 to-amber-700",
      recipeCount: 23,
      featured: ["Ethiopian Coffee", "Tej", "Tella"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "desserts",
      name: "Desserts & Sweets",
      description: "Traditional sweets and festive treats",
      icon: Cookie,
      color: "from-pink-500 to-rose-500",
      recipeCount: 34,
      featured: ["Honey Wine Cake", "Roasted Barley", "Sweet Injera"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "spices",
      name: "Spices & Sauces",
      description: "Essential spice blends and condiments",
      icon: Flame,
      color: "from-orange-500 to-red-500",
      recipeCount: 28,
      featured: ["Berbere", "Mitmita", "Awaze"],
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-700 via-yellow-600 to-red-600 bg-clip-text text-transparent">
              Recipe Categories
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore Ethiopian cuisine by category - from traditional breads to aromatic spices
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Link key={category.id} href={`/categories/${category.id}`}>
                <Card className="overflow-hidden hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-emerald-100 dark:border-emerald-800 h-full">
                  <div className="relative">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className="bg-white/90 text-gray-800 mb-2">{category.recipeCount} recipes</Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{category.description}</p>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Popular recipes:</p>
                      <div className="flex flex-wrap gap-1">
                        {category.featured.map((recipe) => (
                          <Badge
                            key={recipe}
                            variant="secondary"
                            className="text-xs dark:bg-gray-700 dark:text-gray-300"
                          >
                            {recipe}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Featured Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Trending This Week</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Most popular recipes across all categories</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "Injera", category: "Bread", views: "2.3k" },
              { name: "Doro Wat", category: "Meat", views: "1.8k" },
              { name: "Shiro Wat", category: "Vegetarian", views: "1.5k" },
              { name: "Ethiopian Coffee", category: "Beverages", views: "1.2k" },
            ].map((recipe, index) => (
              <Card
                key={recipe.name}
                className="p-4 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">{recipe.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{recipe.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{recipe.views}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">views</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
