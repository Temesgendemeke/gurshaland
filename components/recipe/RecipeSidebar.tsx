"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, ChefHat, Flame, Sparkles, Badge, Clock10Icon, Star } from "lucide-react";
import Recipe from "@/utils/types/recipe";
import IngredientsView from "@/components/IngredientsView";
import NutritionView from "@/components/NutritionView";
import RecipeRating from "@/components/RecipeRating";
import AuthorInfo from "@/components/AuthorInfo";

interface RecipeSidebarProps {
  recipe: any;
  featuredRecipes?: Recipe[];
  currentUserId?: string;
  isOwner?: boolean;
}

export default function RecipeSidebar({
  recipe,
  featuredRecipes = [],
  currentUserId,
  isOwner = false,
}: RecipeSidebarProps) {
  // Filter out the active recipe from sidebar suggestions
  const sidebarRecipes = featuredRecipes
    .filter((r) => r.slug !== recipe?.slug && r.id !== recipe?.id)
    .slice(0, 5);

  const totalTime =
    recipe?.preptime && recipe?.cooktime
      ? Number(recipe.preptime) + Number(recipe.cooktime)
      : recipe?.preptime || recipe?.cooktime || null;

  const userRating =
    Array.isArray(recipe?.rating) && currentUserId
      ? recipe.rating.find((r: any) => r.user_id === currentUserId)?.rating || 0
      : 0;

  return (
    <aside className="w-full space-y-6">
      {/* 1. Recipe Overview / Quick Specs Card */}
      <div className="rounded-xl border border-border bg-card/50 p-5">
        <div className="flex items-center justify-between pb-3.5 border-b border-border/60">
          <h3 className="font-gosh text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
            Recipe Overview
          </h3>
          {recipe?.difficulty && (
            <span className="rounded-full border border-border/80 bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground capitalize">
              {recipe.difficulty}
            </span>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5 text-sm">
          {recipe?.preptime ? (
            <div className="rounded-lg border border-border/60 bg-background/70 p-2.5">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-muted-foreground" />
                Prep Time
              </span>
              <p className="mt-0.5 font-semibold text-foreground text-sm">
                {recipe.preptime} mins
              </p>
            </div>
          ) : null}

          {recipe?.cooktime ? (
            <div className="rounded-lg border border-border/60 bg-background/70 p-2.5">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                <Flame className="h-3 w-3 text-muted-foreground" />
                Cook Time
              </span>
              <p className="mt-0.5 font-semibold text-foreground text-sm">
                {recipe.cooktime} mins
              </p>
            </div>
          ) : null}

          {totalTime ? (
            <div className="rounded-lg border border-border/60 bg-background/70 p-2.5">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                <Clock10Icon className="h-3 w-3 text-muted-foreground" />
                Total Time
              </span>
              <p className="mt-0.5 font-semibold text-foreground text-sm">
                {totalTime} mins
              </p>
            </div>
          ) : null}

          {recipe?.servings ? (
            <div className="rounded-lg border border-border/60 bg-background/70 p-2.5">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                <Users className="h-3 w-3 text-muted-foreground" />
                Servings
              </span>
              <p className="mt-0.5 font-semibold text-foreground text-sm">
                {recipe.servings} people
              </p>
            </div>
          ) : null}

          {recipe?.average_rating ? (
            <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-2.5">
              <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                Rating
              </span>
              <p className="mt-0.5 font-semibold text-foreground text-sm">
                {recipe.average_rating} / 5.0
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* 2. Ingredients Checklist */}
      {recipe?.ingredients && recipe.ingredients.length > 0 && (
        <IngredientsView ingredients={recipe.ingredients} />
      )}

      {/* 3. Nutrition Overview */}
      {recipe?.nutrition && (
        <NutritionView nutrition={recipe.nutrition} />
      )}

      {/* 4. Rating Card */}
      {!isOwner && recipe?.id && (
        <RecipeRating
          user_id={currentUserId || ""}
          recipe_id={String(recipe.id)}
          rating={userRating}
          isOwner={isOwner}
        />
      )}

      {/* 6. Featured / More Recipes Widget */}
      {/* {sidebarRecipes.length > 0 && (
        <div className="rounded-xl border border-border bg-card/50 p-5">
          <div className="flex items-center justify-between pb-4 border-b border-border/60">
            <h3 className="font-gosh text-base font-semibold tracking-tight text-foreground">
              Featured Recipes
            </h3>
            <Link
              href="/recipes"
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {sidebarRecipes.map((item: any, idx: number) => {
              const itemKey = item.id ?? item.slug ?? `sidebar-recipe-${idx}`;
              const itemImage =
                item?.image?.url ||
                (typeof item?.image === "string" ? item.image : null) ||
                "/placeholder.svg";
              const prepOrCook = item.preptime || item.cooktime;

              return (
                <Link
                  key={itemKey}
                  href={`/recipes/${item.slug || item.id}`}
                  className="group flex items-center gap-3.5 rounded-lg p-1.5 transition-colors hover:bg-muted/50"
                >
                  <div className="relative h-13 w-13 shrink-0 overflow-hidden rounded-md bg-muted border border-border/60">
                    <Image
                      src={itemImage}
                      alt={item.title || "Recipe"}
                      fill
                      sizes="52px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      {prepOrCook && <span>{prepOrCook}m</span>}
                      {prepOrCook && item.difficulty && <span>•</span>}
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
      )} */}
    </aside>
  );
}
