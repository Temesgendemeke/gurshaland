"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AlertCircle,
  Brain,
  Camera,
  CheckCircle,
  Coins,
  Image,
  ImagePlus,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import FullRecipeModel from "./recipe/FullRecipeModel";
import RecipeProgressBar from "./RecipeProgressBar";
import { cn } from "@/lib/utils";
import { generateAIRecipeFromImage } from "@/actions/Recipe/imageRecipe";
import { getCredits } from "@/actions/credits";
import { useAuth } from "@/store/useAuth";
import { requireLogin } from "@/lib/auth-gate";
import { toast } from "sonner";
import { IconSparkles2Filled } from "@tabler/icons-react";
import { useReducedMotion } from "motion/react";
import { RECIPE_CREDIT_COST } from "@/constants/creditCosts";
import {
  compressImageToDataUrl,
  type CompressedImage,
} from "@/utils/compressImage";

const photoSteps = [
  { id: 1, label: "Analyzing your photo", icon: Camera, duration: 2000 },
  { id: 2, label: "Crafting recipe with AI", icon: Brain, duration: 3000 },
  { id: 3, label: "Generating recipe image", icon: Image, duration: 2500 },
  { id: 4, label: "Finalizing your recipe", icon: CheckCircle, duration: 1000 },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface PhotoToRecipeContextValue {
  user: any;
  image: CompressedImage | null;
  isGenerating: boolean;
  isCompressing: boolean;
  generatedRecipe: any;
  error: string | null;
  credits: number | null;
  needsLogin: boolean;
  outOfCredits: boolean;
  handleGenerate: () => void;
  handleLoginRedirect: () => void;
  handleFiles: (files: FileList | File[]) => void;
  removeImage: () => void;
}

const PhotoToRecipeContext = createContext<PhotoToRecipeContextValue | null>(
  null,
);

function usePhotoToRecipe() {
  const ctx = useContext(PhotoToRecipeContext);
  if (!ctx) throw new Error("Missing PhotoToRecipeProvider");
  return ctx;
}

export function PhotoToRecipeProvider({
  children,
  scrollOnGenerate = false,
}: {
  children: ReactNode;
  scrollOnGenerate?: boolean;
}) {
  const user = useAuth((store) => store.user);
  const reduceMotion = useReducedMotion();
  const [image, setImage] = useState<CompressedImage | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
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

  const needsLogin = !user;
  const outOfCredits =
    !!user && credits !== null && credits < RECIPE_CREDIT_COST;

  const scrollToResult = () => {
    const el = document.getElementById("photo-to-recipe-result");
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
    requireLogin();
  };

  const handleFiles = async (files: FileList | File[]) => {
    const file = Array.from(files)[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, or WebP).");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("That photo is too large. Please use one under 10MB.");
      return;
    }
    setIsCompressing(true);
    try {
      const compressed = await compressImageToDataUrl(file);
      setImage(compressed);
    } catch (err: any) {
      toast.error(
        err?.message || "Couldn't process that image. Try another one.",
      );
    } finally {
      setIsCompressing(false);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleGenerate = async () => {
    if (!image || isGenerating) return;

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
      const result = await generateAIRecipeFromImage(
        image.base64,
        image.mimeType,
      );
      if (result.success) {
        setGeneratedRecipe(result.recipe);
      } else {
        setError(result.error || "Failed to generate recipe");
      }
      await loadCredits();
    } catch (err: any) {
      const message = err?.message || "Something went wrong. Try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const value: PhotoToRecipeContextValue = {
    user,
    image,
    isGenerating,
    isCompressing,
    generatedRecipe,
    error,
    credits,
    needsLogin,
    outOfCredits,
    handleGenerate,
    handleLoginRedirect,
    handleFiles,
    removeImage,
  };

  return (
    <PhotoToRecipeContext.Provider value={value}>
      {children}
    </PhotoToRecipeContext.Provider>
  );
}

export function PhotoToRecipeForm() {
  const {
    user,
    image,
    isGenerating,
    isCompressing,
    credits,
    needsLogin,
    outOfCredits,
    handleGenerate,
    handleLoginRedirect,
    handleFiles,
    removeImage,
  } = usePhotoToRecipe();
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => inputRef.current?.click();

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

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
            Generate from a photo
          </h2>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            Upload a photo of a dish and we&apos;ll turn it into an Ethiopian
            recipe.
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

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {image ? (
        <div className="mt-4">
          <div className="relative overflow-hidden rounded-xl border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.dataUrl}
              alt="Uploaded food photo"
              className="h-52 w-full object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              aria-label="Remove photo"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-background/90 text-muted-foreground backdrop-blur transition-colors hover:text-error active:scale-90"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={openPicker}
            className="mt-2 text-xs font-medium text-primary underline underline-offset-2"
          >
            Choose a different photo
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          className={cn(
            "mt-4 flex min-h-44 w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-8 text-center transition-colors active:scale-[0.99]",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-border bg-background hover:border-primary/50",
          )}
        >
          {isCompressing ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Processing photo…
              </span>
            </>
          ) : (
            <>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ImagePlus className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <span className="font-medium text-foreground">
                Upload a food photo
              </span>
              <span className="text-xs leading-relaxed text-muted-foreground">
                Drag &amp; drop or click to browse
                <br />
                JPG, PNG, or WebP — up to 10MB
              </span>
            </>
          )}
        </button>
      )}

      {needsLogin ? (
        <p className="mt-4 rounded-lg border border-border bg-muted px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
          <button
            type="button"
            onClick={handleLoginRedirect}
            className="font-medium text-primary underline underline-offset-2"
          >
            Log in
          </button>{" "}
          to turn your photo into a recipe. New users get 100 free credits.
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
        disabled={isGenerating || isCompressing || !image || outOfCredits}
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

export function PhotoToRecipeResult({ className }: { className?: string }) {
  const { isGenerating, generatedRecipe, error, handleGenerate } =
    usePhotoToRecipe();

  if (!isGenerating && !generatedRecipe && !error) return null;

  return (
    <div id="photo-to-recipe-result" className={cn("min-w-0", className)}>
      {isGenerating ? (
        <RecipeProgressBar
          isGenerating={isGenerating}
          title="Creating your recipe"
          steps={photoSteps}
        />
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
