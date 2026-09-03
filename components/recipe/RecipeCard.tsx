"use client";

import React, { useState } from "react";
import type Recipe from "@/utils/types/recipe";
import {
  Clock,
  MoreVertical,
  Pencil,
  Star,
  Trash2,
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteRecipe } from "@/actions/Recipe/recipe";
import { recipeStore } from "@/store/Recipe";
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Strip query params from slug for edit/delete links
  const cleanSlug = (recipe.slug ?? recipe.id ?? "").split("?")[0];

  const isOwner = Boolean(
    isOwn ||
    (user?.id && (
      user.id === recipe.author_id ||
      user.id === (recipe as any).author?.id ||
      user.id === (recipe as any).author_id ||
      user.id === recipe.profile?.id ||
      user.id === (recipe as any).user_id
    ))
  );

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cleanSlug) return;
    try {
      setDeleting(true);
      await deleteRecipe(cleanSlug);
      if (recipe.id) {
        recipeStore.getState().removeRecipe(recipe.id);
      }
      toast.success("Recipe deleted");
      setShowDeleteDialog(false);
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
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-300 hover:border-border hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4">
      {/* Three-dot menu for owner */}
      {isOwner && (
        <div className="absolute top-3 right-3 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm hover:bg-background text-foreground"
                aria-label="Recipe options"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 bg-background">
              <DropdownMenuItem
                onClick={handleEdit}
                className="cursor-pointer font-medium"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setShowDeleteDialog(true);
                }}
                className="cursor-pointer font-medium text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
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
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Image */}
      <Link
        href={`/recipes/${cleanSlug}`}
        className="absolute inset-0 z-10"
        tabIndex={-1}
        aria-hidden
      />
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={recipe.image?.url || "/placeholder.svg"}
          alt={recipe.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {(badge || recipe.category?.name) && (
          <p className="mb-2 text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">
            {badge && (
              <span className="text-primary font-semibold mr-1.5">
                {badge} ·
              </span>
            )}
            {recipe.category?.name}
          </p>
        )}

        <h3 className="mb-2 line-clamp-2 font-gosh text-lg sm:text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary leading-snug">
          {recipe.title}
        </h3>

        {recipe.description && (
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {recipe.description}
          </p>
        )}

        {/* Serene Footer */}
        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-[10px] font-medium text-foreground">
              {recipe.author?.avatar_url ? (
                <Image
                  src={recipe.author.avatar_url}
                  alt={recipe.author.username || "Author"}
                  fill
                  sizes="20px"
                  className="object-cover"
                />
              ) : (
                recipe.author?.username?.[0]?.toUpperCase() || "A"
              )}
            </span>
            <span className="truncate font-medium text-foreground/80 text-xs">
              {recipe.author?.username || "Anonymous"}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2.5 text-[11px]">
            {displayTime !== "Unknown" && (
              <span className="inline-flex items-center gap-1 text-muted-foreground/80">
                <Clock className="h-3 w-3" />
                {displayTime}
              </span>
            )}
            {displayRating && (
              <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                {displayRating}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
