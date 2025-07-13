import { PostComment, Profile, RecipeComment } from "@/utils/types/recipe";
import { Star, Trash } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { useRecipeDetailStore } from "@/store/Recipedetail";
import { format_date } from "@/utils/formatdate";
import avater from "@/public/placeholder-user.jpg";

interface RecipeCommentListProps {
  comments: PostComment[];
  user_id: string;
}

const RecipeCommentList = ({ comments, user_id }: RecipeCommentListProps) => {
  const deleteComment = useRecipeDetailStore((state) => state.deleteComment);
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0"
        >
          <div className="flex items-start space-x-3">
            <img
              src={comment.author?.avatar_url || avater.src}
              alt={comment.author.username}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {comment.author.username}
                </span>
                <div className="flex">
                  {[...Array(comment.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 text-yellow-500 fill-current"
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {format_date(comment.created_at!)}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                {comment.comment}
              </p>

              {/* <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                        >
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {comment.likes}
                        </Button> */}
            </div>
            {user_id === comment.author_id && (
              <Button
                variant={"ghost"}
                type="button"
                onClick={async () => await deleteComment(comment.id)}
              >
                <Trash />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipeCommentList;
