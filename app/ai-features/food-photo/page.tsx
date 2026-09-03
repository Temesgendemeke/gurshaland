import { Header } from "@/components/header";
import {
  PhotoToRecipeForm,
  PhotoToRecipeProvider,
  PhotoToRecipeResult,
} from "@/components/PhotoToRecipeGenerator";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function FoodPhotoPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto w-full max-w-7xl sm:px-6 pb-24 space-y-4 pt-8">
        <Link
          href="/ai-features"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground px-2 sm:px-0"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to AI Features
        </Link>

        <PhotoToRecipeProvider scrollOnGenerate>
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-6 px-2 sm:px-0">
            <header className="w-full sm:max-w-2xl">
              <h1 className="font-gosh text-3xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
                Turn any food photo into an Ethiopian dish
              </h1>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground sm:text-lg">
                Upload a photo of a dish you love  from any cuisine  and
                we&apos;ll craft the closest authentic Ethiopian recipe with
                steps, nutrition, and a photo in about a minute.
              </p>
            </header>

            <div>
              <PhotoToRecipeForm />
            </div>
          </div>

          <PhotoToRecipeResult className="mt-10 px-2 sm:px-0" />
        </PhotoToRecipeProvider>
      </main>
    </div>
  );
}
