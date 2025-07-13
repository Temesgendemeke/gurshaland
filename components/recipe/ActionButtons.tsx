import { Bookmark, Heart, Share2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { RecipeLike } from "@/utils/types/recipe";
import { useRecipeDetailStore } from "@/store/Recipedetail";
import { useRouter } from "next/navigation";

interface ActionButtonsProps {
  user_id: string;
  recipe_id: string;
}

const ActionButtons = ({ recipe_id, user_id }: ActionButtonsProps) => {
  const isLiked = useRecipeDetailStore((state) => state.isLiked);
  const toggleLike = useRecipeDetailStore((state) => state.toggleLike);
  const likes = useRecipeDetailStore((state) => state.recipe?.likes);
  const setIsliked = useRecipeDetailStore((state) => state.setIsLiked);
  const router = useRouter();
  const setIsBookmarked = useRecipeDetailStore((state) => state.setBookmarked)
  const isBookmarked = useRecipeDetailStore((state) => state.isBookmarked)
  const toggleBookmark = useRecipeDetailStore((state) => state.toggleBookmark)

  useEffect(() => {
    setIsliked(user_id)
    setIsBookmarked(user_id)
  }, []);

  const handleLike = () => {
    if (!recipe_id || !user_id) {
      return router.push("/login");
    }

    toggleLike(user_id, recipe_id);
  };

  const handleBookmark = ()=>{
     if (!recipe_id || !user_id) {
      return router.push("/login");
     }
     toggleBookmark(user_id, recipe_id)
  }

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <p>{JSON.stringify(isBookmarked)}</p>
      <Button
        onClick={handleLike}
        variant={isLiked ? "default" : "outline"}
        className="flex-1 sm:flex-none"
      >
        <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
        {isLiked ? "Liked" : "Like"} ({likes?.length})
      </Button>
      <Button
        onClick={handleBookmark}
        variant={isBookmarked ? "default" : "outline"}
        className="flex-1 sm:flex-none"
      >
        <Bookmark
          className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-current" : ""}`}
        />
        {isBookmarked ? "Saved" : "Save"}
      </Button>
      {/* <Button variant={`outline` }>
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </Button> */}
    </div>
  );
};

export default ActionButtons;
