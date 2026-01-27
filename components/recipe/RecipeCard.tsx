import React from "react";
import { Card } from "../ui/card";
import type Recipe from "@/utils/types/recipe";
import {
  ChefHat,
  Clock,
  Star,
  Users,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Hash,
  Utensils,
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
      : "—";

  return (
    <Link href={`/recipes/${recipe.slug}`} className="group block h-full">
      <Card
        key={recipe.id}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-muted bg-card/70 shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={recipe.image?.url || "/placeholder.svg"}
            alt={recipe.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-70" />

          {/* Badge (Trending/Featured) */}
          {badge && (
            <div className="absolute left-3 top-3 z-20">
              <Badge
                className={cn(
                  "border-0 backdrop-blur-md shadow-sm font-bold uppercase tracking-wider text-[10px]",
                  badge.toLowerCase() === "trending"
                    ? "bg-popular text-white hover:bg-popular/90"
                    : badge.toLowerCase() === "featured"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-background/90 text-foreground hover:bg-background",
                )}
              >
                {icon ? (
                  <span className="mr-1 flex items-center">{icon}</span>
                ) : (
                  <>
                    {badge.toLowerCase() === "trending" && (
                      <TrendingUp className="mr-1 h-3 w-3" />
                    )}
                    {badge.toLowerCase() === "featured" && (
                      <Sparkles className="mr-1 h-3 w-3" />
                    )}
                  </>
                )}
                {badge}
              </Badge>
            </div>
          )}

          {/* Rating Badge */}
          <div className="absolute right-3 top-3 overflow-hidden rounded-full border border-white/20 bg-black/40 px-3 py-1.5 backdrop-blur-md transition-all duration-300 group-hover:bg-black/60">
            <div className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="text-xs font-bold text-white">
                {displayRating}
              </span>
            </div>
          </div>

          {/* Time Badge (Bottom Left on Image) */}
          <div className="absolute bottom-3 left-3">
            <Badge className="border-0 bg-background/80 text-foreground backdrop-blur-md hover:bg-background/90 font-medium">
              <Clock className="mr-1 h-3 w-3 text-primary" />
              {displayTime}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          {/* Top Meta: Cuisine & Servings/Difficulty */}
          <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 text-primary font-medium">
              <Utensils className="h-3.5 w-3.5" />
              <span>{recipe.category?.name || "Mixed"}</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>{recipe.servings || "-"} ppl</span>
            </div>
            {recipe.difficulty && (
              <>
                <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                <div
                  className={cn(
                    "flex items-center gap-1",
                    recipe.difficulty === "Easy" && "text-success",
                    recipe.difficulty === "Medium" && "text-warning",
                    recipe.difficulty === "Hard" && "text-error",
                  )}
                >
                  <ChefHat className="h-3.5 w-3.5" />
                  <span>{recipe.difficulty}</span>
                </div>
              </>
            )}
          </div>

          {/* Title & Description */}
          <h3 className="mb-2 line-clamp-1 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {recipe.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {recipe.description}
          </p>

          <div className="mt-auto">
            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {recipe.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-md bg-primary/5 px-2 py-1 text-[10px] font-medium text-primary"
                  >
                    <Hash className="mr-1 h-2.5 w-2.5 opacity-50" /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer: Author & Arrow */}
            <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                  {recipe.author?.avatar_url ? (
                    <Image
                      src={recipe.author.avatar_url}
                      alt={recipe.author.username || "Author"}
                      fill
                      className="object-cover"
                      sizes="36px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-xs font-bold text-primary">
                      {recipe.author?.username?.[0]?.toUpperCase() || "A"}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="line-clamp-1 text-xs font-semibold text-foreground">
                    {recipe.author?.username || "Anonymous"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Chef
                  </span>
                </div>
              </div>

              <div className="rounded-full bg-secondary/50 p-2 text-secondary-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default RecipeCard;
