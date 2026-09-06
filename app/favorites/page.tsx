"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { Heart, Search, ArrowDown, UtensilsCrossed, BookOpen } from "lucide-react";
import { favoritesStore } from "@/store/Favorites";
import { useAuth } from "@/store/useAuth";
import RecipeListSkeleton from "@/components/skeleton/RecipeList";
import RecipeCard from "@/components/recipe/RecipeCard";
import BlogPostCard from "@/components/BlogPostCard";
import { useRouter } from "next/navigation";
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

export default function FavoritesPage() {
  const user = useAuth((store) => store.user);
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [activeTab, setActiveTab] = useState<"recipes" | "blogs">("recipes");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  // Recipes state
  const recipes = favoritesStore((store) => store.recipes);
  const recipesLoading = favoritesStore((store) => store.loading);
  const recipesFetched = favoritesStore((store) => store.fetched);
  const fetchBookmarks = favoritesStore((store) => store.fetchBookmarks);

  // Blogs state
  const blogs = favoritesStore((store) => store.blogs);
  const blogsLoading = favoritesStore((store) => store.blogsLoading);
  const blogsFetched = favoritesStore((store) => store.blogsFetched);
  const fetchBlogBookmarks = favoritesStore((store) => store.fetchBlogBookmarks);

  useEffect(() => {
    if (user?.id) {
      fetchBookmarks(user.id);
      fetchBlogBookmarks(user.id);
    }
  }, [user?.id, fetchBookmarks, fetchBlogBookmarks]);

  const filteredRecipes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return recipes.filter((recipe) => {
      if (term === "") return true;
      return (
        recipe.title.toLowerCase().includes(term) ||
        recipe.description.toLowerCase().includes(term) ||
        (recipe.tags || []).some((tag) => tag.toLowerCase().includes(term))
      );
    });
  }, [recipes, searchTerm]);

  const filteredBlogs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return blogs.filter((blog) => {
      if (term === "") return true;
      return (
        (blog.title && blog.title.toLowerCase().includes(term)) ||
        (blog.subtitle && blog.subtitle.toLowerCase().includes(term)) ||
        (blog.category && blog.category.toLowerCase().includes(term)) ||
        (blog.tags || []).some((tag) => tag.toLowerCase().includes(term))
      );
    });
  }, [blogs, searchTerm]);

  const visibleRecipes = filteredRecipes.slice(0, visibleCount);
  const hasMoreRecipes = visibleCount < filteredRecipes.length;

  const visibleBlogs = filteredBlogs.slice(0, visibleCount);
  const hasMoreBlogs = visibleCount < filteredBlogs.length;

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Your Favorites
          </h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            Sign in to see the recipes and articles you&apos;ve saved. Bookmark any recipe or article to
            find it here later.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="btn-primary-modern mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Masthead */}
      <header className="mx-auto w-full max-w-7xl px-4 pt-14 sm:px-6 md:pt-10">
        <h1 className="max-w-3xl text-5xl font-black leading-[1.04] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Your Favorites
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Recipes and articles you&apos;ve bookmarked. All in one place.
        </p>
      </header>

      {/* Tabs + Search */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mt-12 border-t border-border/70 pt-6 pb-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Tabs */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("recipes");
                  setVisibleCount(POSTS_PER_PAGE);
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-95",
                  activeTab === "recipes"
                    ? "bg-foreground text-background"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <UtensilsCrossed className="h-4 w-4" />
                <span>Recipes</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-bold tabular-nums",
                    activeTab === "recipes"
                      ? "bg-background/20 text-background"
                      : "bg-background/80 text-muted-foreground"
                  )}
                >
                  {recipes.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("blogs");
                  setVisibleCount(POSTS_PER_PAGE);
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-95",
                  activeTab === "blogs"
                    ? "bg-foreground text-background"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <BookOpen className="h-4 w-4" />
                <span>Articles</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-bold tabular-nums",
                    activeTab === "blogs"
                      ? "bg-background/20 text-background"
                      : "bg-background/80 text-muted-foreground"
                  )}
                >
                  {blogs.length}
                </span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative sm:w-72">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={
                  activeTab === "recipes"
                    ? "Search saved recipes..."
                    : "Search saved articles..."
                }
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisibleCount(POSTS_PER_PAGE);
                }}
                className="h-10 rounded-full border-border bg-card pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        {activeTab === "recipes" ? (
          // RECIPES TAB
          recipesLoading ? (
            <RecipeListSkeleton />
          ) : (
            <>
              <div className="mt-1 mb-8 flex items-end justify-between gap-4 border-b border-border/70 pb-5">
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Saved Recipes
                </h2>
                <p className="shrink-0 text-sm text-muted-foreground">
                  {filteredRecipes.length}{" "}
                  {filteredRecipes.length === 1 ? "recipe" : "recipes"}
                </p>
              </div>

              {recipesFetched && filteredRecipes.length === 0 && !recipesLoading ? (
                <div className="rounded-xl border border-dashed border-border bg-card/50 py-20 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {recipes.length === 0
                      ? "No saved recipes yet"
                      : "No matches found"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {recipes.length === 0
                      ? "Browse recipes and tap the bookmark icon to save your favorites."
                      : "Try a different search term."}
                  </p>
                  {recipes.length === 0 && (
                    <button
                      onClick={() => router.push("/recipes")}
                      className="btn-primary-modern mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
                    >
                      Browse recipes
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <motion.div
                    className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    initial={reduceMotion ? false : "hidden"}
                    animate="show"
                    variants={gridVariants}
                  >
                    {visibleRecipes.map((recipe) => (
                      <motion.div
                        key={recipe.id ?? recipe.slug}
                        variants={cardVariants}
                        transition={{
                          duration: 0.5,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="min-h-full"
                      >
                        <RecipeCard recipe={recipe} />
                      </motion.div>
                    ))}
                  </motion.div>

                  {hasMoreRecipes && (
                    <div className="mt-12 flex justify-center">
                      <button
                        onClick={() =>
                          setVisibleCount((count) => count + POSTS_PER_PAGE)
                        }
                        className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/40 hover:text-primary active:scale-[0.98]"
                      >
                        Load more
                        <ArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )
        ) : (
          // ARTICLES / BLOGS TAB
          blogsLoading ? (
            <RecipeListSkeleton />
          ) : (
            <>
              <div className="mt-1 mb-8 flex items-end justify-between gap-4 border-b border-border/70 pb-5">
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Saved Articles
                </h2>
                <p className="shrink-0 text-sm text-muted-foreground">
                  {filteredBlogs.length}{" "}
                  {filteredBlogs.length === 1 ? "article" : "articles"}
                </p>
              </div>

              {blogsFetched && filteredBlogs.length === 0 && !blogsLoading ? (
                <div className="rounded-xl border border-dashed border-border bg-card/50 py-20 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {blogs.length === 0
                      ? "No saved articles yet"
                      : "No matches found"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {blogs.length === 0
                      ? "Browse the blog and tap the bookmark icon on any article to save it."
                      : "Try a different search term."}
                  </p>
                  {blogs.length === 0 && (
                    <button
                      onClick={() => router.push("/blog")}
                      className="btn-primary-modern mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
                    >
                      Browse articles
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <motion.div
                    className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    initial={reduceMotion ? false : "hidden"}
                    animate="show"
                    variants={gridVariants}
                  >
                    {visibleBlogs.map((blog) => (
                      <motion.div
                        key={blog.id ?? blog.slug}
                        variants={cardVariants}
                        transition={{
                          duration: 0.5,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="min-h-full"
                      >
                        <BlogPostCard post={blog} />
                      </motion.div>
                    ))}
                  </motion.div>

                  {hasMoreBlogs && (
                    <div className="mt-12 flex justify-center">
                      <button
                        onClick={() =>
                          setVisibleCount((count) => count + POSTS_PER_PAGE)
                        }
                        className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/40 hover:text-primary active:scale-[0.98]"
                      >
                        Load more
                        <ArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )
        )}
      </div>
    </div>
  );
}
