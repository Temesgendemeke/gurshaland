"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import GeneratedRecipeCard from "./GeneratedRecipeCard";
import EmptyRecipePrompt from "./EmptyRecipePrompt";
import RecipeProgressBar from "./RecipeProgressBar";
import { generateAIRecipe } from "@/actions/Recipe/airecipe";
import { toast } from "sonner";

const QUICK_PROMPTS = [
  "Chickpea flour, onion, garlic, berbere",
  "Chicken, onion, eggs, spiced butter",
  "Red lentils, carrots, turmeric",
];

export default function AIRecipeGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateAIRecipe(prompt, "");
      if (result.success) {
        setGeneratedRecipe(result.recipe);
      } else {
        setError(result.error || "Failed to generate recipe");
      }
    } catch (error: any) {
      const message = error?.message || "Something went wrong. Try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`rounded-2xl border border-border bg-card p-5 sm:p-6 `}>
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Generate a recipe
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe what you have or what you&apos;d like to cook.
        </p>
        <div className="mt-4 space-y-3">
          <Textarea
            placeholder="e.g. chickpea flour, onions, garlic, berbere — vegetarian"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="resize-none"
          />

          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPrompt(p)}
                className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {p}
              </button>
            ))}
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full sm:w-auto"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Recipe"
            )}
          </Button>
        </div>
      </div>

      <div className="mt-5">
        {
          isGenerating ? (
            <RecipeProgressBar isGenerating={isGenerating} />
          ) : generatedRecipe ? (
            <GeneratedRecipeCard recipe={generatedRecipe} />
          ) : error ? (
            <p className="rounded-lg border border-error/20 bg-error/5 p-3 text-sm text-error">
              {error}
            </p>
          ) : null
          // <EmptyRecipePrompt />
        }
      </div>
    </div>
  );
}
