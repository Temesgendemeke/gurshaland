"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Bookmark,
  Share2,
  Pencil,
  Trash2,
  Clock,
  Star,
  Users,
  Eye,
  Loader2,
} from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DownloadPdfButton from "@/components/pdf/DownloadPdfButton";
import { generateRecipePdf } from "@/actions/pdf";
import { RECIPE_PDF_CREDIT_COST } from "@/constants/creditCosts";
import { deleteRecipe } from "@/actions/Recipe/recipe";
import { postOrDeleteLike } from "@/actions/Recipe/like";
import { toggleBookmark } from "@/actions/Recipe/bookmark";
import { formatCount } from "@/utils/formatCount";
import { useAuth } from "@/store/useAuth";
import { toast } from "sonner";
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
import { cn } from "@/lib/utils";

interface RecipeHeaderProps {
  recipe: any;
  isOwner?: boolean;
}

export default function RecipeHeader({ recipe, isOwner: propIsOwner }: RecipeHeaderProps) {
  const router = useRouter();
  const user = useAuth((store) => store.user);

  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fast optimistic states
  const initialLikesCount =
    recipe?.likes?.length ??
    recipe?.like_count ??
    (Array.isArray(recipe?.rating) ? recipe.rating.length : 0);
  const initialIsLiked = Boolean(
    user?.id && recipe?.likes?.some((l: any) => l.liked_by === user.id || l.user_id === user.id)
  );
  const initialIsBookmarked = Boolean(
    user?.id &&
    recipe?.bookmarks?.some((b: any) => b.user_id === user.id)
  );

  const [likesCount, setLikesCount] = useState<number>(initialLikesCount);
  const [isLiked, setIsLiked] = useState<boolean>(initialIsLiked);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(initialIsBookmarked);

  const author = recipe?.author;
  const authorName = author?.full_name || author?.username || "Anonymous";
  const authorUsername = author?.username;

  const isOwner = Boolean(
    propIsOwner ||
    (user?.id && (user.id === recipe?.author_id || user.id === author?.id))
  );

  const categoryName =
    typeof recipe?.category === "string"
      ? recipe.category
      : recipe?.category?.name;

  const totalTime =
    recipe?.preptime && recipe?.cooktime
      ? Number(recipe.preptime) + Number(recipe.cooktime)
      : recipe?.preptime || recipe?.cooktime || null;

  const handleLike = async () => {
    if (!user?.id) {
      toast.info("Please sign in to like this recipe");
      return router.push("/login");
    }
    if (isOwner) {
      toast.info("You can't like your own recipe.");
      return;
    }
    if (!recipe?.id) return;

    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await postOrDeleteLike(user.id, String(recipe.id));
    } catch (err: any) {
      console.error("Like error:", err);
      setIsLiked(!nextLiked);
      setLikesCount((prev) => (!nextLiked ? prev + 1 : Math.max(0, prev - 1)));
      toast.error(err?.message || "Failed to update like");
    }
  };

  const handleBookmark = async () => {
    if (!user?.id) {
      toast.info("Please sign in to bookmark recipes");
      return router.push("/login");
    }
    if (!recipe?.id) return;

    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    toast.success(nextState ? "Saved to your bookmarks" : "Removed from bookmarks", {
      duration: 1500,
    });

    try {
      await toggleBookmark(user.id, String(recipe.id));
    } catch (err: any) {
      console.error("Bookmark error:", err);
      setIsBookmarked(!nextState);
      toast.error("Failed to update bookmark");
    }
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe?.title || "Recipe on Gurshaland",
          text: recipe?.description || "Check out this recipe on Gurshaland",
          url,
        });
        return;
      } catch (_) { }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      toast.success("Recipe link copied to clipboard!");
    }
  };

  const handleDelete = async () => {
    if (!recipe?.slug) return;
    try {
      setDeleting(true);
      await deleteRecipe(recipe.slug);
      toast.success("Recipe deleted successfully");
      router.push("/recipes");
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(err?.message || "Failed to delete recipe");
      setDeleting(false);
    }
  };

  return (
    <header className="space-y-5">
      {/* Category, Difficulty, Tags & Rating Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {categoryName && (
            <Link href={`/categories/${categoryName.toLowerCase()}`}>
              <Badge
                variant="outline"
                className="rounded-full border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                {categoryName}
              </Badge>
            </Link>
          )}
          {recipe?.difficulty && (
            <Badge
              variant="secondary"
              className="rounded-full border-border/60 bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground capitalize"
            >
              {recipe.difficulty}
            </Badge>
          )}
          {recipe?.tags?.map((tag: string) => (
            <Badge
              key={tag}
              variant="outline"
              className="rounded-full border-border/70 bg-transparent px-2.5 py-0.5 text-xs font-normal text-muted-foreground"
            >
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Editorial Rating Badge */}
        {recipe?.average_rating ? (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span>{recipe.average_rating}</span>
            <span className="text-[11px] font-normal opacity-75">Rating</span>
          </div>
        ) : null}
      </div>

      {/* Title */}
      <h1 className="font-gosh text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-[1.1] wrap-break-word">
        {recipe?.title}
      </h1>

      {/* Author Byline & Key Meta Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border/60 py-3.5">
        {/* Author info */}
        <div className="flex items-center gap-3">
          {authorUsername ? (
            <Link
              href={`/profile/${authorUsername}`}
              className="flex items-center gap-3 group"
            >
              <UserAvatar
                avatarUrl={author?.avatar_url || author?.avatar}
                name={authorName}
                username={authorUsername}
                className="h-10 w-10 ring-1 ring-border/70 transition-transform group-hover:scale-105"
              />
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {authorName}
                </p>
                <p className="text-xs text-muted-foreground">@{authorUsername}</p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <UserAvatar
                avatarUrl={author?.avatar_url || author?.avatar}
                name={authorName}
                username={authorUsername || "user"}
                className="h-10 w-10 ring-1 ring-border/70"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">{authorName}</p>
                <p className="text-xs text-muted-foreground">Gurshaland Contributor</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick specs pills */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {totalTime && (
            <span className="inline-flex items-center gap-1 font-medium text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {totalTime} min
            </span>
          )}
          {recipe?.servings && (
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {recipe.servings} servings
            </span>
          )}
          {recipe?.view_count != null && (
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {formatCount(recipe.view_count)} views
            </span>
          )}
        </div>
      </div>

      {/* Action Bar (Like, Bookmark, Download PDF, Share, Edit/Delete) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1.5">
        {/* Primary Reader Actions */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Like */}
          {!isOwner && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLike}
              className={cn(
                "h-8 px-2.5 sm:px-3 rounded-lg border text-xs font-medium gap-1.5 transition-all duration-150 active:scale-[0.98]",
                isLiked
                  ? "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/15"
                  : "border-border/80 bg-background/60 hover:bg-accent/80 text-foreground"
              )}
            >
              <Heart
                className={cn(
                  "h-3.5 w-3.5 transition-colors",
                  isLiked
                    ? "fill-rose-600 text-rose-600 dark:fill-rose-400 dark:text-rose-400"
                    : "text-muted-foreground"
                )}
              />
              <span>{likesCount}</span>
            </Button>
          )}

          {/* Bookmark */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBookmark}
            className={cn(
              "h-8 px-2.5 sm:px-3 rounded-lg border text-xs font-medium gap-1.5 transition-all duration-150 active:scale-[0.98]",
              isBookmarked
                ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15 font-semibold"
                : "border-border/80 bg-background/60 hover:bg-accent/80 text-foreground"
            )}
          >
            <Bookmark
              className={cn(
                "h-3.5 w-3.5 transition-colors",
                isBookmarked
                  ? "fill-primary text-primary"
                  : "text-muted-foreground"
              )}
            />
            <span>{isBookmarked ? "Saved" : "Save"}</span>
          </Button>

          {/* Download Recipe PDF */}
          <DownloadPdfButton
            generate={() => generateRecipePdf(recipe)}
            cost={RECIPE_PDF_CREDIT_COST}
            label={
              <>
                <span className="hidden sm:inline">Download </span>PDF
              </>
            }
            size="sm"
            className="h-8 px-2.5 sm:px-3 rounded-lg border-border/80 bg-background/60 hover:bg-accent/80 text-xs font-medium text-foreground"
          />

          {/* Share */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="h-8 px-2.5 sm:px-3 rounded-lg border border-border/80 bg-background/60 hover:bg-accent/80 text-xs font-medium text-foreground gap-1.5 transition-all duration-150 active:scale-[0.98]"
          >
            <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Share</span>
          </Button>
        </div>

        {/* Owner Controls */}
        {isOwner && (
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto sm:ml-0">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-8 px-2.5 sm:px-3 rounded-lg border border-border/80 bg-background/60 hover:bg-accent/80 text-xs font-medium text-foreground gap-1.5 transition-all duration-150 active:scale-[0.98]"
            >
              <Link href={`/recipes/edit/${recipe.slug || recipe.id}`}>
                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Edit</span>
              </Link>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="h-8 px-2.5 sm:px-3 rounded-lg border border-border/80 bg-background/60  hover:bg-destructive/70 text-xs font-medium text-muted-foreground  gap-1.5 transition-colors duration-150 active:scale-[0.98] bg-destructive text-white"
            >
              <Trash2 className="h-3.5 w-3.5 text-white  " />
              <span className="text-white">Delete</span>
            </Button>
          </div>
        )}
      </div>

      {/* Delete Recipe Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="w-[calc(100%-2rem)] max-w-md gap-5 rounded-2xl border border-border/80 bg-card/95 p-5 sm:p-6 backdrop-blur-md shadow-2xl">
          <div className="flex items-start gap-3.5">
            {/* <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-destructive/25 bg-destructive/10 text-destructive">
              <Trash2 className="h-5 w-5" />
            </div> */}
            <div className="space-y-1 text-left">
              <AlertDialogTitle className="font-gosh text-lg sm:text-xl font-bold tracking-tight text-foreground">
                Delete Recipe?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                This action cannot be undone. This will permanently delete{" "}
                <span className="font-semibold text-foreground">
                  &ldquo;{recipe?.title}&rdquo;
                </span>{" "}
                along with its comments, bookmarks, and ratings.
              </AlertDialogDescription>
            </div>
          </div>

          <AlertDialogFooter className="flex-row items-center justify-end gap-2 pt-3 border-t border-border/60">
            <AlertDialogCancel
              disabled={deleting}
              className="mt-0 h-9 rounded-lg border border-border/80 bg-background/80 px-4 text-xs sm:text-sm font-medium text-foreground hover:bg-accent hover:text-foreground active:scale-[0.98] transition-all"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="h-9 rounded-lg border border-destructive/30 bg-destructive px-4 text-xs sm:text-sm font-medium text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98] transition-all shadow-none gap-1.5"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Deleting…</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Recipe</span>
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
