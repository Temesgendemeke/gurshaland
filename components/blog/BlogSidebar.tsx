import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Blog } from "@/utils/types/blog";
import Recipe from "@/utils/types/recipe";

interface BlogSidebarProps {
  currentSlug: string;
  recipes?: Recipe[];
  blogs?: Blog[];
}

export default function BlogSidebar({
  currentSlug,
  recipes = [],
  blogs = [],
}: BlogSidebarProps) {
  // Filter out the currently active blog post
  const sidebarBlogs = blogs.filter((b) => b.slug !== currentSlug).slice(0, 5);
  const sidebarRecipes = recipes.slice(0, 5);

  return (
    <aside className="w-full space-y-8">
      {/* Featured Recipes Widget */}
      {sidebarRecipes.length > 0 && (
        <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
          <div className="flex items-center justify-between pb-4 border-b border-border/40">
            <h3 className="font-semibold text-base tracking-tight text-foreground font-gosh">
              Featured Recipes
            </h3>
            <Link
              href="/recipes"
              className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 space-y-3.5">
            {sidebarRecipes.map((recipe: any, idx: number) => {
              const recipeKey = recipe.id ?? recipe.slug ?? `sidebar-recipe-${idx}`;
              const recipeImage =
                recipe?.image?.url ||
                (typeof recipe?.image === "string" ? recipe.image : null) ||
                "/placeholder.svg";
              const prepOrCook = recipe.preptime || recipe.cooktime;

              return (
                <Link
                  key={recipeKey}
                  href={`/recipes/${recipe.slug || recipe.id}`}
                  className="group flex items-center gap-3.5 rounded-xl p-1.5 transition-colors hover:bg-muted/40"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted border border-border/40">
                    <Image
                      src={recipeImage}
                      alt={recipe.title || "Recipe"}
                      fill
                      sizes="56px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {recipe.title}
                    </h4>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      {prepOrCook && <span>{prepOrCook}m</span>}
                      {prepOrCook && recipe.difficulty && <span>•</span>}
                      {recipe.difficulty && (
                        <span className="capitalize">{recipe.difficulty}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Latest / Related Blogs Widget */}
      {sidebarBlogs.length > 0 && (
        <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
          <div className="flex items-center justify-between pb-4 border-b border-border/40">
            <h3 className="font-semibold text-base tracking-tight text-foreground font-gosh">
              More Articles
            </h3>
            <Link
              href="/blog"
              className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 space-y-3.5">
            {sidebarBlogs.map((post, idx) => {
              const blogKey = post.id ?? post.slug ?? `sidebar-blog-${idx}`;
              return (
                <Link
                  key={blogKey}
                  href={`/blog/${post.slug}`}
                  className="group flex items-start gap-3.5 rounded-xl p-1.5 transition-colors hover:bg-muted/40"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted border border-border/40 mt-0.5">
                    <Image
                      src={post.image?.url || "/placeholder.svg"}
                      alt={post.title || "Article image"}
                      fill
                      sizes="56px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    {post.category && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                        {post.category}
                      </span>
                    )}
                    <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                    {post.read_time && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {post.read_time}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
