"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { TrendingUp, Star, Clock, Users, Sparkles, FlameIcon as Fire } from "lucide-react"
import { useAppStore } from "@/lib/store"

export function TrendingSection() {
  const { getTrendingRecipes, getNewRecipes } = useAppStore()

  const trendingRecipes = getTrendingRecipes()
  const newRecipes = getNewRecipes()

  return (
    <div className="space-y-12">
      {/* Trending Recipes */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold heading-primary">Trending Now</h2>
              <p className="text-body">Most popular recipes this week</p>
            </div>
          </div>
          <Button asChild variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
            <Link href="/recipes?filter=trending">View All Trending</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingRecipes.map((recipe, index) => (
            <Card key={recipe.id} className="modern-card modern-card-hover group relative">
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                {index + 1}
              </div>

              <div className="relative">
                <img
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.title}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-orange-600 text-white text-xs">
                    <Fire className="w-3 h-3 mr-1" />
                    Hot
                  </Badge>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold heading-primary text-sm mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                  {recipe.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-body-muted mb-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span>{recipe.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{recipe.time}</span>
                  </div>
                </div>
                <Button asChild size="sm" className="w-full btn-primary-modern text-xs">
                  <Link href={`/recipes/${recipe.id}`}>View Recipe</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* New Recipes */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold heading-primary">Fresh Additions</h2>
              <p className="text-body">Recently added to our collection</p>
            </div>
          </div>
          <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
            <Link href="/recipes?filter=new">View All New</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newRecipes.map((recipe) => (
            <Card key={recipe.id} className="modern-card modern-card-hover group">
              <div className="relative">
                <img
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.title}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-blue-600 text-white text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    New
                  </Badge>
                </div>
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-medium">{recipe.rating}</span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold heading-primary text-sm mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                  {recipe.title}
                </h3>
                <p className="text-xs text-body mb-2 line-clamp-2">{recipe.description}</p>
                <div className="flex items-center justify-between text-xs text-body-muted mb-2">
                  <span>by {recipe.author}</span>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{recipe.servings}</span>
                  </div>
                </div>
                <Button asChild size="sm" className="w-full btn-primary-modern text-xs">
                  <Link href={`/recipes/${recipe.id}`}>Try Recipe</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
