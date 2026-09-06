"use client";
import { useEffect, useMemo, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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

function BlogPageContent() {
  const searchParams = useSearchParams();
  const initialTag = searchParams?.get("tag") || searchParams?.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(initialTag);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const reduceMotion = useReducedMotion();
  const resultsRef = useRef<HTMLDivElement>(null);
  const hasUserInteracted = useRef(false);

  // Sync if URL query param changes
  useEffect(() => {
    const queryTag = searchParams?.get("tag") || searchParams?.get("search");
    if (queryTag !== null && queryTag !== undefined) {
      setSearchTerm(queryTag);
      hasUserInteracted.current = true;
    }
  }, [searchParams]);

  const blogPosts = blogStore((store) => store.blogs) || [];
  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);
  const fetchBlogs = blogStore((store) => store.fetchBlogs);
  const loading = blogStore((store) => store.loading);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Scroll to results when filters/search change
  useEffect(() => {
    if (!hasUserInteracted.current) return;

    if (resultsRef.current) {
      const y =
        resultsRef.current.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
    }
  }, [searchTerm, selectedCategory, reduceMotion]);

  const handleCategoryChange = (category: string) => {
    hasUserInteracted.current = true;
    setSelectedCategory(category);
    setVisibleCount(POSTS_PER_PAGE);
  };

  const handleSearchChange = (value: string) => {
    hasUserInteracted.current = true;
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

  const hasQuery = searchTerm.trim() !== "" || selectedCategory !== "all";

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  return (
    <div className="min-h-screen">
      <Header />

      {/* Masthead */}
      <header className="mx-auto w-full max-w-7xl px-3.5 pt-8 sm:px-6 sm:pt-12 md:pt-14 lg:px-8">
        <h1 className="max-w-3xl font-gosh text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Ethiopian Food Blog
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
          Stories, recipes, and insights from the world of Ethiopian cuisine.
          From berbere-spiced kitchens to the traditions behind the plate.
        </p>
      </header>

      {/* Filters */}
      <div ref={resultsRef} className="mx-auto w-full max-w-7xl px-3.5 sm:px-6 lg:px-8">
        <div className="mt-8 border-t border-border/70 pb-2 sm:mt-12">
          <div className="flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="scrollbar-hide -mb-1 flex gap-2 overflow-x-auto pb-1">
              {categories.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={cn(
                      "shrink-0 rounded-md border px-4 py-2 text-sm font-medium transition-colors duration-200 active:translate-y-px",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-foreground/35 hover:text-foreground",
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
                className="h-11 rounded-md border-border bg-card pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-7xl px-3.5 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        {loading ? (
          <BlogPageSkeleton />
        ) : (
          <>
            {hasQuery ? (
              <>
                <div className="mt-2 mb-8 flex items-end justify-between gap-4 border-b border-border/70 pb-5">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Search Results
                  </h2>
                  <p className="shrink-0 text-sm text-muted-foreground">
                    {filteredPosts.length}{" "}
                    {filteredPosts.length === 1 ? "story" : "stories"}
                  </p>
                </div>

                {filteredPosts.length > 0 ? (
                  <>
                    <motion.div
                      className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3"
                      initial={reduceMotion ? false : "hidden"}
                      animate="show"
                      variants={gridVariants}
                    >
                      {visiblePosts.map((post) => (
                        <motion.div
                          key={post.id}
                          variants={cardVariants}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          className="min-h-full"
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
                          className="group inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-foreground/35 hover:text-primary active:translate-y-px"
                        >
                          Load more stories
                          <ArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="border-y border-dashed border-border py-20 text-center">
                    <p className="text-lg font-semibold text-foreground">
                      No stories found
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Try a different search term or category.
                    </p>
                  </div>
                )}
              </>
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
                      className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3"
                      initial={reduceMotion ? false : "hidden"}
                      animate="show"
                      variants={gridVariants}
                    >
                      {visiblePosts.map((post) => (
                        <motion.div
                          key={post.id}
                          variants={cardVariants}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          className="min-h-full"
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
                          className="group inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-foreground/35 hover:text-primary active:translate-y-px"
                        >
                          Load more stories
                          <ArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="border-y border-dashed border-border py-20 text-center">
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
          </>
        )}
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogPageSkeleton />}>
      <BlogPageContent />
    </Suspense>
  );
}

