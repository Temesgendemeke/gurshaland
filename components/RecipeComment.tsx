"use client";
import React, { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRecipeDetailStore } from "@/store/Recipedetail";
import { postComment } from "@/actions/Recipe/comment";
import type { RecipeComment  } from "@/utils/types/recipe";

interface RecipeCommentProps {
  user_id: string | undefined;
  recipe_id: string | undefined;
}

const RecipeComment = ({ user_id, recipe_id }: RecipeCommentProps) => {
  const [comment, setComment] = useState("");
  const router = useRouter();
  const addComment = useRecipeDetailStore((store) => store.addComment);

  const handlePostComment = async () => {

    if (!user_id || !recipe_id) {
      return router.push("/login");
    }
    const data: RecipeComment = {
      comment,
      author_id: user_id,
      recipe_id,
    };

    try {
      const newComment = await postComment(data);
      addComment(newComment);
      setComment("");
    } catch (error) {
      toast.message("Failed to post comment. Please try again.");
    }
  };
  return (
    <div className="mb-6">
      <Textarea
        placeholder="Share your experience with this recipe..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="mb-3 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
      />
      <Button
        type="button"
        disabled={!comment}
        onClick={handlePostComment}
        className="bg-gradient-to-r from-emerald-600 to-yellow-500 hover:from-emerald-700 hover:to-yellow-600 text-white"
      >
        Post Comment
      </Button>
    </div>
  );
};

export default RecipeComment;
