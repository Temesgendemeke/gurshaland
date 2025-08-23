import { ChefHat, Sparkles } from "lucide-react";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import GeneratedRecipeCard from "./GeneratedRecipeCard";
import EmptyRecipePrompt from "./EmptyRecipePrompt";
import { Button } from "./ui/button";
import GeneratingSkeleton from "./skeleton/GenerateSkeleton";
import { generateAIRecipe } from "@/actions/Recipe/airecipe";

export default function AIRecipeGenerator() {
  const [ingredients, setIngredients] = useState("");
  const [preferences, setPreferences] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null); // Clear previous errors

    try {
      console.log("Starting recipe generation...");
      const result = await generateAIRecipe(ingredients, preferences);
      console.log("Generation result:", result);

      if (result.success) {
        setGeneratedRecipe(result.recipe);
      } else {
        setError(result.error || "Failed to generate recipe");
        console.error("Failed to generate recipe:", result.error);
      }
    } catch (error: any) {
      const errorMessage = error?.message || "An unexpected error occurred";
      setError(errorMessage);
      console.error("Error generating recipe:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="modern-card p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
          <ChefHat className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold heading-primary mb-4">
          AI Recipe Generator
        </h2>
        <p className="text-body max-w-2xl mx-auto">
          Tell our AI what ingredients you have and your preferences, and we'll
          create a personalized Ethiopian recipe just for you!
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-body mb-2">
              Available Ingredients
            </label>
            <Textarea
              placeholder="e.g., chickpea flour, onions, garlic, berbere spice, olive oil..."
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="min-h-[100px] focus-modern"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-body mb-2">
              Dietary Preferences & Notes
            </label>
            <Textarea
              placeholder="e.g., vegetarian, spicy, quick cooking time, serves 4 people..."
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              className="min-h-[100px] focus-modern"
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !ingredients.trim()}
            className="w-full btn-primary-modern py-3"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Generating Recipe...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Recipe with AI
              </>
            )}
          </Button>
        </div>
        <div className="modern-card p-6">
          {isGenerating ? (
            <GeneratingSkeleton />
          ) : generatedRecipe ? (
            <GeneratedRecipeCard recipe={generatedRecipe} />
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <EmptyRecipePrompt />
          )}
        </div>
      </div>
    </Card>
  );
}
