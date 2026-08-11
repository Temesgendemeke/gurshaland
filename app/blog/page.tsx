"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { ArrowDown, Search } from "lucide-react";
import BlogPostCard from "@/components/BlogPostCard";
import FeaturedPost from "@/components/FeaturedPost";
import categories from "@/constants/categories";
import { blogStore } from "@/store/Blog";
import BlogPageSkeleton from "@/components/skeleton/BlogPageSkeleton";
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

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const reduceMotion = useReducedMotion();

  const blogPosts = blogStore((store) => store.blogs) || [];
  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);
  const fetchBlogs = blogStore((store) => store.fetchBlogs);
  const loading = blogStore((store) => store.loading);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(POSTS_PER_PAGE);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setVisibleCount(POSTS_PER_PAGE);
  };

  const filteredPosts = useMemo(
    () =>
      regularPosts.filter((post) => {
        const term = searchTerm.trim().toLowerCase();
        const matchesSearch =
          term === "" ||
          post.title?.toLowerCase().includes(term) ||
          post?.subtitle?.toLowerCase().includes(term) ||
          post?.tags?.some((tag) => tag.toLowerCase().includes(term));
        const matchesCategory =
          selectedCategory === "all" || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
      }),
    [regularPosts, searchTerm, selectedCategory],
  );

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  return (
    <div className="min-h-screen">
      <Header />

      {/* Masthead */}
      <header className="mx-auto w-full max-w-7xl px-4 pt-14 sm:px-6 md:pt-20">
        <p className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-primary">
          The Gurshaland Journal
        </p>
        <h1 className="max-w-3xl text-5xl font-black leading-[1.04] tracking-tighter text-foreground sm:text-6xl lg:text-7xl">
          Ethiopian Food Blog
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Stories, recipes, and insights from the world of Ethiopian cuisine.
          From berbere-spiced kitchens to the traditions behind the plate.
        </p>
      </header>

      {/* Filters */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mt-12 border-t border-border/70 pb-2">
          <div className="flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="scrollbar-hide -mb-1 flex gap-2 overflow-x-auto pb-1">
              {categories.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={cn(
                      "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.97]",
                      active
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    {category === "all" ? "All stories" : category}
                  </button>
                );
              })}
            </div>

            <div className="relative lg:w-72">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-11 rounded-full border-border bg-card pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        {loading ? (
          <BlogPageSkeleton />
        ) : (
          <>
            {featuredPost && (
              <div className="mt-10">
                <FeaturedPost post={featuredPost} />
              </div>
            )}

            <div className="mt-16 mb-8 flex items-end justify-between gap-4 border-b border-border/70 pb-5">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Latest Articles
              </h2>
              <p className="shrink-0 text-sm text-muted-foreground">
                {filteredPosts.length}{" "}
                {filteredPosts.length === 1 ? "story" : "stories"}
              </p>
            </div>

            {filteredPosts.length > 0 ? (
              <>
                <motion.div
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  initial={reduceMotion ? false : "hidden"}
                  animate="show"
                  variants={gridVariants}
                >
                  {visiblePosts.map((post) => (
                    <motion.div
                      key={post.id}
                      variants={cardVariants}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <BlogPostCard post={post} />
                    </motion.div>
                  ))}
                </motion.div>

                {hasMore && (
                  <div className="mt-12 flex justify-center">
                    <button
                      onClick={() =>
                        setVisibleCount((count) => count + POSTS_PER_PAGE)
                      }
                      className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/40 hover:text-primary active:scale-[0.98]"
                    >
                      Load more stories
                      <ArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-card/50 py-20 text-center">
                <p className="text-lg font-semibold text-foreground">
                  No stories found
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different search term or category.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
