import React from "react";
import type Recipe from "@/utils/types/recipe";
import {
  ArrowUpRight,
  ChefHat,
  Clock,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import format_time from "@/utils/format_time";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface RecipeCardProp {
  recipe: Recipe;
  badge?: string;
  icon?: React.ReactNode;
}

const RecipeCard = ({ recipe, badge, icon }: RecipeCardProp) => {
  const totalMinutes = (recipe.cooktime ?? 0) + (recipe.preptime ?? 0);
  const displayTime = totalMinutes > 0 ? format_time(totalMinutes) : "Unknown";
  const displayRating =
    typeof recipe.average_rating === "number"
      ? recipe.average_rating.toFixed(1)
      : null;

  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:border-primary"
    >
      {/* Image */}
      <div className="relative aspect-[16/8] overflow-hidden bg-muted">
        <Image
          src={recipe.image?.url || "/placeholder.svg"}
          alt={recipe.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out "
        />
        <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

        {badge && (
          <div className="absolute left-3 top-3">
            <Badge
              className={cn(
                "border-0 font-bold uppercase tracking-wider text-[0.625rem]",
                badge.toLowerCase() === "trending"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary text-primary-foreground",
              )}
            >
              {icon ? (
                <span className="mr-1 flex items-center">{icon}</span>
              ) : (
                badge.toLowerCase() === "trending" && (
                  <TrendingUp className="mr-1 h-3 w-3" />
                )
              )}
              {badge}
            </Badge>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-2 sm:p-4">
        {/* <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-primary">
          {recipe.category?.name || "Ethiopian"}
        </p> */}

        <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
          {recipe.title}
        </h3>

        <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {recipe.description}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {displayTime}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {recipe.servings || "-"} servings
          </span>
          {recipe.difficulty && (
            <span className="inline-flex items-center gap-1.5">
              <ChefHat className="h-3.5 w-3.5" />
              {recipe.difficulty}
            </span>
          )}
          {displayRating && (
            <span className="inline-flex items-center gap-1.5 text-foreground">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              {displayRating}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between border-t border-border/70 pt-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-muted text-xs font-bold text-muted-foreground">
                {recipe.author?.avatar_url ? (
                  <Image
                    src={recipe.author.avatar_url}
                    alt={recipe.author.username || "Author"}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                ) : (
                  recipe.author?.username?.[0]?.toUpperCase() || "A"
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground">
                  {recipe.author?.username || "Anonymous"}
                </p>
                <p className="text-[0.6875rem] text-muted-foreground">
                  Gurshaland cook
                </p>
              </div>
            </div>

            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors duration-200 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
