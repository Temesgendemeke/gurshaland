"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useState } from "react"
import { Clock, Users, ChefHat, Star, Heart, Bookmark, Share2, MessageCircle, ThumbsUp, ArrowLeft } from "lucide-react"

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [newComment, setNewComment] = useState("")

  // Mock recipe data - in real app, fetch based on params.id
  const recipe = {
    id: 1,
    title: "Traditional Injera",
    description:
      "Authentic Ethiopian fermented flatbread made from teff flour. This spongy, slightly sour bread is the foundation of Ethiopian cuisine and serves as both plate and utensil.",
    image: "/placeholder.svg?height=400&width=600",
    category: "Bread",
    difficulty: "Medium",
    prepTime: "30 min",
    cookTime: "3 days",
    totalTime: "3 days 30 min",
    servings: 8,
    rating: 4.8,
    reviews: 124,
    likes: 89,
    author: {
      name: "Almaz Tadesse",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Traditional Ethiopian cook from Addis Ababa",
      recipes: 23,
    },
    tags: ["Traditional", "Gluten-Free", "Fermented", "Vegan"],
    ingredients: [
      { item: "Teff flour", amount: "4 cups", notes: "Can substitute with whole wheat flour if teff unavailable" },
      { item: "Water", amount: "5 cups", notes: "Room temperature" },
      { item: "Active dry yeast", amount: "1 tsp", notes: "Optional, for faster fermentation" },
      { item: "Salt", amount: "1 tsp", notes: "To taste" },
    ],
    instructions: [
      {
        step: 1,
        title: "Prepare the batter",
        description:
          "Mix teff flour with 3 cups of water in a large bowl. Whisk until smooth and no lumps remain. Cover with a clean cloth and let sit at room temperature for 3 days to ferment naturally.",
        time: "15 min",
        tips: "The batter should bubble and develop a slightly sour smell when properly fermented.",
      },
      {
        step: 2,
        title: "Cook the starter",
        description:
          "After 3 days, take 1 cup of the fermented batter and cook it in a saucepan with 1 cup of water over medium heat, stirring constantly until it thickens to a paste-like consistency.",
        time: "10 min",
        tips: "This cooked starter helps create the characteristic spongy texture.",
      },
      {
        step: 3,
        title: "Combine and rest",
        description:
          "Mix the cooked starter back into the remaining fermented batter. Add remaining water and salt. Let rest for 30 minutes.",
        time: "5 min + 30 min rest",
        tips: "The batter should be pourable but not too thin.",
      },
      {
        step: 4,
        title: "Cook the injera",
        description:
          "Heat a non-stick pan or traditional mitad over medium heat. Pour batter to cover the bottom, starting from the outside and spiraling inward. Cover and cook until the surface is full of holes and edges lift up.",
        time: "3-4 min per injera",
        tips: "Don't flip the injera - it cooks from steam trapped underneath.",
      },
    ],
    nutrition: {
      calories: 180,
      protein: "6g",
      carbs: "38g",
      fat: "1g",
      fiber: "4g",
    },
    culturalNote:
      "Injera is more than just bread in Ethiopian culture - it's a symbol of community and sharing. Traditionally, families gather around a large platter of injera topped with various stews, eating together with their hands in a practice called 'gursha'.",
  
    }

  const comments = [
    {
      id: 1,
      author: "Meron Bekele",
      avatar: "/placeholder.svg?height=32&width=32",
      comment:
        "This recipe is exactly like my grandmother's! The fermentation tips are spot on. Thank you for sharing this authentic version.",
      rating: 5,
      date: "2 days ago",
      likes: 12,
    },
    {
      id: 2,
      author: "David Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      comment:
        "I couldn't find teff flour locally, so I used the whole wheat substitute. Still came out great! The texture was amazing.",
      rating: 4,
      date: "1 week ago",
      likes: 8,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Back Navigation */}
        <Button asChild variant="ghost" className="mb-6 hover:bg-emerald-100 dark:hover:bg-emerald-900/50">
          <Link href="/recipes">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Recipes
          </Link>
        </Button>

        {/* Recipe Header */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div>
            <img
              src={recipe.image || "/placeholder.svg"}
              alt={recipe.title}
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Badge className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                {recipe.category}
              </Badge>
              {recipe.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">{recipe.title}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{recipe.description}</p>

            {/* Recipe Meta */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-emerald-100 dark:border-emerald-800">
                <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Time</div>
                <div className="font-semibold text-gray-800 dark:text-gray-200">{recipe.totalTime}</div>
              </div>
              <div className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-emerald-100 dark:border-emerald-800">
                <Users className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                <div className="text-sm text-gray-500 dark:text-gray-400">Servings</div>
                <div className="font-semibold text-gray-800 dark:text-gray-200">{recipe.servings}</div>
              </div>
              <div className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-emerald-100 dark:border-emerald-800">
                <ChefHat className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto mb-2" />
                <div className="text-sm text-gray-500 dark:text-gray-400">Difficulty</div>
                <div className="font-semibold text-gray-800 dark:text-gray-200">{recipe.difficulty}</div>
              </div>
              <div className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-emerald-100 dark:border-emerald-800">
                <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2 fill-current" />
                <div className="text-sm text-gray-500 dark:text-gray-400">Rating</div>
                <div className="font-semibold text-gray-800 dark:text-gray-200">{recipe.rating}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Button
                onClick={() => setIsLiked(!isLiked)}
                variant={isLiked ? "default" : "outline"}
                className="flex-1 sm:flex-none"
              >
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                {isLiked ? "Liked" : "Like"} ({recipe.likes})
              </Button>
              <Button
                onClick={() => setIsBookmarked(!isBookmarked)}
                variant={isBookmarked ? "default" : "outline"}
                className="flex-1 sm:flex-none"
              >
                <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
                {isBookmarked ? "Saved" : "Save"}
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Author Info */}
            <Card className="p-4 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
              <div className="flex items-center space-x-4">
                <img
                  src={recipe.author.avatar || "/placeholder.svg"}
                  alt={recipe.author.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">{recipe.author.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{recipe.author.bio}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{recipe.author.recipes} recipes shared</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Recipe Content */}
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Ingredients */}
            <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Ingredients</h2>
              <ul className="space-y-4">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="font-medium text-gray-800 dark:text-gray-200">{ingredient.amount}</span>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{ingredient.item}</span>
                      {ingredient.notes && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{ingredient.notes}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Instructions */}
            <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Instructions</h2>
              <div className="space-y-6">
                {recipe.instructions.map((instruction) => (
                  <div key={instruction.step} className="flex space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-emerald-600 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                      {instruction.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{instruction.title}</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-2">{instruction.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>⏱️ {instruction.time}</span>
                      </div>
                      {instruction.tips && (
                        <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-l-4 border-emerald-500">
                          <p className="text-sm text-emerald-700 dark:text-emerald-300">
                            <strong>Tip:</strong> {instruction.tips}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Cultural Note */}
            <Card className="p-6 bg-gradient-to-r from-emerald-50 to-yellow-50 dark:from-emerald-900/20 dark:to-yellow-900/20 border-emerald-200 dark:border-emerald-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Cultural Significance</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{recipe.culturalNote}</p>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Nutrition */}
            <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Nutrition (per serving)</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Calories</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{recipe.nutrition.calories}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Protein</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{recipe.nutrition.protein}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Carbs</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{recipe.nutrition.carbs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Fat</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{recipe.nutrition.fat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Fiber</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{recipe.nutrition.fiber}</span>
                </div>
              </div>
            </Card>

            {/* Comments */}
            <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Comments ({comments.length})
              </h3>

              {/* Add Comment */}
              <div className="mb-6">
                <Textarea
                  placeholder="Share your experience with this recipe..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-3 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                />
                <Button className="bg-gradient-to-r from-emerald-600 to-yellow-500 hover:from-emerald-700 hover:to-yellow-600 text-white">
                  Post Comment
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <img
                        src={comment.avatar || "/placeholder.svg"}
                        alt={comment.author}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-800 dark:text-gray-200">{comment.author}</span>
                          <div className="flex">
                            {[...Array(comment.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{comment.date}</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{comment.comment}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                        >
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {comment.likes}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
