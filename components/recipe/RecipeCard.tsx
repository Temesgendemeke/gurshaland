import React from "react";
import { Card } from "../ui/card";
import type Recipe from "@/utils/types/recipe";
import { ChefHat, Clock, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import format_time from "@/utils/format_time";
import { Button } from "../ui/button";
import Link from "next/link";

interface RecipeCardProp {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProp) => {
  const totalMinutes = (recipe.cooktime ?? 0) + (recipe.preptime ?? 0);
  const displayTime = totalMinutes > 0 ? format_time(totalMinutes) : "Unknown";
  const displayRating =
    typeof recipe.average_rating === "number"
      ? recipe.average_rating.toFixed(1)
      : "—";

  return (
    <Card
      key={recipe.id}
      className="modern-card modern-card-hover overflow-hidden mb-10 group rounded-xl border border-black/5 dark:border-white/5 transition-shadow duration-300 hover:shadow-xl"
    >
      <div className="relative">
        <img
          src={recipe.image?.url || "/placeholder.svg"}
          alt={recipe.title}
          loading="lazy"
          decoding="async"
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

        <div
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1"
          title="Average rating"
        >
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium text-gray-700">
            {displayRating}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex flex-wrap gap-1">
            {recipe.tags?.slice(0, 3).map((tag: string) => (
              <Badge
                key={tag}
                className="text-xs bg-black/50 text-white hover:bg-black/60"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="heading-secondary break-words whitespace-normal max-w-full group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
          {recipe.title}
        </h3>
        <p className="text-body mb-4 line-clamp-2">{recipe.description}</p>

        <div className="flex items-center justify-between text-sm text-body-muted mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-baseline space-x-1">
              <Clock size={16} />
              <span>{displayTime}</span>
            </div>
            <div className="flex items-baseline space-x-1">
              <Users size={16} />
              <span>{recipe.servings ?? "-"}</span>
            </div>
            <div className="flex items-baseline space-x-1">
              <ChefHat size={16} />
              <span>{recipe.difficulty || ""}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-body-muted">
            by {recipe.author?.username || "noname"}
          </div>
          <div className="text-sm text-body-muted">
            {recipe.reviews} reviews
          </div>
        </div>

        <div className="px-6 pb-6">
          <Button asChild className="w-full btn-primary-modern rounded-full">
            <Link href={`/recipes/${recipe.slug}`}>View Recipe</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default RecipeCard;
