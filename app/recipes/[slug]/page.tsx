import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { Header } from "@/components/header";
import RecipeHeader from "@/components/recipe/RecipeHeader";
import RecipeSidebar from "@/components/recipe/RecipeSidebar";
import RecipeCommentSection from "@/components/recipe/RecipeCommentSection";
import RecipeImage from "@/components/recipe/RecipeModel/RecipeImage";
import InstructionsView from "@/components/InstructionsView";
import RecipeCulturalNote from "@/components/RecipeCulturalNote";
import YoutubeVideoSection from "@/components/recipe/YoutubeVideoSection";
import PreviewWarning from "@/components/PreviewWarning";
import ViewTracker from "@/components/ViewTracker";
import { createClient } from "@/utils/supabase/server";
import {
  getRecipebySlug,
  getFeaturedRecipes,
  getTrendingRecipes,
  getRecipes,
} from "@/actions/Recipe/recipe";
import type { Metadata } from "next";

interface RecipePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: RecipePageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const recipe = await getRecipebySlug(slug);
    if (!recipe) return { title: "Recipe Not Found | Gurshaland" };

    return {
      title: `${recipe.title} | Gurshaland`,
      description:
        recipe.description ||
        `Learn how to prepare authentic ${recipe.title} with step-by-step instructions.`,
      openGraph: {
        title: recipe.title,
        description: recipe.description,
        images: recipe.image?.url ? [{ url: recipe.image.url }] : [],
      },
    };
  } catch {
    return { title: "Recipe | Gurshaland" };
  }
}

export default async function RecipeDetailPage({ params }: RecipePageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let recipeData: any;
  try {
    recipeData = await getRecipebySlug(slug, user?.id);
  } catch (error) {
    console.error("Error fetching recipe by slug:", error);
    return notFound();
  }

  if (!recipeData) {
    return notFound();
  }

  // Fetch sidebar suggestions & related recipes in parallel
  const [featuredResult, trendingResult] = await Promise.allSettled([
    getFeaturedRecipes().catch(() => getRecipes().catch(() => [])),
    getTrendingRecipes().catch(() => []),
  ]);

  const featuredRecipes: any[] =
    featuredResult.status === "fulfilled" && Array.isArray(featuredResult.value)
      ? featuredResult.value
      : [];

  const trendingRecipes: any[] =
    trendingResult.status === "fulfilled" && Array.isArray(trendingResult.value)
      ? trendingResult.value
      : [];

  const isOwner = Boolean(
    user?.id &&
      (recipeData.author_id === user.id || recipeData.author?.id === user.id)
  );

  const recipeImgSrc =
    recipeData?.image?.url ||
    (typeof recipeData?.image === "string" ? recipeData.image : null) ||
    recipeData?.image_url ||
    "/placeholder.svg";

  // Bottom related recipes (up to 3 distinct items, deduplicated by id/slug)
  const seenRecipeKeys = new Set<string>();
  const moreRecipes = [...featuredRecipes, ...trendingRecipes]
    .filter((r) => {
      const key = String(r.slug || r.id || "");
      if (!key) return false;
      if (r.slug === slug || r.id === recipeData.id) return false;
      if (seenRecipeKeys.has(key)) return false;
      seenRecipeKeys.add(key);
      return true;
    })
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      {!isOwner && <ViewTracker type="recipe" id={recipeData.id ?? 0} />}

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Preview Mode Alert for Drafts */}
        <div className="mb-6">
          <PreviewWarning
            slug={recipeData.slug}
            postType="recipe"
            author_id={recipeData.author_id || ""}
            user_id={user?.id || ""}
            status={recipeData.status || ""}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:gap-12 lg:grid-cols-12">
          {/* Main Recipe Column */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-10">
            <RecipeHeader recipe={recipeData} isOwner={isOwner} />

            {/* Featured Recipe Cover Image */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-muted">
              <div className="relative aspect-[16/9] w-full max-h-[500px]">
                <RecipeImage
                  src={recipeImgSrc}
                  alt={recipeData.title || "Recipe photo"}
                  priority
                  className="h-full w-full"
                />

                {/* Rating Badge */}
                {recipeData?.average_rating ? (
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex items-center gap-2 rounded-xl border border-white/20 bg-black/60 px-3.5 py-1.5 sm:py-2 text-white backdrop-blur-md">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-sm sm:text-base tracking-tight text-white">
                      {recipeData.average_rating}
                    </span>
                    <span className="h-3.5 w-px bg-white/25" />
                    <span className="text-[11px] sm:text-xs font-medium tracking-wide text-white/90">
                      Community Rating
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Recipe Story / Cultural Significance */}
            {recipeData.culturalNote && (
              <RecipeCulturalNote culturalNote={recipeData.culturalNote} />
            )}

            {/* Step-by-Step Instructions */}
            <InstructionsView instructions={recipeData.instructions} />

            {/* Optional Video Tutorial */}
            {recipeData.youtube_video_id && (
              <YoutubeVideoSection
                videoId={recipeData.youtube_video_id}
                videoQuery={recipeData.youtube_search_query}
              />
            )}
          </div>

          {/* Sticky Sidebar Column (4 Cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <RecipeSidebar
                recipe={recipeData}
                featuredRecipes={featuredRecipes}
                currentUserId={user?.id}
                isOwner={isOwner}
              />
            </div>
          </div>
        </div>

        {/* Community Responses & Reviews - Always below the sidebar */}
        <section className="mt-12 max-w-3xl">
          <div className="">
            <RecipeCommentSection
              recipeId={recipeData.id}
              postAuthorId={recipeData.author_id}
              initialComments={recipeData.comments}
              isOwner={isOwner}
            />
          </div>
        </section>
      </main>

      {/* More Recipes You'll Love Section */}
      {moreRecipes.length > 0 && (
        <section className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-t border-border/60 pt-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold tracking-tight text-foreground font-gosh">
                More Recipes You&apos;ll Love
              </h3>
              <Link
                href="/recipes"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Browse all &rarr;
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {moreRecipes.map((item) => {
                const itemImg =
                  item.image?.url ||
                  (typeof item.image === "string" ? item.image : null) ||
                  "/placeholder.svg";
                const totalTime =
                  item.preptime && item.cooktime
                    ? item.preptime + item.cooktime
                    : item.preptime || item.cooktime;

                return (
                  <Link
                    key={item.slug || item.id}
                    href={`/recipes/${item.slug || item.id}`}
                    className="group flex flex-col gap-3 rounded-xl border border-border bg-card/40 p-3 hover:border-foreground/30 hover:bg-card/80 transition-colors"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-muted border border-border/50">
                      <Image
                        src={itemImg}
                        alt={item.title || "Recipe image"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col gap-1 p-1">
                      {item.category?.name && (
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                          {item.category.name}
                        </p>
                      )}
                      <h4 className="text-base font-bold leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground pt-1 border-t border-border/40">
                        {totalTime && <span>{totalTime} mins</span>}
                        {totalTime && item.difficulty && <span>•</span>}
                        {item.difficulty && (
                          <span className="capitalize">{item.difficulty}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
