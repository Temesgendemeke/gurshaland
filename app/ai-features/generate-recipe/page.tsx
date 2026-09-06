import { Header } from "@/components/header";
import {
  AIRecipeGeneratorForm,
  AIRecipeGeneratorProvider,
  AIRecipeGeneratorResult,
} from "@/components/AIRecipeGenerator";

export default async function GenerateRecipePage({
  searchParams,
}: {
  searchParams: Promise<{ prompt?: string | string[] }>;
}) {
  const { prompt } = await searchParams;
  const initialPrompt = typeof prompt === "string" ? prompt : "";

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto w-full max-w-7xl sm:px-6 pb-24 space-y-4 pt-8">
        <AIRecipeGeneratorProvider
          scrollOnGenerate
          initialPrompt={initialPrompt}
        >
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-6 px-2 sm:px-0">
            <header className="w-full sm:max-w-2xl ">
              {/* <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-primary">
                AI Recipe Generator
              </p> */}
              <h1 className="font-gosh text-3xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
                Turn what you have into an Ethiopian dish
              </h1>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground sm:text-lg">
                Tell us what you&apos;d like to make and what you have on hand,
                and we&apos;ll craft an authentic Ethiopian recipe with steps,
                nutrition, and a photo in about a minute.
              </p>
            </header>

            <div className=" ">
              <AIRecipeGeneratorForm />
            </div>
          </div>

          <AIRecipeGeneratorResult className="mt-10 px-2 sm:px-0" />
        </AIRecipeGeneratorProvider>
      </main>
    </div>
  );
}
