import { Loader2, Sparkles } from "lucide-react";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import GeneratedRecipeCard from "./GeneratedRecipeCard";
import EmptyRecipePrompt from "./EmptyRecipePrompt";
import { Button } from "./ui/button";
import GeneratingSkeleton from "./skeleton/GenerateSkeleton";
import RecipeProgressBar from "./RecipeProgressBar";
import { generateAIRecipe } from "@/actions/Recipe/airecipe";
import { toast } from "sonner";

export default function AIRecipeGenerator() {
  const [ingredients, setIngredients] = useState("");
  const [preferences, setPreferences] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

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
      toast.error(errorMessage);
      console.error("Error generating recipe:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-card p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold heading-primary mb-3">
          AI Recipe Generator
        </h2>
        <p className="text-body max-w-2xl">
          Tell our AI what ingredients you have and your preferences, and we’ll
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
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
        <div className="border border-border rounded-lg p-6">
          {isGenerating ? (
            <RecipeProgressBar isGenerating={isGenerating} />
          ) : generatedRecipe ? (
            <GeneratedRecipeCard recipe={generatedRecipe} />
          ) : error ? (
            <div className="text-error">{error}</div>
          ) : (
            <EmptyRecipePrompt />
          )}
        </div>
      </div>
    </Card>
  );
}
