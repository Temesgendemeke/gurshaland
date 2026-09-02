"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { ArrowDown, Search } from "lucide-react";
import { recipeStore } from "@/store/Recipe";
import RecipeListSkeleton from "@/components/skeleton/RecipeList";
import RecipeCard from "@/components/recipe/RecipeCard";
import { cn } from "@/lib/utils";

const POSTS_PER_PAGE = 6;

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const SORTS = [
  { value: "latest", label: "Latest" },
  { value: "trending", label: "Trending" },
  { value: "featured", label: "Featured" },
];

const CATEGORIES = [
  "all",
  "Bread",
  "Meat",
  "Vegetarian",
  "Spices",
  "Beverages",
  "Desserts",
];

const DIFFICULTIES = ["all", "Easy", "Medium", "Hard"];

function RecipesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sorted_by = searchParams.get("sorted_by");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const reduceMotion = useReducedMotion();
  const resultsRef = useRef<HTMLDivElement>(null);
  const hasUserInteracted = useRef(false);

  const allRecipes = recipeStore((store) => store.recipes) || [];
  const trendingRecipes = recipeStore((store) => store.trendingRecipes) || [];
  const featuredRecipes = recipeStore((store) => store.featuredRecipes) || [];
  const loading = recipeStore((store) => store.loading);
  const fetchRecipes = recipeStore((store) => store.fetchRecipes);
  const fetchTrendingRecipes = recipeStore(
    (store) => store.fetchTrendingRecipes,
  );
  const fetchFeaturedRecipes = recipeStore(
    (store) => store.fetchFeaturedRecipes,
  );

  const sort =
    sorted_by === "trending" || sorted_by === "featured" ? sorted_by : "latest";

  const recipes =
    sort === "trending"
      ? trendingRecipes
      : sort === "featured"
        ? featuredRecipes
        : allRecipes;

  useEffect(() => {
    if (sort === "trending") fetchTrendingRecipes();
    else if (sort === "featured") fetchFeaturedRecipes();
    else fetchRecipes();
  }, [sort, fetchRecipes, fetchTrendingRecipes, fetchFeaturedRecipes]);

  // Scroll to results when filters/search change
  useEffect(() => {
    if (!hasUserInteracted.current) return;

    if (resultsRef.current) {
      const y =
        resultsRef.current.getBoundingClientRect().top + window.scrollY - 280;
      window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
    }
  }, [searchTerm, selectedCategory, selectedDifficulty, reduceMotion]);

  const handleSortChange = (value: string) => {
    hasUserInteracted.current = true;
    setVisibleCount(POSTS_PER_PAGE);
    const params = new URLSearchParams(searchParams.toString());
    if (value === "latest") params.delete("sorted_by");
    else params.set("sorted_by", value);
    const query = params.toString();
    router.replace(query ? `/recipes?${query}` : "/recipes", { scroll: false });
  };

  const handleCategoryChange = (value: string) => {
    hasUserInteracted.current = true;
    setSelectedCategory(value);
    setVisibleCount(POSTS_PER_PAGE);
  };

  const handleDifficultyChange = (value: string) => {
    hasUserInteracted.current = true;
    setSelectedDifficulty(value);
    setVisibleCount(POSTS_PER_PAGE);
  };

  const handleSearchChange = (value: string) => {
    hasUserInteracted.current = true;
    setSearchTerm(value);
    setVisibleCount(POSTS_PER_PAGE);
  };

  const filteredRecipes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return recipes.filter((recipe) => {
      const matchesSearch =
        term === "" ||
        recipe.title.toLowerCase().includes(term) ||
        recipe.description.toLowerCase().includes(term) ||
        (recipe.tags || []).some((tag) => tag.toLowerCase().includes(term));
      const matchesCategory =
        selectedCategory === "all" ||
        recipe.category?.name === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === "all" ||
        recipe.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [recipes, searchTerm, selectedCategory, selectedDifficulty]);

  const visibleRecipes = filteredRecipes.slice(0, visibleCount);
  const hasMore = visibleCount < filteredRecipes.length;

  return (
    <div className="min-h-screen">
      <Header />

      {/* Masthead */}
      <header className="mx-auto w-full max-w-7xl px-4 pt-14 sm:px-6 md:pt-10">
        {/* <p className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-primary">
          The Gurshaland Kitchen
        </p> */}
        <h1 className="max-w-3xl font-gosh text-5xl font-semibold leading-[1.04] tracking-tighter text-foreground sm:text-6xl lg:text-7xl">
          Recipes Worth Cooking
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Dishes from Ethiopian kitchens, collected and tested by our cooks.
          Find your next meal by category or skill level.
        </p>
      </header>

      {/* Filters */}
      <div ref={resultsRef} className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mt-12 border-t border-border/70 pb-2">
          <div className="flex flex-col gap-3 py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
            {/* <div className="scrollbar-hide  flex gap-2 overflow-x-auto pb-1">
              {SORTS.map((s) => {
                const active = sort === s.value;
                return (
                  <button
                    key={s.value}
                    onClick={() => handleSortChange(s.value)}
                    className={cn(
                      "shrink-0 rounded-full border px-4 py-2  font-medium transition-all duration-200 active:scale-[0.97] text-xs",
                      active
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div> */}
            <div>
              <div className="scrollbar-hide  flex gap-2 overflow-x-auto pb-1">
                {CATEGORIES.map((category) => {
                  const active = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={cn(
                        "shrink-0 rounded-md border px-4 py-2 text-xs font-medium transition-colors duration-200 active:translate-y-px",
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-foreground/35 hover:text-foreground",
                      )}
                    >
                      {category === "all" ? "All categories" : category}
                    </button>
                  );
                })}
              </div>

              <div className="scrollbar-hide mt-2 flex gap-2 overflow-x-auto pb-1">
                {DIFFICULTIES.map((difficulty) => {
                  const active = selectedDifficulty === difficulty;
                  return (
                    <button
                      key={difficulty}
                      onClick={() => handleDifficultyChange(difficulty)}
                      className={cn(
                        "shrink-0 rounded-md border px-4 py-1.5 text-xs font-semibold transition-colors duration-200 active:translate-y-px",
                        active
                          ? "border-secondary bg-secondary text-secondary-foreground"
                          : "border-border bg-transparent text-muted-foreground hover:border-foreground/35 hover:text-foreground",
                      )}
                    >
                      {difficulty === "all" ? "All levels" : difficulty}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative lg:w-72">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-11 rounded-md border-border bg-card pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        {loading ? (
          <RecipeListSkeleton />
        ) : (
          <>
            <div className="mt-1 mb-8 flex items-end justify-between gap-4 border-b border-border/70 pb-5">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                The Collection
              </h2>
              <p className="shrink-0 text-sm text-muted-foreground">
                {filteredRecipes.length}{" "}
                {filteredRecipes.length === 1 ? "recipe" : "recipes"}
              </p>
            </div>

            {filteredRecipes.length > 0 ? (
              <>
                <motion.div
                  ref={resultsRef}
                  className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  initial={reduceMotion ? false : "hidden"}
                  animate="show"
                  variants={gridVariants}
                >
                  {visibleRecipes.map((recipe) => (
                    <motion.div
                      key={recipe.id ?? recipe.slug}
                      variants={cardVariants}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="min-h-full"
                    >
                      <RecipeCard recipe={recipe} />
                    </motion.div>
                  ))}
                </motion.div>

                {hasMore && (
                  <div className="mt-12 flex justify-center">
                    <button
                      onClick={() =>
                        setVisibleCount((count) => count + POSTS_PER_PAGE)
                      }
                      className="group inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-foreground/35 hover:text-primary active:translate-y-px"
                    >
                      Load more recipes
                      <ArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="border-y border-dashed border-border py-20 text-center">
                <p className="text-lg font-semibold text-foreground">
                  No recipes found
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different search term, category, or skill level.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function RecipesPage() {
  return (
    <Suspense fallback={<RecipeListSkeleton />}>
      <RecipesPageContent />
    </Suspense>
  );
}
