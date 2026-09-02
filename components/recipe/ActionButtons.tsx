import {
  BookmarkIcon as Bookmark,
  HeartIcon as Heart,
  ShareIcon as ShareAlt,
} from "@heroicons/react/24/outline";
import {
  BookmarkIcon as SolidBookmark,
  HeartIcon as SolidHeart,
} from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type MotionProps,
} from "motion/react";
import { Button } from "../ui/button";
import { RecipeLike } from "@/utils/types/recipe";
import { useRecipeDetailStore } from "@/store/Recipedetail";
import { useRouter } from "next/navigation";
import DownloadPdfButton, {
  type GeneratePdfResult,
} from "@/components/pdf/DownloadPdfButton";
import { generateRecipePdf } from "@/actions/pdf";
import { RECIPE_PDF_CREDIT_COST } from "@/constants/creditCosts";

interface ActionButtonsProps {
  user_id: string;
  recipe_id: string;
  isOwner?: boolean;
}

const ActionButtons = ({
  recipe_id,
  user_id,
  isOwner = false,
}: ActionButtonsProps) => {
  const isLiked = useRecipeDetailStore((state) => state.isLiked);
  const toggleLike = useRecipeDetailStore((state) => state.toggleLike);
  const likes = useRecipeDetailStore((state) => state.recipe?.likes);
  const setIsliked = useRecipeDetailStore((state) => state.setIsLiked);
  const router = useRouter();
  const setIsBookmarked = useRecipeDetailStore((state) => state.setBookmarked);
  const isBookmarked = useRecipeDetailStore((state) => state.isBookmarked);
  const toggleBookmark = useRecipeDetailStore((state) => state.toggleBookmark);
  const reduce = useReducedMotion();
  const recipe = useRecipeDetailStore((state) => state.recipe);

  useEffect(() => {
    setIsliked(user_id);
    setIsBookmarked(user_id);
  }, []);

  const handleLike = () => {
    if (!recipe_id || !user_id) {
      return router.push("/login");
    }

    toggleLike(user_id, recipe_id);
  };

  const handleBookmark = () => {
    if (!recipe_id || !user_id) {
      return router.push("/login");
    }
    toggleBookmark(user_id, recipe_id);
  };

  const iconPop: MotionProps = {
    initial: reduce ? false : { scale: 0.4, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: reduce ? undefined : { scale: 0.4, opacity: 0 },
    transition: { type: "spring", stiffness: 500, damping: 18 },
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6 mt-2">
      {!isOwner && (
        <Button
          onClick={handleLike}
          variant={isLiked ? "default" : "outline"}
          className={`group flex-1 transition-[transform,background-color,border-color] duration-150 active:scale-[0.97]  ${isLiked ? "hover:bg-primary hover:text-primary-foreground" : "hover:bg-background hover:text-foreground"}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isLiked ? (
              <motion.span
                key="liked"
                {...iconPop}
                className="mr-2 inline-flex items-center"
              >
                <SolidHeart className="w-4 h-4" aria-hidden="true" />
              </motion.span>
            ) : (
              <motion.span
                key="unliked"
                {...iconPop}
                className="mr-2 inline-flex items-center"
              >
                <Heart
                  className="w-4 h-4 group-hover:hidden"
                  aria-hidden="true"
                />
                <SolidHeart
                  className="w-4 h-4 hidden group-hover:inline"
                  aria-hidden="true"
                />
              </motion.span>
            )}
          </AnimatePresence>
          {isLiked ? "Liked" : "Like"} ({likes?.length})
        </Button>
      )}
      <Button
        onClick={handleBookmark}
        variant={isBookmarked ? "default" : "outline"}
        className={`group flex-1 transition-[transform,background-color,border-color] duration-150 active:scale-[0.97] ${isBookmarked ? "hover:bg-primary hover:text-primary-foreground" : "hover:bg-background hover:text-foreground"}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isBookmarked ? (
            <motion.span
              key="bookmarked"
              {...iconPop}
              className="mr-2 inline-flex items-center"
            >
              <SolidBookmark className="w-4 h-4 " aria-hidden="true" />
            </motion.span>
          ) : (
            <motion.span
              key="not-bookmarked"
              {...iconPop}
              className="mr-2 inline-flex items-center"
            >
              <Bookmark
                className="w-4 h-4 group-hover:hidden"
                aria-hidden="true"
              />
              <SolidBookmark
                className="w-4 h-4 hidden group-hover:inline"
                aria-hidden="true"
              />
            </motion.span>
          )}
        </AnimatePresence>
        {isBookmarked ? "Saved" : "Save"}
      </Button>
      <DownloadPdfButton
        generate={() => {
          if (!recipe) {
            return Promise.resolve({
              success: false,
              error: "Recipe not found.",
            } as GeneratePdfResult);
          }
          return generateRecipePdf(recipe);
        }}
        cost={RECIPE_PDF_CREDIT_COST}
        label="Download Recipe PDF"
        size="default"
        className="flex-1 hover:bg-primary hover:text-primary-foreground "
      />
      {/* <Button variant={`outline` }>
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </Button> */}
    </div>
  );
};

export default ActionButtons;
