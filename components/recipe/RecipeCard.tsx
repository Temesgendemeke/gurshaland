"use client";

import React, { useState } from "react";
import type Recipe from "@/utils/types/recipe";
import {
  ArrowUpRight,
  ChefHat,
  Clock,
  MoreVertical,
  Pencil,
  Star,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import format_time from "@/utils/format_time";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteRecipe } from "@/actions/Recipe/recipe";
import { toast } from "sonner";

interface RecipeCardProp {
  recipe: Recipe;
  badge?: string;
  icon?: React.ReactNode;
  isOwn?: boolean;
}

const RecipeCard = ({ recipe, badge, icon, isOwn }: RecipeCardProp) => {
  const totalMinutes = (recipe.cooktime ?? 0) + (recipe.preptime ?? 0);
  const displayTime = totalMinutes > 0 ? format_time(totalMinutes) : "Unknown";
  const displayRating =
    typeof recipe.average_rating === "number"
      ? recipe.average_rating.toFixed(1)
      : null;

  const router = useRouter();
  const user = useAuth((store) => store.user);
  const [deleting, setDeleting] = useState(false);

  // Strip query params from slug for edit/delete links
  const cleanSlug = recipe.slug.split("?")[0];

  const canEdit = isOwn && user?.id === recipe.author_id;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cleanSlug) return;
    try {
      setDeleting(true);
      await deleteRecipe(cleanSlug);
      toast.success("Recipe deleted");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete recipe");
      setDeleting(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/recipes/edit/${cleanSlug}`);
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border/70 bg-card transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 hover:border-foreground/35">
      {/* Three-dot menu for own recipes */}
      {canEdit && (
        <div className="absolute top-3 right-3 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm hover:bg-background"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
              <DropdownMenuItem onClick={handleEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete recipe?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. &quot;{recipe.title}&quot;
                      will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      onClick={handleDelete}
                      disabled={deleting}
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Image */}
      <Link
        href={`/recipes/${cleanSlug}`}
        className="absolute inset-0 z-10"
        tabIndex={-1}
        aria-hidden
      />
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={recipe.image?.url || "/placeholder.svg"}
          alt={recipe.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
        />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        {(badge || recipe.category?.name) && (
          <div className="mb-3 flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {badge && (
              <span className="inline-flex items-center gap-1 text-primary">
                {icon ||
                  (badge.toLowerCase() === "trending" && (
                    <TrendingUp className="h-3 w-3" />
                  ))}
                {badge}
              </span>
            )}
            {badge && recipe.category?.name && (
              <span aria-hidden="true">/</span>
            )}
            {recipe.category?.name}
          </div>
        )}

        <h3 className="mb-2 line-clamp-2 font-gosh text-xl font-semibold leading-tight tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
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
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-bold text-muted-foreground">
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

            <span className="text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
