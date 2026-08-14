"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { AlertCircle, Coins, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import TypedTextarea, { TYPED_PROMPTS } from "./TypedTextarea";
import FullRecipeModel from "./recipe/FullRecipeModel";
import RecipeProgressBar from "./RecipeProgressBar";
import { cn } from "@/lib/utils";
import { generateAIRecipe } from "@/actions/Recipe/airecipe";
import { getCredits } from "@/actions/credits";
import { useAuth } from "@/store/useAuth";
import {
  clearPendingAIGeneration,
  getPendingAIGeneration,
  requireLogin,
  savePendingAIGeneration,
} from "@/lib/auth-gate";
import { toast } from "sonner";
import { IconSparkles2Filled } from "@tabler/icons-react";
import { useReducedMotion } from "motion/react";

const RECIPE_CREDIT_COST = 1;

interface AIRecipeGeneratorContextValue {
  user: any;
  prompt: string;
  setPrompt: (value: string) => void;
  isGenerating: boolean;
  generatedRecipe: any;
  error: string | null;
  credits: number | null;
  needsLogin: boolean;
  outOfCredits: boolean;
  handleGenerate: () => void;
  handleLoginRedirect: () => void;
}

const AIRecipeGeneratorContext =
  createContext<AIRecipeGeneratorContextValue | null>(null);

function useAIRecipeGenerator() {
  const ctx = useContext(AIRecipeGeneratorContext);
  if (!ctx) throw new Error("Missing AIRecipeGeneratorProvider");
  return ctx;
}

export function AIRecipeGeneratorProvider({
  children,
  scrollOnGenerate = false,
}: {
  children: ReactNode;
  scrollOnGenerate?: boolean;
}) {
  const user = useAuth((store) => store.user);
  const reduceMotion = useReducedMotion();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);

  const loadCredits = async () => {
    const balance = await getCredits();
    setCredits(balance);
  };

  useEffect(() => {
    if (user) loadCredits();
    else setCredits(null);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const pending = getPendingAIGeneration();
    if (pending?.action === "recipe-generator") {
      if (pending.prompt) setPrompt(pending.prompt);
      clearPendingAIGeneration();
    }
  }, [user]);

  const needsLogin = !user;
  const outOfCredits =
    !!user && credits !== null && credits < RECIPE_CREDIT_COST;

  const scrollToResult = () => {
    const el = document.getElementById("ai-generator-result");
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const scrollToResultAfterRender = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToResult);
    });
  };

  const handleLoginRedirect = () => {
    savePendingAIGeneration({ action: "recipe-generator", prompt });
    requireLogin();
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    if (needsLogin) {
      handleLoginRedirect();
      return;
    }
    setIsGenerating(true);
    setError(null);

    if (scrollOnGenerate) {
      scrollToResultAfterRender();
    }

    try {
      const result = await generateAIRecipe(prompt, "");
      if (result.success) {
        setGeneratedRecipe(result.recipe);
      } else {
        setError(result.error || "Failed to generate recipe");
      }
      await loadCredits();
    } catch (error: any) {
      const message = error?.message || "Something went wrong. Try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const value: AIRecipeGeneratorContextValue = {
    user,
    prompt,
    setPrompt,
    isGenerating,
    generatedRecipe,
    error,
    credits,
    needsLogin,
    outOfCredits,
    handleGenerate,
    handleLoginRedirect,
  };

  return (
    <AIRecipeGeneratorContext.Provider value={value}>
      {children}
    </AIRecipeGeneratorContext.Provider>
  );
}

export function AIRecipeGeneratorForm() {
  const {
    user,
    prompt,
    setPrompt,
    isGenerating,
    credits,
    needsLogin,
    outOfCredits,
    handleGenerate,
    handleLoginRedirect,
  } = useAIRecipeGenerator();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleGenerate();
      }}
      className="rounded-2xl border border-border bg-card p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-gosh text-lg font-bold tracking-tight text-foreground">
            Generate a recipe
          </h2>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            Describe what you have or what you&apos;d like to cook.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[0.6875rem] font-medium text-muted-foreground">
          <Coins className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} />
          {user
            ? credits === null
              ? "…"
              : `${credits} credits`
            : "100 free credits"}
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <label
          htmlFor="recipe-prompt"
          className="block text-xs font-medium text-foreground"
        >
          What do you want to cook?
        </label>
        <TypedTextarea
          id="recipe-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
        />
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap gap-1.5">
          {TYPED_PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPrompt(p)}
              className="rounded-full border border-border bg-background px-2.5 py-1 text-[0.6875rem] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground active:scale-[0.98]"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {needsLogin ? (
        <p className="mt-4 rounded-lg border border-border bg-muted px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
          <button
            type="button"
            onClick={handleLoginRedirect}
            className="font-medium text-primary underline underline-offset-2"
          >
            Log in
          </button>{" "}
          to generate recipes. New users get 100 free credits.
        </p>
      ) : outOfCredits ? (
        <p className="mt-4 rounded-lg border border-error/25 bg-error/5 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
          You&apos;re out of credits. Each recipe generation costs{" "}
          {RECIPE_CREDIT_COST} credit.{" "}
          <Link
            href="/credits"
            className="font-medium text-primary underline underline-offset-2"
          >
            Buy more credits
          </Link>
          .
        </p>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">
          Costs {RECIPE_CREDIT_COST} credit per generation.
        </p>
      )}

      <Button
        type="submit"
        disabled={isGenerating || !prompt.trim() || outOfCredits}
        className="mt-4 w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <IconSparkles2Filled />
            Generate Recipe
          </>
        )}
      </Button>
    </form>
  );
}

export function AIRecipeGeneratorResult({ className }: { className?: string }) {
  const { isGenerating, generatedRecipe, error, handleGenerate } =
    useAIRecipeGenerator();

  if (!isGenerating && !generatedRecipe && !error) return null;

  return (
    <div id="ai-generator-result" className={cn("min-w-0", className)}>
      {isGenerating ? (
        <RecipeProgressBar isGenerating={isGenerating} />
      ) : generatedRecipe ? (
        <FullRecipeModel recipe={generatedRecipe} variant="inline" />
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-12 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-error/10">
            <AlertCircle className="h-5 w-5 text-error" strokeWidth={1.75} />
          </div>
          <h3 className="mt-4 font-gosh text-lg font-bold tracking-tight text-foreground">
            Couldn&apos;t generate your recipe
          </h3>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {error}
          </p>
          <Button onClick={handleGenerate} variant="outline" className="mt-6">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}

function AIRecipeGeneratorCombined() {
  const { isGenerating, generatedRecipe, error } = useAIRecipeGenerator();
  const showResult = isGenerating || !!generatedRecipe || !!error;

  return (
    <div
      className={cn(
        "grid items-start gap-10",
        showResult && "lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-12",
      )}
    >
      <div className={cn(showResult && "lg:sticky lg:top-18")}>
        <AIRecipeGeneratorForm />
      </div>

      {showResult && (
        <div className="min-w-0">
          <AIRecipeGeneratorResult />
        </div>
      )}
    </div>
  );
}

export default function AIRecipeGenerator() {
  return (
    <AIRecipeGeneratorProvider>
      <AIRecipeGeneratorCombined />
    </AIRecipeGeneratorProvider>
  );
}
