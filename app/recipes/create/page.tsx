"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Plus, X, Upload, Clock, Users } from "lucide-react"

export default function CreateRecipePage() {
  const [ingredients, setIngredients] = useState([{ item: "", amount: "", notes: "" }])
  const [instructions, setInstructions] = useState([{ title: "", description: "", time: "", tips: "" }])
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const addIngredient = () => {
    setIngredients([...ingredients, { item: "", amount: "", notes: "" }])
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const addInstruction = () => {
    setInstructions([...instructions, { title: "", description: "", time: "", tips: "" }])
  }

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Navigation */}
        <Button asChild variant="ghost" className="mb-6 hover:bg-emerald-100 dark:hover:bg-emerald-900/50">
          <Link href="/recipes">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Recipes
          </Link>
        </Button>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-700 via-yellow-600 to-red-600 bg-clip-text text-transparent">
              Share Your Recipe
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Help preserve Ethiopian culinary traditions by sharing your family recipes
          </p>
        </div>

        <form className="space-y-8">
          {/* Basic Information */}
          <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Basic Information</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">
                  Recipe Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Traditional Injera"
                  className="mt-2 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">
                  Category *
                </Label>
                <Select>
                  <SelectTrigger className="mt-2 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bread">Bread</SelectItem>
                    <SelectItem value="meat">Meat Dishes</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="beverages">Beverages</SelectItem>
                    <SelectItem value="desserts">Desserts</SelectItem>
                    <SelectItem value="spices">Spices & Sauces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your recipe, its origins, and what makes it special..."
                className="mt-2 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                rows={4}
              />
            </div>

            {/* Recipe Meta */}
            <div className="grid md:grid-cols-4 gap-4 mt-6">
              <div>
                <Label htmlFor="prepTime" className="text-gray-700 dark:text-gray-300">
                  Prep Time
                </Label>
                <div className="relative mt-2">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="prepTime"
                    placeholder="30 min"
                    className="pl-10 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cookTime" className="text-gray-700 dark:text-gray-300">
                  Cook Time
                </Label>
                <div className="relative mt-2">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="cookTime"
                    placeholder="1 hour"
                    className="pl-10 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="servings" className="text-gray-700 dark:text-gray-300">
                  Servings
                </Label>
                <div className="relative mt-2">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="servings"
                    placeholder="4"
                    className="pl-10 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="difficulty" className="text-gray-700 dark:text-gray-300">
                  Difficulty
                </Label>
                <Select>
                  <SelectTrigger className="mt-2 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Recipe Image */}
          <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Recipe Image</h2>

            <div className="border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-lg p-8 text-center hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors">
              <Upload className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">PNG, JPG up to 10MB</p>
              <Button
                variant="outline"
                className="mt-4 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400"
              >
                Choose File
              </Button>
            </div>
          </Card>

          {/* Ingredients */}
          <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Ingredients</h2>
              <Button
                onClick={addIngredient}
                variant="outline"
                size="sm"
                className="border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Ingredient
              </Button>
            </div>

            <div className="space-y-4">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="grid md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-3">
                    <Input
                      placeholder="Amount (e.g., 2 cups)"
                      value={ingredient.amount}
                      onChange={(e) => {
                        const newIngredients = [...ingredients]
                        newIngredients[index].amount = e.target.value
                        setIngredients(newIngredients)
                      }}
                      className="border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <Input
                      placeholder="Ingredient name"
                      value={ingredient.item}
                      onChange={(e) => {
                        const newIngredients = [...ingredients]
                        newIngredients[index].item = e.target.value
                        setIngredients(newIngredients)
                      }}
                      className="border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <Input
                      placeholder="Notes (optional)"
                      value={ingredient.notes}
                      onChange={(e) => {
                        const newIngredients = [...ingredients]
                        newIngredients[index].notes = e.target.value
                        setIngredients(newIngredients)
                      }}
                      className="border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                    />
                  </div>
                  <div className="md:col-span-1">
                    {ingredients.length > 1 && (
                      <Button
                        onClick={() => removeIngredient(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Instructions */}
          <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Instructions</h2>
              <Button
                onClick={addInstruction}
                variant="outline"
                size="sm"
                className="border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </div>

            <div className="space-y-6">
              {instructions.map((instruction, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">Step {index + 1}</span>
                    {instructions.length > 1 && (
                      <Button
                        onClick={() => removeInstruction(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">Step Title</Label>
                      <Input
                        placeholder="e.g., Prepare the batter"
                        value={instruction.title}
                        onChange={(e) => {
                          const newInstructions = [...instructions]
                          newInstructions[index].title = e.target.value
                          setInstructions(newInstructions)
                        }}
                        className="mt-2 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">Time Required</Label>
                      <Input
                        placeholder="e.g., 15 min"
                        value={instruction.time}
                        onChange={(e) => {
                          const newInstructions = [...instructions]
                          newInstructions[index].time = e.target.value
                          setInstructions(newInstructions)
                        }}
                        className="mt-2 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label className="text-gray-700 dark:text-gray-300">Instructions</Label>
                    <Textarea
                      placeholder="Describe this step in detail..."
                      value={instruction.description}
                      onChange={(e) => {
                        const newInstructions = [...instructions]
                        newInstructions[index].description = e.target.value
                        setInstructions(newInstructions)
                      }}
                      className="mt-2 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Tips (Optional)</Label>
                    <Textarea
                      placeholder="Any helpful tips for this step..."
                      value={instruction.tips}
                      onChange={(e) => {
                        const newInstructions = [...instructions]
                        newInstructions[index].tips = e.target.value
                        setInstructions(newInstructions)
                      }}
                      className="mt-2 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Tags */}
          <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Tags</h2>

            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-2 dark:bg-gray-700 dark:text-gray-300"
                >
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add a tag (e.g., Traditional, Spicy, Vegan)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                className="border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
              />
              <Button
                onClick={addTag}
                variant="outline"
                className="border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400"
              >
                Add
              </Button>
            </div>
          </Card>

          {/* Cultural Note */}
          <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              Cultural Significance (Optional)
            </h2>
            <Textarea
              placeholder="Share the cultural background, family history, or traditional significance of this recipe..."
              className="border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
              rows={4}
            />
          </Card>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-yellow-500 hover:from-emerald-700 hover:to-yellow-600 text-white px-8 py-4 text-lg rounded-full"
            >
              Publish Recipe
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-8 py-4 text-lg rounded-full"
            >
              Save as Draft
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
